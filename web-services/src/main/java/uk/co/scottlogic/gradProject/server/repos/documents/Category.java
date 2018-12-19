package uk.co.scottlogic.gradProject.server.repos.documents;

import static uk.co.scottlogic.gradProject.server.misc.Regex.CATEGORY_DESCRIPTION_PATTERN;

import java.util.Objects;
import java.util.UUID;
import javax.persistence.Entity;
import javax.persistence.Id;
import org.hibernate.annotations.Type;

@Entity
public class Category {

  @Id
  @Type(type = "uuid-char")
  private UUID id;

  private String description;

  public Category() {
  }

  public Category(String description) {
    id = UUID.randomUUID();
    setDescription(description);
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    Category category = (Category) o;
    return Objects.equals(getId(), category.getId()) && Objects.equals(getDescription(),
        category.getDescription());
  }

  @Override
  public int hashCode() {
    return Objects.hash(getId(), getDescription());
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
    if (!description.matches(CATEGORY_DESCRIPTION_PATTERN)) {
      throw new IllegalArgumentException();
    }
    this.description = description;
  }

}
