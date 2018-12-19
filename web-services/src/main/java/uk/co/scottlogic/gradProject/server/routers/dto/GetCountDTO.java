package uk.co.scottlogic.gradProject.server.routers.dto;

public class GetCountDTO {

  private String category_id;

  public GetCountDTO(String category_id) {
    this.category_id = category_id;
  }

  public String getCategory_id() {
    return category_id;
  }

  public void setCategory_id(String category_id) {
    this.category_id = category_id;
  }

}
