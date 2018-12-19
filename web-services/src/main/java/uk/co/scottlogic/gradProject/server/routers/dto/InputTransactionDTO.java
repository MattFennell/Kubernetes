package uk.co.scottlogic.gradProject.server.routers.dto;

import com.fasterxml.jackson.annotation.JsonCreator;

public class InputTransactionDTO {

  private long amount;

  private String user_id;

  private String category_id;

  private String payee_id;

  public InputTransactionDTO(long amount, String user_id, String category_id, String payee_id) {
    this.amount = amount;
    this.category_id = category_id;
    this.payee_id = payee_id;
    this.user_id = user_id;
  }

  @JsonCreator
  public InputTransactionDTO(long amount, String user_id, String payee_id) {
    this.amount = amount;
    this.payee_id = payee_id;
    this.user_id = user_id;
  }

  public String getUser_id() {
    return user_id;
  }

  public void setUser_id(String user_id) {
    this.user_id = user_id;
  }

  public long getAmount() {
    return amount;
  }

  public void setAmount(long amount) {
    this.amount = amount;
  }

  public String getCategory_id() {
    return category_id;
  }

  public void setCategory_id(String category_id) {
    this.category_id = category_id;
  }

  public String getPayee_id() {
    return payee_id;
  }

  public void setPayee_id(String payee_id) {
    this.payee_id = payee_id;
  }

}
