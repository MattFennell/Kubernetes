package uk.co.scottlogic.gradProject.server.repos.documents;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

import java.util.HashSet;
import java.util.Set;
import org.junit.Before;
import org.junit.Test;

public class UserAuthorityTest {

  @Before
  public void setUp() throws Exception {
  }

  @Test
  public void userAuthorityCreation() throws Exception {
    UserAuthority userAuthority = new UserAuthority();
    String description = "description";
    UserAuthority userAuthority1 = new UserAuthority(description);
  }

  @Test
  public void settingAndGettingApplicationUsers() {
    UserAuthority userAuthority = new UserAuthority();
    ApplicationUser user1 = new ApplicationUser();
    ApplicationUser user2 = new ApplicationUser();
    ApplicationUser user3 = new ApplicationUser();
    Set<ApplicationUser> users = new HashSet<>();
    users.add(user1);
    users.add(user2);
    users.add(user3);
    userAuthority.setApplicationUsers(users);
    assertEquals(users, userAuthority.getApplicationUsers());
  }

  @Test
  public void settingAndGettingRole() {
    UserAuthority userAuthority = new UserAuthority();
    String description = "description";
    userAuthority.setRole(description);
    assertEquals(description, userAuthority.getRole());
    assertEquals(description, userAuthority.getAuthority());
  }

  @Test
  public void areEqual() {
    UserAuthority userAuthority = new UserAuthority();
    UserAuthority userAuthority1 = new UserAuthority();
    userAuthority.setRole("role 1");
    userAuthority1.setRole("role 1");
    assertEquals(userAuthority, userAuthority1);
    userAuthority.setRole("hello");
    assertNotEquals(userAuthority, userAuthority1);
    assertEquals(userAuthority, userAuthority);
    ApplicationUser x = new ApplicationUser();
    assertNotEquals(userAuthority, x);
  }

  @Test
  public void hashCodeEqual() {
    UserAuthority userAuthority = new UserAuthority();
    UserAuthority userAuthority1 = new UserAuthority();
    userAuthority.setRole("role 1");
    userAuthority1.setRole("role 1");
    assertEquals(userAuthority.hashCode(), userAuthority1.hashCode());
    userAuthority.setRole("hello");
    assertNotEquals(userAuthority.hashCode(), userAuthority1.hashCode());
    assertEquals(userAuthority.hashCode(), userAuthority.hashCode());
  }

}