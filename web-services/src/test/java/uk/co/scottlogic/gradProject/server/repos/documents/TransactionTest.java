package uk.co.scottlogic.gradProject.server.repos.documents;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.Date;
import java.util.UUID;
import org.junit.Before;
import org.junit.Test;

public class TransactionTest {

  @Before
  public void setUp() throws Exception {
  }

  @Test
  public void transactionCreation() throws Exception {
    ApplicationUser user = new ApplicationUser();
    long amount = 100;
    String description = "description";
    Category category = new Category();
    Payee payee = new Payee();
    Transaction t = new Transaction(user, amount, description, category, payee);
    Transaction transaction = new Transaction();
  }

  @Test
  public void settingAndGettingCategory() {
    Transaction transaction = new Transaction();
    Category c = new Category();
    transaction.setCategory(c);
    assertEquals(c, transaction.getCategory());
  }

  @Test
  public void settingAndGettingUUID() {
    Transaction transaction = new Transaction();
    UUID id = UUID.randomUUID();
    transaction.setId(id);
    assertEquals(id, transaction.getId());
  }

  @Test
  public void settingAndGettingCustomer() {
    Transaction transaction = new Transaction();
    ApplicationUser user = new ApplicationUser();
    transaction.setCustomer(user);
    assertEquals(user, transaction.getCustomer());
  }

  @Test
  public void settingAndGettingPayee() {
    Transaction transaction = new Transaction();
    Payee payee = new Payee();
    transaction.setPayee(payee);
    assertEquals(payee, transaction.getPayee());
  }

  @Test
  public void settingAndGettingState() {
    Transaction transaction = new Transaction();
    transaction.setState(true);
    assertTrue(transaction.isState());
    transaction.setState(false);
    assertFalse(transaction.isState());
  }

  @Test
  public void settingAndGettingAmount() {
    long amount = 153;
    Transaction transaction = new Transaction();
    transaction.setAmount(amount);
    assertEquals(amount, transaction.getAmount());
  }

  @Test
  public void settingAndGettingDescription() {
    String description = "description";
    Transaction transaction = new Transaction();
    transaction.setDescription(description);
    assertEquals(description, transaction.getDescription());
  }

  @Test
  public void settingAndGettingDate() {
    Date date = new Date();
    Transaction transaction = new Transaction();
    transaction.setDate(date);
    assertEquals(date, transaction.getDate());
  }

}