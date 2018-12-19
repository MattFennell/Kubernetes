package uk.co.scottlogic.gradProject.server.routers.dto;

import java.util.UUID;
import uk.co.scottlogic.gradProject.server.repos.documents.Category;

public class CategoryDTO {

  private String description;

  private UUID id;

  public CategoryDTO(Category category) {
    this.description = category.getDescription();
    this.id = category.getId();
  }

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

}
