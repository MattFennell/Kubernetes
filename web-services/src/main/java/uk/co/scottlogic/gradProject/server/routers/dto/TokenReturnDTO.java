package uk.co.scottlogic.gradProject.server.routers.dto;

import uk.co.scottlogic.gradProject.server.auth.TokenPair;

public class TokenReturnDTO {

  private String access;

  private String refresh;

  public TokenReturnDTO(String access, String refresh) {
    setAccess(access);
    setRefresh(refresh);
  }

  public TokenReturnDTO(TokenPair refresh) {
    setAccess(refresh.getAccess());
    setRefresh(refresh.getRefresh());
  }

  public String getAccess() {
    return access;
  }

  public void setAccess(String access) {
    this.access = access;
  }

  public String getRefresh() {
    return refresh;
  }

  public void setRefresh(String refresh) {
    this.refresh = refresh;
  }

}
