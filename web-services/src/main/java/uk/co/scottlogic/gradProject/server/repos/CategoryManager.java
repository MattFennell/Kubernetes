package uk.co.scottlogic.gradProject.server.repos;

import com.google.common.collect.Lists;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uk.co.scottlogic.gradProject.server.repos.documents.ApplicationUser;
import uk.co.scottlogic.gradProject.server.repos.documents.Category;
import uk.co.scottlogic.gradProject.server.repos.documents.Transaction;
import uk.co.scottlogic.gradProject.server.routers.dto.CategoryDTO;

@Service
public class CategoryManager {

  private static final Logger log = LoggerFactory.getLogger(CategoryManager.class);

  // Methods on categories
  private CategoryRepo categoryRepo;

  private TransactionManager1 transactionManager1;

  @Autowired
  public CategoryManager(CategoryRepo categoryRepo, TransactionManager1 transactionManager1) {
    this.categoryRepo = categoryRepo;
    this.transactionManager1 = transactionManager1;
  }

  // Given a list of transactions, finds the distinct categories and sorts by price
  private Map<Category, CategorySummary> aggregateCostPerCategory(
      List<Transaction> transactionsToAggregate) {
    Map<Category, CategorySummary> costPerCategory = new HashMap<>();
    // If the transaction exists, increase it's value in the hash map
    // Otherwise create a new entry in the hash map for it
    for (Transaction t : transactionsToAggregate) {
      if (!costPerCategory.containsKey(t.getCategory())) {
        CategorySummary categorySummary = new CategorySummary(1, t.getAmount());
        costPerCategory.put(t.getCategory(), categorySummary);
      } else {
        CategorySummary categorySummary = costPerCategory.get(t.getCategory());
        categorySummary.increaseVisits();
        categorySummary.increaseSum(t.getAmount());
        costPerCategory.put(t.getCategory(), categorySummary);
      }
    }
    return sortBySum(costPerCategory);
  }

  // Sort the hash map by the category summary values into ascending order
  private Map<Category, CategorySummary> sortBySum(Map<Category, CategorySummary> mapToSort) {
    return mapToSort.entrySet()
        .stream()
        .sorted((e1, e2) -> (compareCategorySummary(e1.getValue(), e2.getValue())))
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1,
            LinkedHashMap::new));
  }

  // Compare category summary sum values
  private int compareCategorySummary(CategorySummary c1, CategorySummary c2) {
    if (c1.getSum() < c2.getSum()) {
      return -1;
    } else if (c1.getSum() > c2.getSum()) {
      return 1;
    } else {
      return 0;
    }
  }

  // Find the cost per category for a given date range (returned as a map) - sorted by price
  public Map<Category, CategorySummary> findDistinctCostPerCategoryByUserByDate(
      ApplicationUser user, Date start, Date end, Integer pageSize) {
    List<Transaction> customerTransactionsDate = transactionManager1.getTransactionsOverview(user, start,
        end, pageSize, null);
    return aggregateCostPerCategory(customerTransactionsDate);
  }

  // Find all of the categories
  public List<CategoryDTO> findAllCategories() {
    List<Category> categoryList = Lists.newArrayList(categoryRepo.findAll());
    List<CategoryDTO> categoryDTOS = new ArrayList<>();
    for (Category c : categoryList) {
      categoryDTOS.add(new CategoryDTO(c));
    }
    return categoryDTOS;
  }

  // Generates a new category
  public Category makeCategory(String description) {
    if (description.length() >= 64) {
      throw new IllegalArgumentException(
          "Category description too long - must be less than 64 characters");
    }
    List<Category> categories = categoryRepo.findByDescription(description);
    if (categories.isEmpty()) {
      Category g = new Category(description);
      categoryRepo.save(g);
      log.debug("Saved a category with description ({})", description);
      return g;
    } else {
      log.debug("There is already a category with that description ({})", description);
      throw new IllegalArgumentException("There is already a category with that description (" + description + ")");
    }
  }

}
