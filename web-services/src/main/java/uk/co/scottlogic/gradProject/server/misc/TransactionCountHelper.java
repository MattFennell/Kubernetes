package uk.co.scottlogic.gradProject.server.misc;

import uk.co.scottlogic.gradProject.server.repos.documents.Transaction;

public class TransactionCountHelper {

  public static int calculateMonth(int startMonth, int monthOffset) {
    if (startMonth < 1 || startMonth > 12) {
      throw new IllegalArgumentException("Month must be in range 1-12");
    }
    return ((startMonth + monthOffset) % 12) + 1;
  }

  public static int calculateYear(int startMonth, int monthOffset, int yearOffset) {
    if (startMonth < 1 || startMonth > 12) {
      throw new IllegalArgumentException("Month must be in range 1-12");
    }
    return ((startMonth + monthOffset) / 12) + yearOffset;
  }

  public static int calculateMonthOffset(Transaction transaction, Transaction start) {
    if (transaction.getMonth() == 0) {
      throw new IllegalArgumentException("Transaction month is invalid");
    }
    if (transaction.getDate().before(start.getDate())) {
      throw new IllegalArgumentException("Invalid date order");
    }
    int monthOffset = transaction.getMonth() - start.getMonth();
    int monthsForYears = (transaction.getYear() - start.getYear()) * 12;
    return monthOffset + monthsForYears;
  }

}
