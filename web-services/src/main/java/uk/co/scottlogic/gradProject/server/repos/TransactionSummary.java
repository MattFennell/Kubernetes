package uk.co.scottlogic.gradProject.server.repos;

// An object to represent the summary of the aggregation
public class TransactionSummary {

  private int averagePrice;

  private int totalRevenue;

  public TransactionSummary(int averagePrice, int totalRevenue) {
    this.averagePrice = averagePrice;
    this.totalRevenue = totalRevenue;
  }

  public int getAveragePrice() {
    return averagePrice;
  }

  public int getTotalRevenue() {
    return totalRevenue;
  }

}