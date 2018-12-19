package uk.co.scottlogic.gradProject.server.routers.dto;

import uk.co.scottlogic.gradProject.server.repos.CategorySummary;
import uk.co.scottlogic.gradProject.server.repos.documents.Category;

public class CategorySpendDTO {

  private CategoryDTO category;

  private long amountSpent;

  private long totalVisits;

  public CategorySpendDTO(Category cat, CategorySummary summary) {
    this.category = new CategoryDTO(cat);
    this.amountSpent = summary.getSum();
    this.totalVisits = summary.getTotalVisits();
  }

  public CategoryDTO getCategory() {
    return category;
  }

  public void setCategory(CategoryDTO categoryDTO) {
    this.category = categoryDTO;
  }

  public long getAmountSpent() {
    return amountSpent;
  }

  public void setAmountSpent(long amountSpent) {
    this.amountSpent = amountSpent;
  }

  public long getTotalVisits() {
    return totalVisits;
  }

  public void setTotalVisits(long totalVisits) {
    this.totalVisits = totalVisits;
  }

}
