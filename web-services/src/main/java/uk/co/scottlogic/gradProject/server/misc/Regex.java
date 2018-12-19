package uk.co.scottlogic.gradProject.server.misc;

public class Regex {

  public static final String UUID_PATTERN =
      "^[0-9A-Fa-f]{8}\\-[0-9A-Fa-f]{4}\\-[0-9A-Fa-f]{4" + "}\\-[0-9A-Fa-f]{4}\\-[0-9A-Fa-f]{12}$";
  // https://github.com/VerbalExpressions/JavaVerbalExpressions

  // Allows 2 words separated by a space
  public static final String CATEGORY_DESCRIPTION_PATTERN =
      "^[A-Za-z0-9]" + "(\\s?[\\w\\-'\\.,\\?@\\$\\+\\/&]+)*$";

  public static final String PAYEE_NAME_PATTERN =
      "^[\\w\\-'\\.,\\?@\\$\\+\\/]" + "(\\s?[\\w\\-'\\.,\\?@\\$\\+\\/&]+)*$";
  // https://github.com/VerbalExpressions/JavaVerbalExpressions

  public static final String USERNAME_PATTERN = "^[\\w\\.\\-]+$";

  public static final String PASSWORD_PATTERN = "^\\d{6}$";

  //https://stackoverflow.com/questions/2721768/regular-expression-to-match-a-name
  //Allows latin alphabets, dashes, and apostrophes with commonly used latin accents.
  public static final String FIRST_NAME_PATTERN = "^[() -'a-zA-ZÀ-ÖØ-öø-ſ]{1,63}+$";

  public static final String SURNAME_PATTERN = "^[() -'a-zA-ZÀ-ÖØ-öø-ſ]{1,63}+$";

  public static final String EMAIL_PATTERN = "^.+@.+\\..+$";
}
