package uk.co.scottlogic.gradProject.server.repos;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import uk.co.scottlogic.gradProject.server.repos.documents.ApplicationUser;

@Repository
public interface ApplicationUserRepo extends CrudRepository<ApplicationUser, UUID> {

  public boolean existsByUsername(String username);

  public Optional<ApplicationUser> findByUsername(String username);

  public Optional<ApplicationUser> findByEmail(String email);
}
