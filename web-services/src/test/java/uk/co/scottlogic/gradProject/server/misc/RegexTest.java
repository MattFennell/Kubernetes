package uk.co.scottlogic.gradProject.server.misc;

import static junit.framework.Assert.assertFalse;
import static junit.framework.Assert.assertTrue;

import java.util.regex.Pattern;
import org.junit.Before;
import org.junit.Test;

public class RegexTest {

  Pattern CATEGORY_DESCRIPTION_PATTERN;

  Pattern PASSWORD_PATTERN;

  Pattern PAYEE_NAME_PATTERN;

  Pattern USERNAME_PATTERN;

  Pattern UUID_PATTERN;

  @Before
  public void setUp() throws Exception {
    CATEGORY_DESCRIPTION_PATTERN = Pattern.compile(Regex.CATEGORY_DESCRIPTION_PATTERN);
    PASSWORD_PATTERN = Pattern.compile(Regex.PASSWORD_PATTERN);
    PAYEE_NAME_PATTERN = Pattern.compile(Regex.PAYEE_NAME_PATTERN);
    USERNAME_PATTERN = Pattern.compile(Regex.USERNAME_PATTERN);
    UUID_PATTERN = Pattern.compile(Regex.UUID_PATTERN);
  }

  @Test
  public void checkCategoryDescriptionPattern_Matches_WhenGivenValidDescription() {
    String[] validCategories = new String[]{"Jamie's Italian", "J_-f"};
    for (String category : validCategories) {
      assertTrue("Valid Category \"" + category + "\" didn't match.",
          CATEGORY_DESCRIPTION_PATTERN.matcher(category).matches());
    }
  }

  @Test
  public void checkCategoryDescriptionPattern_MatchFails_WhenGivenInvalidDescription() {
    String[] invalidCategories = new String[]{"","***abc", "*jamie", "-jamie", "_costa", "cost- ", " costa",
        "&costa", "^costa"};
    for (String category : invalidCategories) {
      assertFalse("Invalid Category \"" + category + "\" matched.",
          CATEGORY_DESCRIPTION_PATTERN.matcher(category).matches());
    }
  }

  @Test
  public void checkPasswordPattern_Matches_WhenGivenValidPassword() {
    String[] validPasswords = new String[]{"123456", "015894","015889","000000"};
    for (String password : validPasswords) {
      assertTrue("Valid Password \"" + password + "\" didn't match.",
          PASSWORD_PATTERN.matcher(password).matches());
    }
  }

  @Test
  public void checkPasswordPattern_MatchFails_WhenGivenInvalidPassword() {
    String[] invalidPasswords = new String[]{"12345", "0", "", "69514"};
    for (String password : invalidPasswords) {
      assertFalse("Invalid Password \"" + password + "\" matched.",
          PASSWORD_PATTERN.matcher(password).matches());
    }
  }

  @Test
  public void checkPayeeNamePattern_Matches_WhenGivenValidPayee() {
    String[] validPayees = new String[]{"M&S","9Bos","-faff"};
    for (String payee : validPayees) {
      assertTrue("Valid payee \"" + payee + "\" didn't match.",
          PAYEE_NAME_PATTERN.matcher(payee).matches());
    }
  }

  @Test
  public void checkPayeeNamePattern_MatchFails_WhenGivenInvalidPayee() {
    String[] invalidPayees = new String[]{""," -asd","97dasd "};
    for (String payee : invalidPayees) {
      assertFalse("Invalid payee \"" + payee + "\" matched.",
          PAYEE_NAME_PATTERN.matcher(payee).matches());
    }
  }



}

