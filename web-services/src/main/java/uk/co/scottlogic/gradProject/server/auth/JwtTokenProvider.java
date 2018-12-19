package uk.co.scottlogic.gradProject.server.auth;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;
import javax.servlet.http.HttpServletRequest;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.authentication.UserCredentials;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Component;
import uk.co.scottlogic.gradProject.server.repos.ApplicationUserRepo;
import uk.co.scottlogic.gradProject.server.repos.RefreshTokenRepo;
import uk.co.scottlogic.gradProject.server.repos.documents.ApplicationUser;
import uk.co.scottlogic.gradProject.server.repos.documents.RefreshToken;

@Component
public class JwtTokenProvider {

  private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

  private String iss;

  private ApplicationUserRepo applicationUserRepo;

  private RefreshTokenRepo refreshTokenRepo;

  private Algorithm algorithm;

  private JWTVerifier jwtVerifier;

  private byte[] secret;

  @Autowired
  public JwtTokenProvider(@Value("${jwt.fqdn}") String host,
      @Value("${jwt.secret}") String secretStr, ApplicationUserRepo applicationUserRepo,
      RefreshTokenRepo refreshTokenRepo) throws NoSuchAlgorithmException {
    if (secretStr.length() < 64) {
      throw new IllegalArgumentException("JWT_SECRET must be at least 64 characters");
    }
    secret = secretStr.getBytes(StandardCharsets.UTF_8);
    this.iss = host;
    this.applicationUserRepo = applicationUserRepo;
    this.refreshTokenRepo = refreshTokenRepo;
    setAlgorithm(Algorithm.HMAC512(secret));
  }

  void setAlgorithm(Algorithm algorithm) {
    this.algorithm = algorithm;
    jwtVerifier = JWT.require(algorithm).withIssuer(iss).withAudience(iss).build();
  }

  private TokenPair createToken(UUID id) {
    try {
      String access = JWT.create()
          .withIssuer(iss)
          .withAudience(iss)
          .withSubject(id.toString())
          .withExpiresAt(new DateTime(new Date()).plusDays(1).toDate())
          .withClaim("type", "access")
          .sign(algorithm);
      String refresh = JWT.create()
          .withJWTId(UUID.randomUUID().toString())
          .withIssuer(iss)
          .withAudience(iss)
          .withSubject(id.toString())
          .withExpiresAt(new DateTime(new Date()).plusYears(1).toDate())
          .withClaim("type", "refresh")
          .sign(algorithm);
      DecodedJWT jwt = JWT.decode(refresh);
      refreshTokenRepo.save(
          new RefreshToken(UUID.fromString(jwt.getId()), applicationUserRepo.findById(id).get(),
              jwt.getExpiresAt()));
      return new TokenPair(access, refresh);
    } catch (JWTCreationException exception) {
      log.error(exception.getMessage());
      return null;
    }
  }

  public Authentication getAuthentication(String token) {
    final UUID userId = UUID.fromString(getUserId(token));
    return applicationUserRepo.findById(userId)
        .map(user -> new UsernamePasswordAuthenticationToken(user,
            new UserCredentials(user.getUsername(), ""), user.getAuthorities()))
        .orElseThrow(() -> new UsernameNotFoundException(getUserId(token)));
  }

  public String getUserId(String token) {
    return jwtVerifier.verify(token).getSubject().trim();
  }

  public TokenPair login(String username, String password) {
    Optional<ApplicationUser> user = applicationUserRepo.findByUsername(username);
    if (user.isPresent()) {
      if (BCrypt.checkpw(password, user.get().getPassword())) {
        return createToken(user.get().getUuid());
      } else {
        throw new AuthenticationCredentialsNotFoundException("password");
      }
    } else {
      throw new AuthenticationCredentialsNotFoundException(username);
    }
  }

  public TokenPair refresh(String refresh) {
    if (validateToken(refresh)) {
      TokenPair tokens = createToken(UUID.fromString(getUserId(refresh)));
      Optional<RefreshToken> optOld = refreshTokenRepo.findById(
          UUID.fromString(JWT.decode(refresh).getId()));
      if (!optOld.isPresent()) {
        return null;
      }
      RefreshToken old = optOld.get();
      old.setUsed(true);
      refreshTokenRepo.save(old);
      return tokens;
    } else {
      return null;
    }
  }

  public String resolveToken(HttpServletRequest req) {
    String bearerToken = req.getHeader("Authorization");
    if (bearerToken != null && bearerToken.startsWith("Bearer")) {
      return bearerToken.substring(6).trim();
    }
    return bearerToken == null ? null : bearerToken.trim();
  }

  public boolean validateToken(String token) {
    try {
      DecodedJWT jwt = jwtVerifier.verify(token);
      if (jwt.getClaim("type").asString().equals("refresh")) {
        Optional<RefreshToken> optoken = refreshTokenRepo.findById(UUID.fromString(jwt.getId()));
        if (!optoken.isPresent()) {
          return false;
        }
        RefreshToken old = optoken.get();
        if (old.isUsed()) {
          return false;
        }
      }
      return true;
    } catch (JWTVerificationException e) {
      log.error(e.getMessage());
      return false;
    }
  }

}
