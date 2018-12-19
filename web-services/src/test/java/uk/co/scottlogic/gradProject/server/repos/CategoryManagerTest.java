package uk.co.scottlogic.gradProject.server.repos;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import uk.co.scottlogic.gradProject.server.misc.StringGenerator;
import uk.co.scottlogic.gradProject.server.repos.documents.ApplicationUser;
import uk.co.scottlogic.gradProject.server.repos.documents.Category;
import uk.co.scottlogic.gradProject.server.repos.documents.Transaction;

@RunWith(SpringRunner.class)
@ContextConfiguration
public class CategoryManagerTest {

  @Mock
  private ApplicationUserRepo applicationUserRepo;

  @Mock
  private CategoryRepo categoryRepo;

  @Mock
  private PayeeRepo payeeRepo;

  @Mock
  private TransactionRepo transactionRepo;

  private TransactionManager1 transactionManager1;

  private CategoryManager categoryManager;

  @Before
  public void setUp() throws Exception {
    transactionManager1 = new TransactionManager1(categoryRepo, payeeRepo, applicationUserRepo,
        transactionRepo);
    categoryManager = new CategoryManager(categoryRepo, transactionManager1);
  }

  @Test
  public void singleTransactionSingleCategoryAggregatesCorrectly() {
    Category category = new Category("category");
    List<Transaction> transactions = new ArrayList<>();
    transactions.add(new Transaction(null, 150, null, category, null));
    when(transactionRepo.findByUserByDateRange(any(), any(), any(), any())).thenReturn(
        transactions);
    when(transactionRepo.findByUserByDateRangeReversed(any(), any(), any())).thenReturn(
        transactions);
    Map<Category, CategorySummary> summaryMap =
        categoryManager.findDistinctCostPerCategoryByUserByDate(
        new ApplicationUser(), new Date(), new Date(), 10);
    CategorySummary summary = new CategorySummary(1, 150);
    Map<Category, CategorySummary> actual = new HashMap<>();
    actual.put(category, summary);
    assertEquals(actual.size(), summaryMap.size());
    summaryMap.forEach((key, value) -> {
      assertEquals(actual.get(key).getTotalVisits(), value.getTotalVisits());
      assertEquals(actual.get(key).getSum(), value.getSum());
    });
    Set<Category> order = summaryMap.keySet();
    Iterator<Category> it = order.iterator();
    if (it.hasNext()) {
      Category prev;
      Category cur = it.next();
      // The previous should be the smallest (their biggest expense)
      while (it.hasNext()) {
        prev = cur;
        cur = it.next();
        assertTrue(summaryMap.get(prev).getSum() <= summaryMap.get(cur).getSum());
      }
    }
  }

  @Test
  public void multipleTransactionSingleCategoryAggregatesCorrectly() {
    Category category = new Category("category");
    List<Transaction> transactions = new ArrayList<>();
    transactions.add(new Transaction(null, 1000, null, category, null));
    transactions.add(new Transaction(null, 100, null, category, null));
    transactions.add(new Transaction(null, 10, null, category, null));
    transactions.add(new Transaction(null, 1, null, category, null));
    when(transactionRepo.findByUserByDateRange(any(), any(), any(), any())).thenReturn(
        transactions);
    when(transactionRepo.findByUserByDateRangeReversed(any(), any(), any())).thenReturn(
        transactions);
    Map<Category, CategorySummary> summaryMap =
        categoryManager.findDistinctCostPerCategoryByUserByDate(
        new ApplicationUser(), new Date(), new Date(), 10);
    CategorySummary summary = new CategorySummary(4, 1111);
    Map<Category, CategorySummary> actual = new HashMap<>();
    actual.put(category, summary);
    assertEquals(actual.size(), summaryMap.size());
    summaryMap.forEach((key, value) -> {
      assertEquals(actual.get(key).getTotalVisits(), value.getTotalVisits());
      assertEquals(actual.get(key).getSum(), value.getSum());
    });
    Set<Category> order = summaryMap.keySet();
    Iterator<Category> it = order.iterator();
    if (it.hasNext()) {
      Category prev;
      Category cur = it.next();
      // The previous should be the smallest (their biggest expense)
      while (it.hasNext()) {
        prev = cur;
        cur = it.next();
        assertTrue(summaryMap.get(prev).getSum() <= summaryMap.get(cur).getSum());
      }
    }
  }

  @Test
  public void singleTransactionMultipleCategoryAggregatesCorrectly() {
    Category category = new Category("category");
    Category category1 = new Category("category1");
    Category category2 = new Category("category2");
    Category category3 = new Category("category3");
    List<Transaction> transactions = new ArrayList<>();
    transactions.add(new Transaction(null, 3, null, category, null));
    transactions.add(new Transaction(null, 2, null, category1, null));
    transactions.add(new Transaction(null, 7, null, category2, null));
    transactions.add(new Transaction(null, 4, null, category3, null));
    when(transactionRepo.findByUserByDateRange(any(), any(), any(), any())).thenReturn(
        transactions);
    when(transactionRepo.findByUserByDateRangeReversed(any(), any(), any())).thenReturn(
        transactions);
    Map<Category, CategorySummary> summaryMap =
        categoryManager.findDistinctCostPerCategoryByUserByDate(
        new ApplicationUser(), new Date(), new Date(), 10);
    Map<Category, CategorySummary> actual = new HashMap<>();
    CategorySummary summary = new CategorySummary(1, 3);
    actual.put(category, summary);
    CategorySummary summary1 = new CategorySummary(1, 2);
    actual.put(category1, summary1);
    CategorySummary summary2 = new CategorySummary(1, 7);
    actual.put(category2, summary2);
    CategorySummary summary3 = new CategorySummary(1, 4);
    actual.put(category3, summary3);
    assertEquals(actual.size(), summaryMap.size());
    summaryMap.forEach((key, value) -> {
      assertEquals(actual.get(key).getTotalVisits(), value.getTotalVisits());
      assertEquals(actual.get(key).getSum(), value.getSum());
    });
    Set<Category> order = summaryMap.keySet();
    Iterator<Category> it = order.iterator();
    if (it.hasNext()) {
      Category prev;
      Category cur = it.next();
      // The previous should be the smallest (their biggest expense)
      while (it.hasNext()) {
        prev = cur;
        cur = it.next();
        assertTrue(summaryMap.get(prev).getSum() <= summaryMap.get(cur).getSum());
      }
    }
  }

  @Test
  public void multipleTransactionMultipleCategoryAggregatesCorrectly() {
    Category category = new Category("category");
    Category category1 = new Category("category1");
    Category category2 = new Category("category2");
    Category category3 = new Category("category3");
    List<Transaction> transactions = new ArrayList<>();
    transactions.add(new Transaction(null, 1, null, category, null));
    transactions.add(new Transaction(null, 2, null, category1, null));
    transactions.add(new Transaction(null, 3, null, category2, null));
    transactions.add(new Transaction(null, 4, null, category3, null));
    transactions.add(new Transaction(null, 10, null, category, null));
    transactions.add(new Transaction(null, 20, null, category1, null));
    transactions.add(new Transaction(null, 30, null, category2, null));
    transactions.add(new Transaction(null, 40, null, category3, null));
    Transaction transaction = new Transaction(null, 100, null, category, null);
    Transaction transaction1 = new Transaction(null, 200, null, category1, null);
    Transaction transaction2 = new Transaction(null, 300, null, category2, null);
    Transaction transaction3 = new Transaction(null, 400, null, category3, null);
    // Check when dates aren't in correct date order
    transactions.add(transaction3);
    transactions.add(transaction2);
    transactions.add(transaction1);
    transactions.add(transaction);
    when(transactionRepo.findByUserByDateRange(any(), any(), any(), any())).thenReturn(
        transactions);
    when(transactionRepo.findByUserByDateRangeReversed(any(), any(), any())).thenReturn(
        transactions);
    Map<Category, CategorySummary> summaryMap =
        categoryManager.findDistinctCostPerCategoryByUserByDate(
        new ApplicationUser(), new Date(), new Date(), 10);
    Map<Category, CategorySummary> actual = new HashMap<>();
    CategorySummary summary = new CategorySummary(3, 111);
    actual.put(category, summary);
    CategorySummary summary1 = new CategorySummary(3, 222);
    actual.put(category1, summary1);
    CategorySummary summary2 = new CategorySummary(3, 333);
    actual.put(category2, summary2);
    CategorySummary summary3 = new CategorySummary(3, 444);
    actual.put(category3, summary3);
    assertEquals(actual.size(), summaryMap.size());
    summaryMap.forEach((key, value) -> {
      assertEquals(actual.get(key).getTotalVisits(), value.getTotalVisits());
      assertEquals(actual.get(key).getSum(), value.getSum());
    });
    Set<Category> order = summaryMap.keySet();
    Iterator<Category> it = order.iterator();
    if (it.hasNext()) {
      Category prev;
      Category cur = it.next();
      // The previous should be the smallest (their biggest expense)
      while (it.hasNext()) {
        prev = cur;
        cur = it.next();
        assertTrue(summaryMap.get(prev).getSum() <= summaryMap.get(cur).getSum());
      }
    }
  }

  @Test
  public void emptyListOfTransactionsReturnsEmptyMap() {
    List<Transaction> transactions = new ArrayList<>();
    when(transactionRepo.findByUserByDateRange(any(), any(), any(), any())).thenReturn(
        transactions);
    when(transactionRepo.findByUserByDateRangeReversed(any(), any(), any())).thenReturn(
        transactions);
    Map<Category, CategorySummary> summaryMap =
        categoryManager.findDistinctCostPerCategoryByUserByDate(
        new ApplicationUser(), new Date(), new Date(), 10);
    Map<Category, CategorySummary> actual = new HashMap<>();
    assertEquals(actual.size(), summaryMap.size());
    assertEquals(actual, summaryMap);
  }

  @Test(expected = IllegalArgumentException.class)
  public void creatingCategoryWithNameAtLeast64CharactersFails() {
    String longCategoryName = StringGenerator.generateString(64);
    categoryManager.makeCategory(longCategoryName);
  }

  @Test
  public void creatingCategoryWithNameAtLessThan64CharactersSucceedsIfNameDoesNotExist() {
    String shortCategoryName = StringGenerator.generateString(63);
    categoryManager.makeCategory(shortCategoryName);
  }

  @Test(expected = IllegalArgumentException.class)
  public void creatingCategoryWIthDescriptionThatAlreadyExistsThrowsException() {
    String categoryName = "category";
    List<Category> categories = new ArrayList<>();
    categories.add(new Category("category"));
    when(categoryRepo.findByDescription(any())).thenReturn(categories);
    categoryManager.makeCategory(categoryName);
  }

}
