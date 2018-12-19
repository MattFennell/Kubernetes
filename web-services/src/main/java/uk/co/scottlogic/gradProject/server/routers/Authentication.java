package uk.co.scottlogic.gradProject.server.routers;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.co.scottlogic.gradProject.server.auth.JwtTokenProvider;
import uk.co.scottlogic.gradProject.server.auth.TokenPair;
import uk.co.scottlogic.gradProject.server.repos.ApplicationUserRepo;
import uk.co.scottlogic.gradProject.server.repos.documents.ApplicationUser;
import uk.co.scottlogic.gradProject.server.repos.documents.UserAuthority;
import uk.co.scottlogic.gradProject.server.routers.dto.LoginDTO;
import uk.co.scottlogic.gradProject.server.routers.dto.RegisterDTO;
import uk.co.scottlogic.gradProject.server.routers.dto.TokenReturnDTO;
import uk.co.scottlogic.gradProject.server.routers.dto.UserReturnDTO;

@RestController
@RequestMapping("/api")
@Api(value = "Authentication", description = "Operations pertaining to User details (For "
    + "authentication see token)")
public class Authentication {

  private static final Logger log = LoggerFactory.getLogger(Token.class);

  private JwtTokenProvider jwtTokenProvider;

  private ApplicationUserRepo applicationUserRepo;

  @Autowired
  public Authentication(ApplicationUserRepo applicationUserRepo,
      JwtTokenProvider jwtTokenProvider) {
    this.applicationUserRepo = applicationUserRepo;
    this.jwtTokenProvider = jwtTokenProvider;
  }

  @ApiOperation(value = "Login: Fetches a token pair for the user, either pass refresh token or "
      + "basic credentials")
  @ApiResponses(value = {
      @ApiResponse(code = 200, message = "Never returned but swagger won't let me get rid of it",
          response = void.class),
      @ApiResponse(code = 201, message = "Successful login/refresh", response =
          TokenReturnDTO.class),
      @ApiResponse(code = 403, message = "Forbidden - Login failed")})
  @PostMapping(value = "/token", produces = "application/json", consumes = "application/json")
  public TokenReturnDTO login(@RequestBody LoginDTO loginDTO, HttpServletResponse response) {
    try {
      switch (loginDTO.isValid()) {
        case CORRECT:
          break;
        case FIELD_ERROR:
          response.sendError(400, "Request Format Invalid."); //
          return null;
        case USERNAME_ERROR:
          response.sendError(403, "Username Invalid Format."); //
          return null;
        case PASSWORD_ERROR:
          response.sendError(403, "Password Invalid Format."); //
          return null;
      }
      if (loginDTO.isRefresh()) {
        TokenPair returnable = jwtTokenProvider.refresh(loginDTO.getRefresh());
        if (returnable == null) {
          response.setStatus(403); //
          return null;
        }
        response.setStatus(201); //
        return new TokenReturnDTO(returnable);
      } else {
        TokenPair returnable = jwtTokenProvider.login(loginDTO.getUsername(),
            loginDTO.getPassword());
        if (returnable == null) {
          response.setStatus(403); //
          return null;
        }
        response.setStatus(201); //
        return new TokenReturnDTO(returnable);
      }
    } catch (AuthenticationCredentialsNotFoundException E) {
      response.setStatus(403);
      return null;
    } catch (Exception e) {
      e.printStackTrace();
      System.out.println(e.getClass());
      response.setStatus(500);
      return null;
    }
  }

  @ApiOperation(value = "Registers a new user")
  @ApiResponses(value = {
      @ApiResponse(code = 200, message = "Never returned but swagger won't let me get rid of it"),
      @ApiResponse(code = 201, message = "User successfully registered"),
      @ApiResponse(code = 400, message = "Invalid parameters"),
      @ApiResponse(code = 401, message = "Invalid username / password"),
      @ApiResponse(code = 409, message = "User exists")})
  @PostMapping(value = "/user")
  public UserReturnDTO register(@RequestBody RegisterDTO registerDTO,
      HttpServletResponse response) {
    try {
      System.out.println("hey this is a register attempt");
      ApplicationUser user = new ApplicationUser(registerDTO);
      UserAuthority userRole = new UserAuthority("ROLE_USER");
      user.addAuthority(userRole);
      if (applicationUserRepo.count() == 0) {
        user.addAuthority(new UserAuthority("ROLE_ADMIN"));
      }
      applicationUserRepo.save(user);
      response.setStatus(201);
      return new UserReturnDTO(user);
    } catch (DataIntegrityViolationException e) {
      try {
        response.sendError(409, e.getMessage());
      } catch (Exception f) {
        response.setStatus(409);
      }
    } catch (IllegalArgumentException e) {
      try {
        response.sendError(400, e.getMessage());
      } catch (Exception f) {
        response.setStatus(400);
      }
    } catch (AuthenticationCredentialsNotFoundException e) {
      response.setStatus(401);
    }
    return null;
  }

}
