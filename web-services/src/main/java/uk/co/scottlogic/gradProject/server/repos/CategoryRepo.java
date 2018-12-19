package uk.co.scottlogic.gradProject.server.repos;

import java.util.List;
import java.util.UUID;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import uk.co.scottlogic.gradProject.server.repos.documents.Category;

@Repository
public interface CategoryRepo extends CrudRepository<Category, UUID> {

  // Find all categories with the given description
  public List<Category> findByDescription(String description);

}
