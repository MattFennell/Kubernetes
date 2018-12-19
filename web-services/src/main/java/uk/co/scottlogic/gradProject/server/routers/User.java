package uk.co.scottlogic.gradProject.server.routers;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.Authorization;
import java.io.IOException;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.co.scottlogic.gradProject.server.auth.JwtTokenProvider;
import uk.co.scottlogic.gradProject.server.misc.Icons;
import uk.co.scottlogic.gradProject.server.repos.ApplicationUserManager;
import uk.co.scottlogic.gradProject.server.repos.ApplicationUserRepo;
import uk.co.scottlogic.gradProject.server.repos.documents.ApplicationUser;
import uk.co.scottlogic.gradProject.server.routers.dto.UserPatchDTO;
import uk.co.scottlogic.gradProject.server.routers.dto.UserReturnDTO;

@RestController
@RequestMapping("/api")
@Api(value = "user", description = "Operations pertaining to User details (For authentication see"
    + " token)")
public class User {

  private static final Logger log = LoggerFactory.getLogger(User.class);

  @Autowired
  private JwtTokenProvider jwtTokenProvider;

  private ApplicationUserRepo applicationUserRepo;

  private ApplicationUserManager applicationUserManager;

  @Autowired
  public User(ApplicationUserRepo applicationUserRepo,
      ApplicationUserManager applicationUserManager) {
    this.applicationUserRepo = applicationUserRepo;
    this.applicationUserManager = applicationUserManager;
  }

  @ApiOperation(value = Icons.key
      + " Deletes Current user", notes = "Requires User role", authorizations = {
      @Authorization(value = "jwtAuth")})
  @ApiResponses(value = {@ApiResponse(code = 204, message = "User Successfully deleted"),
      @ApiResponse(code = 403, message = "Not permitted to do that")})
  @DeleteMapping("/user/current")
  @PreAuthorize("hasRole('USER')")
  public void deleteCurrent(@AuthenticationPrincipal ApplicationUser user,
      HttpServletResponse response) {
    applicationUserRepo.delete(user);
    response.setStatus(204);
  }

  @ApiOperation(value = Icons.key
      + " Gets all user details", notes = "Requires User role", response = UserReturnDTO.class,
      authorizations = {
      @Authorization(value = "jwtAuth")})
  @ApiResponses(value = {@ApiResponse(code = 200, message = "Users successfully returned"),
      @ApiResponse(code = 403, message = "You are not permitted to perform that action")})
  @GetMapping("/user/all")
  @PreAuthorize("hasRole('ADMIN')")
  public Iterable<ApplicationUser> getAll(@AuthenticationPrincipal ApplicationUser user,
      HttpServletResponse response) {
    try {
      return applicationUserRepo.findAll();
    } catch (Exception e) {
      log.error(e.getMessage());
    }
    try {
      response.sendError(500, "Cannot be no users in the system if this is performed");
    } catch (IOException e) {
      response.setStatus(500);
    }
    return null;
  }

  @ApiOperation(value = Icons.key
      + " Gets current user details", notes = "Requires User role", response =
      UserReturnDTO.class, authorizations = {
      @Authorization(value = "jwtAuth")})
  @ApiResponses(value = {@ApiResponse(code = 200, message = "User successfully returned"),
      @ApiResponse(code = 403, message = "You are not permitted to perform that action")})
  @GetMapping("/user/current")
  @PreAuthorize("hasRole('USER')")
  public UserReturnDTO getCurrent(@AuthenticationPrincipal ApplicationUser user,
      HttpServletResponse response) {
    try {
      return new UserReturnDTO(user);
    } catch (Exception e) {
      log.error(e.getMessage());
    }
    return null;
  }

  @ApiOperation(value = Icons.key
      + " Patches current user detail", notes = "Requires User role", response = void.class,
      authorizations = {
      @Authorization(value = "jwtAuth")})
  @ApiResponses(value = {@ApiResponse(code = 200, message = "User Successfully Patched"),
      @ApiResponse(code = 400, message = "Patch property not valid"),
      @ApiResponse(code = 403, message = "You are not permitted to perform that action"),
      @ApiResponse(code = 409, message = "Patch property conflicts with existing resource or "
          + "property"), @ApiResponse(code = 500, message = "Server Error")})
  @PatchMapping("/user/current")
  @PreAuthorize("hasRole('USER')")
  public void patchCurrent(@AuthenticationPrincipal ApplicationUser user,
      @RequestBody UserPatchDTO dto, HttpServletResponse response) {
    try {
      applicationUserManager.patchUser(user, dto);
    } catch (IllegalArgumentException e) {
      try {
        response.sendError(400, e.getMessage());
      } catch (IOException e1) {
        e1.printStackTrace();
      }
      log.error(e.getMessage());
      response.setStatus(500);
    }
  }
}