package uk.co.scottlogic.gradProject.server.repos;

import java.util.List;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import uk.co.scottlogic.gradProject.server.repos.documents.Payee;

@Repository
public interface PayeeRepo extends CrudRepository<Payee, UUID> {

  // Find all payees with the given name
  public List<Payee> findByName(String name);

}
