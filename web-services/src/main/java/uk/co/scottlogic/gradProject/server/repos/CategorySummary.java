package uk.co.scottlogic.gradProject.server.repos;

public class CategorySummary {

  private long totalVisits;

  private long sum;

  public CategorySummary(long totalVisits, long sum) {
    this.totalVisits = totalVisits;
    this.sum = sum;
  }

  public long getTotalVisits() {
    return totalVisits;
  }

  public void setTotalVisits(long totalVisits) {
    this.totalVisits = totalVisits;
  }

  public long getSum() {
    return sum;
  }

  public void setSum(long sum) {
    this.sum = sum;
  }

  public void increaseSum(long increase) {
    this.sum += increase;
  }

  public void increaseVisits() {
    this.totalVisits += 1;
  }

}
