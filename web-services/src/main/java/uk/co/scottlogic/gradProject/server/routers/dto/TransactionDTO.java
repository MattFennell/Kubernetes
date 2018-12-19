package uk.co.scottlogic.gradProject.server.routers.dto;

import java.util.Date;
import java.util.UUID;
import uk.co.scottlogic.gradProject.server.repos.documents.Category;
import uk.co.scottlogic.gradProject.server.repos.documents.Transaction;

public class TransactionDTO {

  //    private UserReturnDTO customer;
  private long amount;

  private String description;

  private Category category;

  private PayeeDTO payee;

  private Date date;

  private UUID id;

  public TransactionDTO(Transaction transaction) {
    //        this.customer = new UserReturnDTO(transaction.getCustomer());
    this.amount = transaction.getAmount();
    this.description = transaction.getDescription();
    this.category = transaction.getCategory();
    this.payee = new PayeeDTO(transaction.getPayee());
    this.date = transaction.getDate();
    this.id = transaction.getId();
  }

  public UUID getId() {
    return id;
  }

  public void setId(UUID id) {
    this.id = id;
  }

  public long getAmount() {
    return amount;
  }

  public void setAmount(long amount) {
    this.amount = amount;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Category getCategory() {
    return category;
  }

  public void setCategory(Category category) {
    this.category = category;
  }

  public PayeeDTO getPayee() {
    return payee;
  }

  public void setPayee(PayeeDTO payee) {
    this.payee = payee;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  @Override
  public String toString() {
    return ("Transaction data - " +
        //                "Customer:" + customer.getUsername() +
        ", amount:" + amount + ", description:" + description + ", payee = " + payee.getName()
        + ", date = " + date);
  }

}