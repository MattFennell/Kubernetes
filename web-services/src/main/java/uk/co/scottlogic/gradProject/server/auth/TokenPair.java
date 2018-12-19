package uk.co.scottlogic.gradProject.server.auth;

public class TokenPair {

  private String access;

  private String refresh;

  TokenPair(String access, String refresh) {
    this.access = access;
    this.refresh = refresh;
  }

  public String getAccess() {
    return access;
  }

  public String getRefresh() {
    return refresh;
  }

}
