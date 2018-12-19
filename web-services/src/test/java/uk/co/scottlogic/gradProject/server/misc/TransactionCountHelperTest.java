package uk.co.scottlogic.gradProject.server.misc;

import static junit.framework.TestCase.assertEquals;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import uk.co.scottlogic.gradProject.server.repos.documents.Transaction;

@RunWith(SpringRunner.class)
@ContextConfiguration
public class TransactionCountHelperTest {

  @Test
  public void calculateMonthHelperReturnsExpectedValues() {
    int start = 1;
    int offset = 12;
    int month = TransactionCountHelper.calculateMonth(start, offset);
    assertEquals(2, month);
    start = 1;
    offset = 1;
    assertEquals(3, TransactionCountHelper.calculateMonth(start, offset));
    start = 7;
    offset = 7;
    assertEquals(3, TransactionCountHelper.calculateMonth(start, offset));
  }

  @Test(expected = IllegalArgumentException.class)
  public void calculateMonthHelperShouldRejectStartMonthsLessThan1() {
    TransactionCountHelper.calculateMonth(0, 5);
  }

  @Test(expected = IllegalArgumentException.class)
  public void calculateMonthHelperShouldOnlyRejectStartMonthsGreaterThan12() {
    TransactionCountHelper.calculateMonth(13, 0);
  }

  @Test(expected = IllegalArgumentException.class)
  public void calculateMonthHelperShouldOnlyRejectOffsetMonthsGreaterThan12() {
    TransactionCountHelper.calculateMonth(0, 13);
  }

  @Test(expected = IllegalArgumentException.class)
  public void calculateYearHelperShouldRejectStartMonthsLessThan1() {
    TransactionCountHelper.calculateYear(0, 5, 0);
  }

  @Test(expected = IllegalArgumentException.class)
  public void calculateYearHelperShouldOnlyRejectStartMonthsGreaterThan12() {
    TransactionCountHelper.calculateYear(13, 0, 0);
  }

  @Test(expected = IllegalArgumentException.class)
  public void calculateYearHelperShouldOnlyRejectOffsetMonthsGreaterThan12() {
    TransactionCountHelper.calculateYear(0, 13, 0);
  }

  @Test
  public void calculateYearHelperReturnsExpectedValues() {
    int start = 1;
    int monthOffset = 12;
    int yearOffset = 2000;
    assertEquals(2001, TransactionCountHelper.calculateYear(start, monthOffset, yearOffset));
    start = 6;
    monthOffset = 6;
    assertEquals(2001, TransactionCountHelper.calculateYear(start, monthOffset, yearOffset));
    start = 5;
    monthOffset = 6;
    assertEquals(2000, TransactionCountHelper.calculateYear(start, monthOffset, yearOffset));
    start = 12;
    monthOffset = 12;
    assertEquals(2002, TransactionCountHelper.calculateYear(start, monthOffset, yearOffset));
    start = 12;
    monthOffset = 6;
    assertEquals(2001, TransactionCountHelper.calculateYear(start, monthOffset, yearOffset));
  }

  @Test
  public void calculatingMonthOffsetFromTransactionsReturnsCorrectValueAcrossYearBoundary()
      throws Exception {
    Transaction transaction = new Transaction();
    Transaction start = new Transaction();
    String last = "Jan 2018";     // 01 2018
    String first = "Dec 2017";    // 12 2017
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date jan_2018 = df.parse(last);
    Date dec_2017 = df.parse(first);
    start.setDate(dec_2017);
    transaction.setDate(jan_2018);
    assertEquals(1, TransactionCountHelper.calculateMonthOffset(transaction, start));
  }

  @Test
  public void calculatingMonthOffsetFromTransactionsReturnsCorrectValueWithinSameYear()
      throws Exception {
    Transaction transaction = new Transaction();
    Transaction start = new Transaction();
    String last = "dec 2018";     // 12 2018
    String first = "Jan 2018";    // 01 2018
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date dec_2018 = df.parse(last);
    Date jan_2018 = df.parse(first);
    start.setDate(jan_2018);
    transaction.setDate(dec_2018);
    assertEquals(11, TransactionCountHelper.calculateMonthOffset(transaction, start));
  }

  @Test(expected = IllegalArgumentException.class)
  public void calculatingMonthOffsetFromTransactionsReturnsCorrectValueWithinSameYearReverse()
      throws Exception {
    Transaction transaction = new Transaction();
    Transaction start = new Transaction();
    String last = "dec 2018";     // 12 2018
    String first = "Jan 2018";    // 01 2018
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date dec_2018 = df.parse(last);
    Date jan_2018 = df.parse(first);
    start.setDate(jan_2018);
    transaction.setDate(dec_2018);
    assertEquals(-11, TransactionCountHelper.calculateMonthOffset(start, transaction));
  }

  @Test
  public void calculatingMonthOffsetFromTransactionsReturnsCorrectValueAcrossSeveralYears()
      throws Exception {
    Transaction transaction = new Transaction();
    Transaction start = new Transaction();
    String last = "dec 2018";     // 12 2018
    String first = "Jan 2015";    // 01 2015
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date dec_2018 = df.parse(last);
    Date jan_2018 = df.parse(first);
    start.setDate(jan_2018);
    transaction.setDate(dec_2018);
    assertEquals(47, TransactionCountHelper.calculateMonthOffset(transaction, start));
  }

}
