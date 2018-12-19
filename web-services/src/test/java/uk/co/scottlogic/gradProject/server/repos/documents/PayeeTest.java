package uk.co.scottlogic.gradProject.server.repos.documents;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

import java.util.Objects;
import java.util.UUID;
import org.junit.Before;
import org.junit.Test;

public class PayeeTest {

  @Before
  public void setUp() throws Exception {
  }

  @Test
  public void payeeEmptyCreation() throws Exception {
    Payee p = new Payee();
  }

  @Test(expected = IllegalArgumentException.class)
  public void payeeWithAsteriskShouldNotBeCreated() {
    Payee p = new Payee("*");
  }

  @Test(expected = IllegalArgumentException.class)
  public void payeeWithEmojiShouldNotBeCreated() {
    Payee p = new Payee("🖤");
  }

  @Test
  public void settingPayeeNameShouldChange() {
    Payee p = new Payee("payee");
    String nameToSet = "hello";
    p.setName(nameToSet);
    assertEquals(p.getName(), nameToSet);
  }

  @Test
  public void settingPayeeUUIDShouldChangeIt() {
    Payee p = new Payee("payee");
    UUID id = UUID.randomUUID();
    p.setId(id);
    assertEquals(p.getId(), id);
  }

  @Test
  public void settingPayeeAddressShouldChangeIt() {
    Payee p = new Payee("payee");
    String address = "my address";
    p.setAddress(address);
    assertEquals(p.getAddress(), address);
  }

  @Test
  public void checkPayeeEqualityWhereUUIDisDifferent() {
    Payee p = new Payee("payee");
    Payee d = new Payee("payee");
    assertNotEquals("Payee are equal", p.equals(d));
  }

  @Test
  public void checkPayeeShouldNotEqual() {
    Payee p = new Payee("payee");
    UUID id = UUID.randomUUID();
    String nameToSet = "hello";
    String nameToCompare = "hello1";
    p.setId(id);
    p.setName(nameToSet);
    int hash = Objects.hash(id, nameToSet);
    assertNotEquals(p.hashCode(), hash);
  }

}