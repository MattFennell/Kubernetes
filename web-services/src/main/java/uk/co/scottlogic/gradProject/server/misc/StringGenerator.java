package uk.co.scottlogic.gradProject.server.misc;

public class StringGenerator {

  public static String generateString(int length){
    StringBuilder output = new StringBuilder(length);
    for (int i = 0; i < length; i++) {
      output.append("a");
    }
    return output.toString();
  }

}
