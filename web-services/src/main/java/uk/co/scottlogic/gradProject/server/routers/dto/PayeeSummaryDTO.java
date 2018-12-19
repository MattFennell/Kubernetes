package uk.co.scottlogic.gradProject.server.routers.dto;

public class PayeeSummaryDTO {

  private long totalVisits;

  private long totalSpend;

  private String address;

  public PayeeSummaryDTO(long totalVisits, long totalSpend, String address) {
    this.totalVisits = totalVisits;
    this.totalSpend = totalSpend;
    this.address = address;
  }

  public long getTotalVisits() {
    return totalVisits;
  }

  public void setTotalVisits(long totalVisits) {
    this.totalVisits = totalVisits;
  }

  public long getTotalSpend() {
    return totalSpend;
  }

  public void setTotalSpend(long totalSpend) {
    this.totalSpend = totalSpend;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

}
