package uk.co.scottlogic.gradProject.server.repos.documents;
import static uk.co.scottlogic.gradProject.server.misc.Regex.PAYEE_NAME_PATTERN;

import java.util.UUID;
import javax.persistence.Entity;
import javax.persistence.Id;
import org.hibernate.annotations.Type;

@Entity
public class Payee {

  @Id
  @Type(type = "uuid-char")
  private UUID id;

  private String name;

  private String address;

  public Payee() {
  }

  public Payee(String name) {
    id = UUID.randomUUID();
    setName(name);
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    if (!name.matches(PAYEE_NAME_PATTERN)) {
      throw new IllegalArgumentException();
    }
    this.name = name;
  }

}
