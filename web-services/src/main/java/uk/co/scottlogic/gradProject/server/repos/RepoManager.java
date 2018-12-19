package uk.co.scottlogic.gradProject.server.repos;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public final class RepoManager {

  private static ApplicationUserRepo applicationUserRepo;

  @Autowired
  public RepoManager(ApplicationUserRepo applicationUserRepo) {
    RepoManager.applicationUserRepo = applicationUserRepo;
  }

  public static ApplicationUserRepo getApplicationUserRepo() {
    return applicationUserRepo;
  }

}
