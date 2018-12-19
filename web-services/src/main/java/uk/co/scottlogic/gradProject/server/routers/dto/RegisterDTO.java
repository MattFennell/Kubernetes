package uk.co.scottlogic.gradProject.server.routers.dto;

public class RegisterDTO {

  private String username;

  private String password;

  private String firstName;
  private String surname;
  private String email;

  public RegisterDTO(String username, String password, String firstName, String surname, String email) {
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.surname = surname;
    this.email = email;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getSurname() {
    return surname;
  }

  public void setSurname(String surname) {
    this.surname = surname;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

}
