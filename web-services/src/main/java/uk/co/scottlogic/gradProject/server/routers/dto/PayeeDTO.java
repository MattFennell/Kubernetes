package uk.co.scottlogic.gradProject.server.routers.dto;

import java.util.UUID;
import uk.co.scottlogic.gradProject.server.repos.documents.Payee;

public class PayeeDTO {

  private String name;

  private UUID id;

  public PayeeDTO(Payee payee) {
    this.name = payee.getName();
    this.id = payee.getId();
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
    this.name = name;
  }

}
