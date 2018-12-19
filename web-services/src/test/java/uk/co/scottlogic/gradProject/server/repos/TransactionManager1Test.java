package uk.co.scottlogic.gradProject.server.repos;

import static junit.framework.TestCase.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import uk.co.scottlogic.gradProject.server.misc.StringGenerator;
import uk.co.scottlogic.gradProject.server.repos.documents.ApplicationUser;
import uk.co.scottlogic.gradProject.server.repos.documents.Category;
import uk.co.scottlogic.gradProject.server.repos.documents.Payee;
import uk.co.scottlogic.gradProject.server.repos.documents.Transaction;
import uk.co.scottlogic.gradProject.server.routers.dto.CountPerMonthDTO;
import uk.co.scottlogic.gradProject.server.routers.dto.InputTransactionDTO;

@RunWith(SpringRunner.class)
@ContextConfiguration
public class TransactionManager1Test {

  @Mock
  private ApplicationUserRepo applicationUserRepo;

  @Mock
  private CategoryRepo categoryRepo;

  @Mock
  private PayeeRepo payeeRepo;

  @Mock
  private TransactionRepo transactionRepo;

  private TransactionManager1 transactionManager1;

  @Before
  public void setUp() {
    transactionManager1 = new TransactionManager1(categoryRepo, payeeRepo, applicationUserRepo,
        transactionRepo);
  }

  @Test
  public void entriesBetweenStartAndEndOfCountPerMonthShouldBeEmptyDTOs() throws Exception {
    List<Transaction> transactionList = new ArrayList<>();
    transactionList.add(new Transaction());
    transactionList.add(new Transaction());
    String end = "Mar 2018";
    String start = "Aug 2016";
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date mar_2018 = df.parse(end);
    Date aug_2015 = df.parse(start);
    transactionList.get(1).setDate(mar_2018);
    transactionList.get(0).setDate(aug_2015);
    when(transactionRepo.findAllByUser(any())).thenReturn(transactionList);
    when(transactionRepo.findByUserByCategory(any(), any())).thenReturn(transactionList);
    ApplicationUser user = new ApplicationUser();
    List<CountPerMonthDTO> obtained = transactionManager1.findCorrectTransactions(user, null);
    List<CountPerMonthDTO> actual = new ArrayList<>();
    actual.add(new CountPerMonthDTO(8, 2016, 1));
    actual.add(new CountPerMonthDTO(9, 2016, 0));
    actual.add(new CountPerMonthDTO(10, 2016, 0));
    actual.add(new CountPerMonthDTO(11, 2016, 0));
    actual.add(new CountPerMonthDTO(12, 2016, 0));
    for (int month = 1; month <= 12; month++) {
      actual.add(new CountPerMonthDTO(month, 2017, 0));
    }
    actual.add(new CountPerMonthDTO(1, 2018, 0));
    actual.add(new CountPerMonthDTO(2, 2018, 0));
    actual.add(new CountPerMonthDTO(3, 2018, 1));
    for (int i = 0; i < actual.size(); i++) {
      assertEquals(actual.get(i).getCount(), obtained.get(i).getCount());
      assertEquals(actual.get(i).getMonth(), obtained.get(i).getMonth());
      assertEquals(actual.get(i).getYear(), obtained.get(i).getYear());
    }
    for (int i = 1; i <= 7; i++) {
      assertEquals(0, obtained.get(i).getCount());
    }
    List<Integer> correctYears = new ArrayList<>();
    List<Integer> correctMonths = new ArrayList<>();
    for (int i = 0; i < 5; i++) {
      correctYears.add(2016);
      correctMonths.add(8 + i);
    }
    for (int i = 1; i <= 12; i++) {
      correctYears.add(2017);
      correctMonths.add(i);
    }
    for (int i = 1; i <= 3; i++) {
      correctYears.add(2018);
      correctMonths.add(i);
    }
    for (int x = 0; x < obtained.size(); x++) {
      int month = correctMonths.get(x);
      int year = correctYears.get(x);
      assertEquals(month, obtained.get(x).getMonth());
      assertEquals(year, obtained.get(x).getYear());
    }
  }

  @Test(expected = IllegalArgumentException.class)
  public void invalidCategoryIDProducesErrorInCountPerMonth() {
    ApplicationUser user = new ApplicationUser();
    List<CountPerMonthDTO> obtained = transactionManager1.findCorrectTransactions(user, "");
  }

  @Test
  public void emptyInputForCountPerMonthReturnsAnEmptyList() {
    List<Transaction> transactionList = new ArrayList<>();
    when(transactionRepo.findAllByUser(any())).thenReturn(transactionList);
    when(transactionRepo.findByUserByCategory(any(), any())).thenReturn(transactionList);
    ApplicationUser user = new ApplicationUser();
    List<CountPerMonthDTO> obtained = transactionManager1.findCorrectTransactions(user, null);
    List<CountPerMonthDTO> actual = new ArrayList<>();
    assertEquals(actual, obtained);
  }

  @Test
  public void singleValueInputForCountPerMonthReturnsAnSingleMonth() throws Exception {
    List<Transaction> transactionList = new ArrayList<>();
    when(transactionRepo.findAllByUser(any())).thenReturn(transactionList);
    when(transactionRepo.findByUserByCategory(any(), any())).thenReturn(transactionList);
    ApplicationUser user = new ApplicationUser();
    transactionList.add(new Transaction());
    String end = "Mar 2018";
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date mar_2018 = df.parse(end);
    transactionList.get(0).setDate(mar_2018);
    List<CountPerMonthDTO> obtained = transactionManager1.findCorrectTransactions(user, null);
    List<CountPerMonthDTO> actual = new ArrayList<>();
    actual.add(new CountPerMonthDTO(3, 2018, 1));
    for (int i = 0; i < actual.size(); i++) {
      assertEquals(actual.get(i).getYear(), obtained.get(i).getYear());
      assertEquals(actual.get(i).getMonth(), obtained.get(i).getMonth());
      assertEquals(actual.get(i).getCount(), obtained.get(i).getCount());
    }
    assertEquals(3, obtained.get(0).getMonth());
    assertEquals(2018, obtained.get(0).getYear());
    assertEquals(1, obtained.get(0).getCount());
  }

  @Test
  public void multipleTransactionsInOneMonthReturnsHigherCountPerMonth() throws Exception {
    List<Transaction> transactionList = new ArrayList<>();
    when(transactionRepo.findAllByUser(any())).thenReturn(transactionList);
    when(transactionRepo.findByUserByCategory(any(), any())).thenReturn(transactionList);
    ApplicationUser user = new ApplicationUser();
    int numberOfTransactionsInMarch2018 = 10;
    for (int i = 0; i < numberOfTransactionsInMarch2018; i++) {
      transactionList.add(new Transaction());
    }
    String end = "Dec 2018";
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date dec_2018 = df.parse(end);
    for (Transaction t : transactionList) {
      t.setDate(dec_2018);
    }
    List<CountPerMonthDTO> obtained = transactionManager1.findCorrectTransactions(user, null);
    List<CountPerMonthDTO> actual = new ArrayList<>();
    actual.add(new CountPerMonthDTO(12, 2018, numberOfTransactionsInMarch2018));
    for (int i = 0; i < actual.size(); i++) {
      assertEquals(actual.get(i).getCount(), obtained.get(i).getCount());
      assertEquals(actual.get(i).getMonth(), obtained.get(i).getMonth());
      assertEquals(actual.get(i).getYear(), obtained.get(i).getYear());
    }
    assertEquals(10, obtained.get(0).getCount());
    assertEquals(12, obtained.get(0).getMonth());
    assertEquals(2018, obtained.get(0).getYear());
  }

  @Test
  public void multipleGapsInTimeResultsInMultipleZeroEntryMonthsInCountPerMonth() throws Exception {
    List<Transaction> transactionList = new ArrayList<>();
    when(transactionRepo.findAllByUser(any())).thenReturn(transactionList);
    when(transactionRepo.findByUserByCategory(any(), any())).thenReturn(transactionList);
    ApplicationUser user = new ApplicationUser();
    transactionList.add(new Transaction());
    transactionList.add(new Transaction());
    transactionList.add(new Transaction());
    String end = "Dec 2018";
    String middle = "May 2018";
    String start = "Feb 2018";
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date dec_2018 = df.parse(end);
    Date may_2018 = df.parse(middle);
    Date feb_2018 = df.parse(start);
    transactionList.get(0).setDate(feb_2018);
    transactionList.get(1).setDate(may_2018);
    transactionList.get(2).setDate(dec_2018);
    List<CountPerMonthDTO> obtained = transactionManager1.findCorrectTransactions(user, null);
    List<CountPerMonthDTO> actual = new ArrayList<>();
    actual.add(new CountPerMonthDTO(2, 2018, 1));  // Feb
    actual.add(new CountPerMonthDTO(3, 2018, 0));  // Mar
    actual.add(new CountPerMonthDTO(4, 2018, 0));  // Apr
    actual.add(new CountPerMonthDTO(5, 2018, 1));  // May
    actual.add(new CountPerMonthDTO(6, 2018, 0));  // Jun
    actual.add(new CountPerMonthDTO(7, 2018, 0));  // Jul
    actual.add(new CountPerMonthDTO(8, 2018, 0));  // Aug
    actual.add(new CountPerMonthDTO(9, 2018, 0));  // Sep
    actual.add(new CountPerMonthDTO(10, 2018, 0)); // Oct
    actual.add(new CountPerMonthDTO(11, 2018, 0)); // Nov
    actual.add(new CountPerMonthDTO(12, 2018, 1)); // Dec
    for (int i = 0; i < actual.size(); i++) {
      assertEquals(actual.get(i).getYear(), obtained.get(i).getYear());
      assertEquals(actual.get(i).getMonth(), obtained.get(i).getMonth());
      assertEquals(actual.get(i).getCount(), obtained.get(i).getCount());
    }
    assertEquals(2, obtained.get(0).getMonth());
    assertEquals(1, obtained.get(0).getCount());
    assertEquals(5, obtained.get(3).getMonth());
    assertEquals(1, obtained.get(3).getCount());
    assertEquals(12, obtained.get(10).getMonth());
    assertEquals(1, obtained.get(10).getCount());
    assertEquals(0, obtained.get(9).getCount());
  }

  @Test
  public void multipleTransactionsAtStartOfOneYearAndEndOfPreviousYearHasCorrectOverlapModulusFunctionality()
      throws Exception {
    List<Transaction> transactionList = new ArrayList<>();
    when(transactionRepo.findAllByUser(any())).thenReturn(transactionList);
    when(transactionRepo.findByUserByCategory(any(), any())).thenReturn(transactionList);
    ApplicationUser user = new ApplicationUser();
    transactionList.add(new Transaction());
    transactionList.add(new Transaction());
    String end = "Jan 2018";
    String start = "Dec 2017";
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date mar_2018 = df.parse(end);
    Date dec_2017 = df.parse(start);
    transactionList.get(1).setDate(mar_2018);
    transactionList.get(0).setDate(dec_2017);
    List<CountPerMonthDTO> obtained = transactionManager1.findCorrectTransactions(user, null);
    List<CountPerMonthDTO> actual = new ArrayList<>();
    actual.add(new CountPerMonthDTO(12, 2017, 1));
    actual.add(new CountPerMonthDTO(1, 2018, 1));
    for (int i = 0; i < actual.size(); i++) {
      assertEquals(actual.get(i).getCount(), obtained.get(i).getCount());
      assertEquals(actual.get(i).getMonth(), obtained.get(i).getMonth());
      assertEquals(actual.get(i).getYear(), obtained.get(i).getYear());
    }
    assertEquals(12, obtained.get(0).getMonth());
    assertEquals(2017, obtained.get(0).getYear());
    assertEquals(1, obtained.get(0).getCount());
    assertEquals(1, obtained.get(1).getMonth());
    assertEquals(2018, obtained.get(1).getYear());
    assertEquals(1, obtained.get(1).getCount());
  }

  @Test
  public void multipleMonthsWithMultipleTransactionsInSingleYearCountPerMonth() throws Exception {
    List<Transaction> transactionList = new ArrayList<>();
    when(transactionRepo.findAllByUser(any())).thenReturn(transactionList);
    when(transactionRepo.findByUserByCategory(any(), any())).thenReturn(transactionList);
    ApplicationUser user = new ApplicationUser();
    int totalNumberOfTransactions = 400;
    for (int i = 0; i < totalNumberOfTransactions; i++) {
      transactionList.add(new Transaction());
    }
    String jul = "Jul 2018";
    String jun = "Jun 2018";
    String may = "May 2018";
    String apr = "Apr 2018";
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date jul_2018 = df.parse(jul);
    Date jun_2018 = df.parse(jun);
    Date may_2018 = df.parse(may);
    Date apr_2018 = df.parse(apr);
    for (int i = 0; i < totalNumberOfTransactions; i++) {
      if (i < 50) {
        transactionList.get(i).setDate(apr_2018);
      } else if (i < 200) {
        transactionList.get(i).setDate(may_2018);
      } else if (i < 290) {
        transactionList.get(i).setDate(jun_2018);
      } else {
        transactionList.get(i).setDate(jul_2018);
      }
    }
    List<CountPerMonthDTO> obtained = transactionManager1.findCorrectTransactions(user, null);
    List<CountPerMonthDTO> actual = new ArrayList<>();
    actual.add(new CountPerMonthDTO(4, 2018, 50));
    actual.add(new CountPerMonthDTO(5, 2018, 150));
    actual.add(new CountPerMonthDTO(6, 2018, 90));
    actual.add(new CountPerMonthDTO(7, 2018, 110));
    for (int i = 0; i < actual.size(); i++) {
      assertEquals(actual.get(i).getYear(), obtained.get(i).getYear());
      assertEquals(actual.get(i).getMonth(), obtained.get(i).getMonth());
      assertEquals(actual.get(i).getCount(), obtained.get(i).getCount());
    }
    assertEquals(50, obtained.get(0).getCount());
    assertEquals(4, obtained.get(0).getMonth());
    assertEquals(2018, obtained.get(0).getYear());
    assertEquals(90, obtained.get(2).getCount());
    assertEquals(6, obtained.get(2).getMonth());
    assertEquals(2018, obtained.get(2).getYear());
  }

  @Test(expected = IllegalArgumentException.class)
  public void countPerMonthShouldRejectAListOfTransactionsWhereDateOrderIsNotAscending()
      throws Exception {
    List<Transaction> transactionList = new ArrayList<>();
    when(transactionRepo.findAllByUser(any())).thenReturn(transactionList);
    when(transactionRepo.findByUserByCategory(any(), any())).thenReturn(transactionList);
    ApplicationUser user = new ApplicationUser();
    transactionList.add(new Transaction());
    transactionList.add(new Transaction());
    String end = "Jan 2018";
    String start = "Dec 2017";
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date mar_2018 = df.parse(end);
    Date dec_2017 = df.parse(start);
    transactionList.get(0).setDate(mar_2018);
    transactionList.get(1).setDate(dec_2017);
    transactionManager1.findCorrectTransactions(user, null);
  }

  @Test
  public void getTransactionsSortsTheDatesIntoDescendingOrderBothDatesNotNull() throws Exception {
    List<Transaction> transactionList = new ArrayList<>();
    Transaction t1 = new Transaction();
    Transaction t2 = new Transaction();
    transactionList.add(t1);
    transactionList.add(t2);
    String end = "Jan 2018";
    String start = "Dec 2017";
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date jan_2018 = df.parse(end);
    Date dec_2017 = df.parse(start);
    t1.setDate(dec_2017);
    t2.setDate(jan_2018);
    List<Transaction> actual = new ArrayList<>();
    actual.add(t2);
    actual.add(t1);
    when(transactionRepo.findByUserByDateRange(any(), any(), any(), any())).thenReturn(
        transactionList);
    List<Transaction> obtained = transactionManager1.getTransactionsOverview(null, new Date(), new Date(),
        10, null);
    for (int i = 0; i < actual.size(); i++) {
      assertEquals(actual.get(i).getDate(), obtained.get(i).getDate());
    }
  }

  @Test
  public void getTransactionsSortsTheDatesIntoDescendingOrderWithNullEndDate() throws Exception {
    List<Transaction> transactionList = new ArrayList<>();
    Transaction t1 = new Transaction();
    Transaction t2 = new Transaction();
    transactionList.add(t1);
    transactionList.add(t2);
    String end = "Jan 2018";
    String start = "Dec 2017";
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date jan_2018 = df.parse(end);
    Date dec_2017 = df.parse(start);
    t1.setDate(dec_2017);
    t2.setDate(jan_2018);
    List<Transaction> actual = new ArrayList<>();
    actual.add(t2);
    actual.add(t1);
    when(transactionRepo.findByUserByDateRange(any(), any(), any(), any())).thenReturn(
        transactionList);
    List<Transaction> obtained = transactionManager1.getTransactionsOverview(null, new Date(), null, 10, null);
    for (int i = 0; i < actual.size(); i++) {
      assertEquals(actual.get(i).getDate(), obtained.get(i).getDate());
    }
  }

  @Test
  public void getTransactionsSortsTheDatesIntoDescendingOrderWithNullStartDate() throws Exception {
    List<Transaction> transactionList = new ArrayList<>();
    Transaction t1 = new Transaction();
    Transaction t2 = new Transaction();
    transactionList.add(t2);
    transactionList.add(t1);
    String end = "Jan 2018";
    String start = "Dec 2017";
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date jan_2018 = df.parse(end);
    Date dec_2017 = df.parse(start);
    t1.setDate(dec_2017);
    t2.setDate(jan_2018);
    List<Transaction> actual = new ArrayList<>();
    actual.add(t2);
    actual.add(t1);
    when(transactionRepo.findByUserByDateRangeReversed(any(), any(), any())).thenReturn(
        transactionList);
    List<Transaction> obtained = transactionManager1.getTransactionsOverview(null, null, new Date(),
        10, null);
    for (int i = 0; i < actual.size(); i++) {
      assertEquals(actual.get(i).getDate(), obtained.get(i).getDate());
    }
  }

  @Test
  public void getTransactionsByCategorySortsTheDatesIntoDescendingOrderBothDatesNotNull() throws Exception {
    List<Transaction> transactionList = new ArrayList<>();
    Transaction t1 = new Transaction();
    Transaction t2 = new Transaction();
    transactionList.add(t1);
    transactionList.add(t2);
    when(transactionRepo.findByUserByDateRangeByCategory(any(), any(), any(), any(),
        any())).thenReturn(transactionList);
    when(categoryRepo.findById(any())).thenReturn(Optional.of(new Category("category")));
    String end = "Jan 2018";
    String start = "Dec 2017";
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date mar_2018 = df.parse(end);
    Date dec_2017 = df.parse(start);
    t1.setDate(dec_2017);
    t2.setDate(mar_2018);
    List<Transaction> actual = new ArrayList<>();
    actual.add(t2);
    actual.add(t1);
    List<Transaction> obtained = transactionManager1.getTransactionsOverview(null, new Date(),
        new Date(), 10, UUID.randomUUID().toString());
    for (int i = 0; i < actual.size(); i++) {
      assertEquals(actual.get(i).getDate(), obtained.get(i).getDate());
    }
  }

  @Test
  public void getTransactionsByCategorySortsTheDatesIntoDescendingOrderWithNullEndDate() throws Exception {
    List<Transaction> transactionList = new ArrayList<>();
    Transaction t1 = new Transaction();
    Transaction t2 = new Transaction();
    transactionList.add(t1);
    transactionList.add(t2);
    when(transactionRepo.findByUserByDateRangeByCategory(any(), any(), any(), any(),
        any())).thenReturn(transactionList);
    when(categoryRepo.findById(any())).thenReturn(Optional.of(new Category("category")));
    String end = "Jan 2018";
    String start = "Dec 2017";
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date jan_2018 = df.parse(end);
    Date dec_2017 = df.parse(start);
    t1.setDate(dec_2017);
    t2.setDate(jan_2018);
    List<Transaction> actual = new ArrayList<>();
    actual.add(t2);
    actual.add(t1);
    List<Transaction> obtained = transactionManager1.getTransactionsOverview(null, new Date(),
        null, 10, UUID.randomUUID().toString());
    for (int i = 0; i < actual.size(); i++) {
      assertEquals(actual.get(i).getDate(), obtained.get(i).getDate());
    }
  }

  @Test
  public void getTransactionsByCategorySortsTheDatesIntoDescendingOrderWithNullStartDate() throws Exception {
    List<Transaction> transactionList = new ArrayList<>();
    Transaction t1 = new Transaction();
    Transaction t2 = new Transaction();
    transactionList.add(t2);
    transactionList.add(t1);
    when(transactionRepo.findByUserByDateRangeReversedByCategory(any(), any(), any(),
        any())).thenReturn(transactionList);
    when(categoryRepo.findById(any())).thenReturn(Optional.of(new Category("category")));
    String end = "Jan 2018";
    String start = "Dec 2017";
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date jan_2018 = df.parse(end);
    Date dec_2017 = df.parse(start);
    t1.setDate(dec_2017);
    t2.setDate(jan_2018);
    List<Transaction> actual = new ArrayList<>();
    actual.add(t2);
    actual.add(t1);
    List<Transaction> obtainedThree = transactionManager1.getTransactionsOverview(null, null,
        new Date(), 10, UUID.randomUUID().toString());
    for (int i = 0; i < actual.size(); i++) {
      assertEquals(actual.get(i).getDate(), obtainedThree.get(i).getDate());
    }
  }

  @Test(expected = IllegalArgumentException.class)
  public void bothStartAndEndDateCannotBeNull() {
    transactionManager1.getTransactionsOverview(null, null, null, 10, null);
  }

  @Test(expected = IllegalArgumentException.class)
  public void pageSizeCannotBeNull() {
    transactionManager1.getTransactionsOverview(null, new Date(), new Date(),
        null, null);
  }

  @Test(expected = IllegalArgumentException.class)
  public void pageSizeCannotBeLessThanOne() {
    transactionManager1.getTransactionsOverview(null, new Date(), new Date(),
        0, null);
  }

  @Test(expected = IllegalArgumentException.class)
  public void bothStartAndEndDateCannotBeNullByCategory() {
    when(categoryRepo.findById(any())).thenReturn(Optional.of(new Category("category")));
    transactionManager1.getTransactionsOverview(null, null, null, 10,
        UUID.randomUUID().toString());
  }

  @Test(expected = IllegalArgumentException.class)
  public void pageSizeCannotBeNullByCategory() {
    when(categoryRepo.findById(any())).thenReturn(Optional.of(new Category("category")));
    transactionManager1.getTransactionsOverview(null, new Date(), new Date(), null,
        UUID.randomUUID().toString());
  }

  @Test(expected = IllegalArgumentException.class)
  public void pageSizeCannotBeLessThanOneByCategory() {
    when(categoryRepo.findById(any())).thenReturn(Optional.of(new Category("category")));
    transactionManager1.getTransactionsOverview(null, new Date(), new Date(), 0,
        UUID.randomUUID().toString());
  }

  @Test(expected = IllegalArgumentException.class)
  public void startDateCannotBeAfterEndDateByCategory() throws Exception {
    String end = "Jan 2018";
    String start = "Dec 2017";
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date mar_2018 = df.parse(end);
    Date dec_2017 = df.parse(start);
    when(categoryRepo.findById(any())).thenReturn(Optional.of(new Category("category")));
    transactionManager1.getTransactionsOverview(null, mar_2018, dec_2017, 10,
        UUID.randomUUID().toString());
  }

  @Test(expected = IllegalArgumentException.class)
  public void startDateCannotBeAfterEndDate() throws Exception {
    String end = "Jan 2018";
    String start = "Dec 2017";
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date mar_2018 = df.parse(end);
    Date dec_2017 = df.parse(start);
    transactionManager1.getTransactionsOverview(null, mar_2018, dec_2017, 10, null);
  }

  @Test
  public void updatingTransactionNoteChangesTheNoteWhenTheTransactionBelongsToTheUser() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    Transaction t = new Transaction(user, 100, "", null, null);
    String noteToSet = "a new note";
    transactionManager1.updateTransactionNote(user, t, noteToSet);
    assertEquals(noteToSet, t.getDescription());
  }

  @Test(expected = SecurityException.class)
  public void updatingTransactionNoteDoesNotChangeNoteWhenItsADifferentUsersTransaction() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    ApplicationUser userTwo = new ApplicationUser("userTwo", "123456", "a", "a", "a@a.com");
    Transaction t = new Transaction(user, 100, "", null, null);
    String noteToSet = "a new note";
    transactionManager1.updateTransactionNote(userTwo, t, noteToSet);
  }

  @Test
  public void deletingTransactionNoteDeletesTheNoteWhenTheTransactionBelongsToTheUser() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    Transaction t = new Transaction(user, 100, "", null, null);
    transactionManager1.deleteTransactionNote(user, t);
    assertEquals("", t.getDescription());
  }

  @Test(expected = SecurityException.class)
  public void deletingTransactionNoteDoesNotDeleteNoteWhenItsADifferentUsersTransaction() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    ApplicationUser userTwo = new ApplicationUser("userTwo", "123456", "a", "a", "a@a.com");
    Transaction t = new Transaction(user, 100, "", null, null);
    transactionManager1.deleteTransactionNote(userTwo, t);
  }

  @Test
  public void updatingTransactionCategoryChangesTheCategoryWhenTheTransactionBelongsToTheUser() {
    // Make a user
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    // Make a category (what the transaction originally is)
    Category category = new Category("category one");
    // Make the new category that we want to change the transaction to
    Category categoryTwo = new Category("category two");
    // Make a transaction with that category
    Transaction t = new Transaction(user, 100, "", category, null);
    // Mock the return
    when(categoryRepo.findById(any())).thenReturn(Optional.of(categoryTwo));
    // Update the transaction
    transactionManager1.updateTransactionCategory(user, t, UUID.randomUUID().toString());
    // Check that the results are equal
    assertEquals(categoryTwo, t.getCategory());
  }

  @Test(expected = SecurityException.class)
  public void updatingTransactionCategoryReturnsSecurityExceptionIfItIsNotTheirTransaction() {
    // Make a user
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    ApplicationUser userTwo = new ApplicationUser("userTwo", "123456", "b", "b", "b@b.com");
    // Make a category (what the transaction originally is)
    Category category = new Category("category one");
    // Make the new category that we want to change the transaction to
    Category categoryTwo = new Category("category two");
    // Make a transaction with that category
    Transaction t = new Transaction(userTwo, 100, "", category, null);
    // Mock the return
    when(categoryRepo.findById(any())).thenReturn(Optional.of(categoryTwo));
    // Update the transaction
    transactionManager1.updateTransactionCategory(user, t, UUID.randomUUID().toString());
  }

  @Test
  public void buildTransactionProducesATransactionWithTheCorrectValues() {
    InputTransactionDTO dto = new InputTransactionDTO(100, UUID.randomUUID().toString(),
        UUID.randomUUID().toString(), UUID.randomUUID().toString());
    Category category = new Category("category");
    Payee payee = new Payee("payee");
    ApplicationUser user = new ApplicationUser();
    // Mock the return
    when(categoryRepo.findById(any())).thenReturn(Optional.of(category));
    when(payeeRepo.findById(any())).thenReturn(Optional.of(payee));
    when(applicationUserRepo.findById(any())).thenReturn(Optional.of(user));
    Transaction t = transactionManager1.buildTransaction(dto);
    assertEquals(category, t.getCategory());
    assertEquals(payee, t.getPayee());
    assertEquals(user, t.getCustomer());
  }

  @Test(expected = IllegalArgumentException.class)
  public void buildTransactionFailsIfAmountIsZero() {
    InputTransactionDTO dto = new InputTransactionDTO(0, UUID.randomUUID().toString(),
        UUID.randomUUID().toString(), UUID.randomUUID().toString());
    Category category = new Category("category");
    Payee payee = new Payee("payee");
    ApplicationUser user = new ApplicationUser();
    // Mock the return
    when(categoryRepo.findById(any())).thenReturn(Optional.of(category));
    when(payeeRepo.findById(any())).thenReturn(Optional.of(payee));
    when(applicationUserRepo.findById(any())).thenReturn(Optional.of(user));
    Transaction t = transactionManager1.buildTransaction(dto);
  }

  @Test
  public void buildTransactionReturnsATransactionWithGeneralCategoryIfNoneProvidedAndGeneralCategoryExists() {
    InputTransactionDTO dto = new InputTransactionDTO(100,
        UUID.randomUUID().toString(), UUID.randomUUID().toString());
    Category category = new Category("General");
    categoryRepo.save(category);
    List<Category> list = new ArrayList<>();
    list.add(category);
    Payee payee = new Payee("payee");
    ApplicationUser user = new ApplicationUser();
    when(categoryRepo.findById(any())).thenReturn(Optional.of(category));
    when(categoryRepo.findByDescription("General")).thenReturn(list);
    when(payeeRepo.findById(any())).thenReturn(Optional.of(payee));
    when(applicationUserRepo.findById(any())).thenReturn(Optional.of(user));
    Transaction t = transactionManager1.buildTransaction(dto);
    assertEquals(categoryRepo.findById(category.getId()).get().getDescription(), t.getCategory().getDescription());
  }

  public void updatingTransactionNoteFailsIfTheNoteIsAtLeast64Characters() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    String longNoteToSet = StringGenerator.generateString(64);
    Transaction t = new Transaction(user, 100, "", null, null);
    transactionManager1.updateTransactionNote(user, t, longNoteToSet);
  }

  @Test
  public void updatingTransactionNoteSucceedsIfTheNoteIsAtLessThan64Characters() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    String longNoteToSet = StringGenerator.generateString(63);
    Transaction t = new Transaction(user, 100, "", null, null);
    transactionManager1.updateTransactionNote(user, t, longNoteToSet);
    assertEquals(longNoteToSet, t.getDescription());
  }

}
