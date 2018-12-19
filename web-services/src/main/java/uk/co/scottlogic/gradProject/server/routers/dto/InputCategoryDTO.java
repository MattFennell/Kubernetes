package uk.co.scottlogic.gradProject.server.routers.dto;

public class InputCategoryDTO {

  private String category_id;

  public InputCategoryDTO(String id) {
    this.category_id = id;
  }

  public InputCategoryDTO() {
  }

  public String getCategory_id() {
    return category_id;
  }

  public void setCategory_id(String category_id) {
    this.category_id = category_id;
  }

}
