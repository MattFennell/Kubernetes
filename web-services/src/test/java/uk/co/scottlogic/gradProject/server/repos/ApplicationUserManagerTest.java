package uk.co.scottlogic.gradProject.server.repos;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;
import static org.mockito.Mockito.when;

import java.util.Optional;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import uk.co.scottlogic.gradProject.server.repos.documents.ApplicationUser;
import uk.co.scottlogic.gradProject.server.routers.dto.UserPatchDTO;

@RunWith(SpringRunner.class)
@ContextConfiguration
public class ApplicationUserManagerTest {

  @Mock
  private ApplicationUserRepo applicationUserRepo;

  private ApplicationUserManager applicationUserManager;

  @Before
  public void setUp() {
    applicationUserManager = new ApplicationUserManager(applicationUserRepo);
  }

  @Test
  public void shouldPatchFirstNameIfJustFirstNameBeingChangedAndFirstNameValid() {
    String newFirstName = "new first name";
    UserPatchDTO userPatchDTO = new UserPatchDTO(newFirstName, null, null, null, null);
    ApplicationUser user = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    applicationUserManager.patchUser(user, userPatchDTO);
    assertEquals(newFirstName, user.getFirstName());
  }

  @Test
  public void shouldPatchSurnameIfJustSurnameBeingChangedAndSurnameValid() {
    String newSurname = "new first name";
    UserPatchDTO userPatchDTO = new UserPatchDTO(null, newSurname, null, null, null);
    ApplicationUser user = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    applicationUserManager.patchUser(user, userPatchDTO);
    assertEquals(newSurname, user.getSurname());
  }

  @Test
  public void shouldPatchEmailIfJustEmailBeingChangedAndEmailValid() {
    String newEmail = "user@user.com";
    UserPatchDTO userPatchDTO = new UserPatchDTO(null, null, null, newEmail, null);
    ApplicationUser user = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    applicationUserManager.patchUser(user, userPatchDTO);
    assertEquals(newEmail, user.getEmail());
  }

  @Test
  public void shouldPatchUsernameIfJustUsernameBeingChangedAndUsernameValid() {
    String username = "user";
    UserPatchDTO userPatchDTO = new UserPatchDTO(null, null, username, null, null);
    ApplicationUser user = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    applicationUserManager.patchUser(user, userPatchDTO);
    assertEquals(username, user.getUsername());
  }

  @Test(expected = IllegalArgumentException.class)
  public void shouldNotPatchEmailIfJustEmailBeingChangedAndEmailNotValid() {
    String newEmail = "an invalid email";
    UserPatchDTO userPatchDTO = new UserPatchDTO(null, null, null, newEmail, null);
    ApplicationUser user = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    applicationUserManager.patchUser(user, userPatchDTO);
  }

  @Test(expected = IllegalArgumentException.class)
  public void shouldNotPatchUsernameIfJustUsernameBeingChangedAndUsernameNotValid() {
    String username = "❤❤❤";
    UserPatchDTO userPatchDTO = new UserPatchDTO(null, null, username, null, null);
    ApplicationUser user = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    applicationUserManager.patchUser(user, userPatchDTO);
  }

  @Test(expected = IllegalArgumentException.class)
  public void shouldNotPatchUsernameIfJustUsernameBeingChangedAndUsernameTaken() {
    String username = "user";
    UserPatchDTO userPatchDTO = new UserPatchDTO(null, null, username, null, null);
    ApplicationUser user = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    ApplicationUser alreadyExistingUser = new ApplicationUser();
    when(applicationUserRepo.findByUsername(userPatchDTO.getUsername())).thenReturn(
        Optional.of(alreadyExistingUser));
    applicationUserManager.patchUser(user, userPatchDTO);
  }

  @Test(expected = IllegalArgumentException.class)
  public void shouldNotPatchEmailIfJustEmailBeingChangedAndEmailTaken() {
    String email = "user@user.com";
    UserPatchDTO userPatchDTO = new UserPatchDTO(null, null, null, email, null);
    ApplicationUser user = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    ApplicationUser alreadyExistingUser = new ApplicationUser();
    when(applicationUserRepo.findByEmail(userPatchDTO.getEmail())).thenReturn(
        Optional.of(alreadyExistingUser));
    applicationUserManager.patchUser(user, userPatchDTO);
  }

  @Test
  public void shouldPatchPasswordIfJustPasswordBeingChangedAndPasswordValid() {
    String password = "987654";
    UserPatchDTO userPatchDTO = new UserPatchDTO(null, null, null, null, password);
    ApplicationUser user = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    applicationUserManager.patchUser(user, userPatchDTO);
    assertTrue(BCrypt.checkpw(password, user.getPassword()));
  }

  @Test(expected = IllegalArgumentException.class)
  public void shouldNotPatchPasswordIfJustPasswordBeingChangedAndPasswordTooShort() {
    String password = "12345";
    UserPatchDTO userPatchDTO = new UserPatchDTO(null, null, null, null, password);
    ApplicationUser user = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    applicationUserManager.patchUser(user, userPatchDTO);
  }

  @Test(expected = IllegalArgumentException.class)
  public void shouldNotPatchPasswordIfJustPasswordBeingChangedAndPasswordTooLong() {
    String password = "1234567";
    UserPatchDTO userPatchDTO = new UserPatchDTO(null, null, null, null, password);
    ApplicationUser user = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    applicationUserManager.patchUser(user, userPatchDTO);
    assertTrue(BCrypt.checkpw(password, user.getPassword()));
  }

  @Test
  public void shouldPatchAllFieldsWhenAllFieldsValid() {
    String firstName = "first name";
    String surname = "surname";
    String username = "testuser";
    String email = "test@test.com";
    String password = "111111";
    UserPatchDTO userPatchDTO = new UserPatchDTO(firstName, surname, username, email, password);
    ApplicationUser user = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    applicationUserManager.patchUser(user, userPatchDTO);
    assertEquals(firstName, user.getFirstName());
    assertEquals(surname, user.getSurname());
    assertEquals(username, user.getUsername());
    assertEquals(email, user.getEmail());
    assertTrue(BCrypt.checkpw(password, user.getPassword()));
  }

  @Test(expected = IllegalArgumentException.class)
  public void shouldNotPatchWhenIllegalArgumentException() {
    String username = "user";
    UserPatchDTO userPatchDTO = new UserPatchDTO(null, null, username, null, null);
    ApplicationUser user = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    when(applicationUserRepo.findByUsername(userPatchDTO.getUsername())).thenThrow(
        new IllegalArgumentException());
    applicationUserManager.patchUser(user, userPatchDTO);
  }

  @Test(expected = Exception.class)
  public void shouldNotPatchWhenException() {
    String username = "user";
    UserPatchDTO userPatchDTO = new UserPatchDTO(null, null, username, null, null);
    ApplicationUser user = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    when(applicationUserRepo.findByUsername(userPatchDTO.getUsername())).thenThrow(new Exception());
    applicationUserManager.patchUser(user, userPatchDTO);
  }

  @Test(expected = IllegalArgumentException.class)
  public void shouldNotPatchWhenFirstNameContainsEmoji() {
    String firstName = "❤";
    UserPatchDTO userPatchDTO = new UserPatchDTO(firstName, null, null, null, null);
    ApplicationUser user = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    applicationUserManager.patchUser(user, userPatchDTO);
  }

  @Test(expected = IllegalArgumentException.class)
  public void shouldNotPatchWhenSurnameContainsEmoji() {
    String surname = "❤";
    UserPatchDTO userPatchDTO = new UserPatchDTO(null, surname, null, null, null);
    ApplicationUser user = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    applicationUserManager.patchUser(user, userPatchDTO);
  }

  @Test(expected = IllegalArgumentException.class)
  public void shouldNotPatchWhenUsernameContainsEmoji() {
    String username = "❤";
    UserPatchDTO userPatchDTO = new UserPatchDTO(null, null, username, null, null);
    ApplicationUser user = new ApplicationUser("a", "123456", "a", "a", "a@a.com");
    applicationUserManager.patchUser(user, userPatchDTO);
  }

}
