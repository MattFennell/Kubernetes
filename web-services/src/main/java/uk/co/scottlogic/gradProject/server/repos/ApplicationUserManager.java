package uk.co.scottlogic.gradProject.server.repos;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uk.co.scottlogic.gradProject.server.repos.documents.ApplicationUser;
import uk.co.scottlogic.gradProject.server.routers.dto.UserPatchDTO;

@Service
public class ApplicationUserManager {

  private ApplicationUserRepo applicationUserRepo;

  @Autowired
  public ApplicationUserManager(ApplicationUserRepo applicationUserRepo) {
    this.applicationUserRepo = applicationUserRepo;
  }

  public void patchUser(ApplicationUser user, UserPatchDTO userPatchDTO) {
    if (!userPatchDTO.isValid()){
      throw new IllegalArgumentException("Regex does not match");
    }

    if (userPatchDTO.getFirstName() != null) {
      user.setFirstName(userPatchDTO.getFirstName());
    }
    if (userPatchDTO.getSurname() != null) {
      user.setSurname(userPatchDTO.getSurname());
    }
    if (userPatchDTO.getPassword() != null) {
      user.savePassword(userPatchDTO.getPassword());
    }
    if (userPatchDTO.getUsername() != null) {
      Optional<ApplicationUser> appUser = applicationUserRepo.findByUsername(
          userPatchDTO.getUsername());
      if (appUser.isPresent()) {
        throw new IllegalArgumentException("Username already exists");
      }
      else {
        user.setUsername(userPatchDTO.getUsername());
      }
    }
    if (userPatchDTO.getEmail() != null) {
      Optional<ApplicationUser> email = applicationUserRepo.findByEmail(userPatchDTO.getEmail());
      if (email.isPresent()) {
        throw new IllegalArgumentException("Email already exists");
      }
      else {
        user.setEmail(userPatchDTO.getEmail());
      }
    }

    // Will only update their details if there are no errors with any of their inputs
    applicationUserRepo.save(user);
  }

}
