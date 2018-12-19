package uk.co.scottlogic.gradProject.server.auth;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.SignatureVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;
import org.joda.time.DateTime;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.authentication.UserCredentials;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;
import uk.co.scottlogic.gradProject.server.repos.ApplicationUserRepo;
import uk.co.scottlogic.gradProject.server.repos.RefreshTokenRepo;
import uk.co.scottlogic.gradProject.server.repos.documents.ApplicationUser;

@RunWith(SpringRunner.class)
@ContextConfiguration
@TestPropertySource("classpath:application.properties")
public class JwtTokenProviderTest {

  @Value("${server.host}")
  private String host;

  @Value("${jwt.secret}")
  private String secret_str;

  @Mock
  private ApplicationUserRepo applicationUserRepo;

  @Mock
  private RefreshTokenRepo refreshTokenRepo;

  private JwtTokenProvider jwtTokenProvider;

  private String testToken;

  @Before
  public void setUp() throws Exception {
    byte[] secret = secret_str.getBytes();
    Algorithm algorithm = Algorithm.HMAC256(secret);
    testToken = JWT.create()
        .withIssuer(host)
        .withAudience(host)
        .withSubject(UUID.randomUUID().toString())
        .withExpiresAt(new DateTime(new Date()).plusDays(1).toDate())
        .withClaim("type", "access")
        .sign(algorithm);
    jwtTokenProvider = new JwtTokenProvider(host, secret_str, applicationUserRepo,
        refreshTokenRepo);
    jwtTokenProvider.setAlgorithm(algorithm);
  }

  @Test(expected = IllegalArgumentException.class)
  public void shouldFailIfSecretStringTooShort() throws Exception{
    String shortString = "";
    int lengthOfString = 63;
    for (int i = 0; i < lengthOfString; i ++){
      shortString += "a";
    }
    jwtTokenProvider = new JwtTokenProvider(host, shortString, applicationUserRepo,
        refreshTokenRepo);
  }

  @Test
  public void shouldPassIfSecretStringAtLeast64Chars() throws Exception{
    String longString = "";
    int lengthOfString = 64;
    for (int i = 0; i < lengthOfString; i ++){
      longString += "a";
    }
    jwtTokenProvider = new JwtTokenProvider(host, longString, applicationUserRepo,
        refreshTokenRepo);
  }

  @Test
  public void getAuthentication_ReturnsAUsernamePasswordAuthenticationToken_WhenUserExists() {
    // Setup
    ApplicationUser returnedUser = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    when(applicationUserRepo.findById(any())).thenReturn(Optional.of(returnedUser));
    // Test
    var token = jwtTokenProvider.getAuthentication(testToken);
    // Assert
    assertNotNull(token);
  }

  @Test
  public void getAuthentication_ReturnsAUsernamePasswordAuthenticationTokenContainsCorrectUsernameInPrincipal_WhenUserExists() {
    // Setup
    ApplicationUser returnedUser = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    when(applicationUserRepo.findById(any())).thenReturn(Optional.of(returnedUser));
    // Test
    var token = jwtTokenProvider.getAuthentication(testToken);
    // Assert
    assertEquals("a", ((ApplicationUser) token.getPrincipal()).getUsername());
  }

  @Test
  public void getAuthentication_ReturnsAUsernamePasswordAuthenticationTokenContainsCorrectUsernameInCredentials_WhenUserExists() {
    // Setup
    ApplicationUser returnedUser = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    when(applicationUserRepo.findById(any())).thenReturn(Optional.of(returnedUser));
    // Test
    var token = jwtTokenProvider.getAuthentication(testToken);
    // Assert
    assertEquals("a", ((UserCredentials) token.getCredentials()).getUsername());
  }

  @Test(expected = UsernameNotFoundException.class)
  public void getAuthentication_ThrowsUsernameNotFoundException_WhenUserDoesNotExist() {
    // Setup
    when(applicationUserRepo.findById(any())).thenReturn(Optional.empty());
    // Test
    jwtTokenProvider.getAuthentication(testToken);
  }

  @Test(expected = JWTDecodeException.class)
  public void getAuthentication_ThrowsJWTDecodeException_WhenTokenIsNotValid() {
    // Test
    jwtTokenProvider.getAuthentication("token");
  }

  @Test(expected = SignatureVerificationException.class)
  public void getAuthentication_ThrowsSignatureVerificationException_WhenTokenSignatureIsNotValid() {
    // Setup
    ApplicationUser returnedUser = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    when(applicationUserRepo.findById(any())).thenReturn(Optional.of(returnedUser));
    Algorithm algorithm = Algorithm.HMAC256("adifferentsecret");
    var badActorToken = JWT.create()
        .withIssuer(host)
        .withAudience(host)
        .withSubject(UUID.randomUUID().toString())
        .withExpiresAt(new DateTime(new Date()).plusDays(1).toDate())
        .withClaim("type", "access")
        .sign(algorithm);
    // Test
    jwtTokenProvider.getAuthentication(badActorToken);
  }

  @Test(expected = TokenExpiredException.class)
  public void getAuthentication_ThrowsException_WhenTokenHasExpired() {
    // Setup
    ApplicationUser returnedUser = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    when(applicationUserRepo.findById(any())).thenReturn(Optional.of(returnedUser));
    Algorithm algorithm = Algorithm.HMAC256(secret_str);
    var oldToken = JWT.create()
        .withIssuer(host)
        .withAudience(host)
        .withSubject(UUID.randomUUID().toString())
        .withExpiresAt(new DateTime(new Date()).minusDays(1).toDate())
        .withClaim("type", "access")
        .sign(algorithm);
    // Test
    jwtTokenProvider.getAuthentication(oldToken);
  }

  @Test
  public void login_DoesCreateAccessToken_WhenUserExists() {
    // Setup
    ApplicationUser returnedUser = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    when(applicationUserRepo.findByUsername(eq("a"))).thenReturn(Optional.of(returnedUser));
    when(applicationUserRepo.findById(any())).thenReturn(Optional.of(returnedUser));
    // Test
    TokenPair token = jwtTokenProvider.login("a", "123456");
    // Assert
    assertNotNull(token.getAccess());
  }

  @Test
  public void login_DoesCreateRefreshToken_WhenUserExists() {
    // Setup
    ApplicationUser returnedUser = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    when(applicationUserRepo.findByUsername(eq("a"))).thenReturn(Optional.of(returnedUser));
    when(applicationUserRepo.findById(any())).thenReturn(Optional.of(returnedUser));
    // Test
    TokenPair token = jwtTokenProvider.login("a", "123456");
    // Assert
    assertNotNull(token.getRefresh());
  }

  @Test(expected = AuthenticationCredentialsNotFoundException.class)
  public void login_ThrowsCredentialsException_WhenUserDoesNotExist() {
    // Setup
    when(applicationUserRepo.findByUsername(any())).thenReturn(Optional.empty());
    // Test
    jwtTokenProvider.login("a", "b");
  }

}
