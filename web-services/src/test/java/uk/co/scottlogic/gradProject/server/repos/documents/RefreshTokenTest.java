package uk.co.scottlogic.gradProject.server.repos.documents;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.Date;
import java.util.UUID;
import org.junit.Before;
import org.junit.Test;

public class RefreshTokenTest {

  @Before
  public void setUp() throws Exception {
  }

  @Test
  public void refreshTokenCreation() throws Exception {
    Date date = new Date();
    ApplicationUser user = new ApplicationUser();
    UUID id = UUID.randomUUID();
    RefreshToken rt = new RefreshToken(id, user, date);
  }

  @Test
  public void settingRefreshTokenExpiryShouldChangeIt() {
    Date expiry = new Date();
    RefreshToken rt = new RefreshToken();
    rt.setExpiry(expiry);
    assertEquals(expiry, rt.getExpiry());
  }

  @Test
  public void settingRefreshTokenIDShouldChangeIt() {
    UUID id = UUID.randomUUID();
    RefreshToken rt = new RefreshToken();
    rt.setRefresh(id);
    assertEquals(id, rt.getRefresh());
  }

  @Test
  public void settingRefreshTokenUserShouldChangeIt() {
    ApplicationUser user = new ApplicationUser();
    RefreshToken rt = new RefreshToken();
    rt.setUser(user);
    assertEquals(user, rt.getUser());
  }

  @Test
  public void settingRefreshTokenUsedShouldChangeIt() {
    RefreshToken rt = new RefreshToken();
    rt.setUsed(true);
    assertTrue(rt.isUsed());
    rt.setUsed(false);
    assertFalse(rt.isUsed());
  }

  @Test
  public void refreshTokenConstructorSetsCorrectly() {
    Date date = new Date();
    ApplicationUser user = new ApplicationUser();
    UUID id = UUID.randomUUID();
    RefreshToken rt = new RefreshToken(id, user, date);
    assertEquals(date, rt.getExpiry());
    assertEquals(user, rt.getUser());
    assertEquals(id, rt.getRefresh());
  }

}