package uk.co.scottlogic.gradProject.server.repos.documents;

import static uk.co.scottlogic.gradProject.server.misc.Regex.EMAIL_PATTERN;
import static uk.co.scottlogic.gradProject.server.misc.Regex.FIRST_NAME_PATTERN;
import static uk.co.scottlogic.gradProject.server.misc.Regex.PASSWORD_PATTERN;
import static uk.co.scottlogic.gradProject.server.misc.Regex.SURNAME_PATTERN;
import static uk.co.scottlogic.gradProject.server.misc.Regex.USERNAME_PATTERN;

import java.io.Serializable;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import org.hibernate.annotations.Type;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCrypt;
import uk.co.scottlogic.gradProject.server.routers.dto.RegisterDTO;

@Entity
@Table(indexes = {
    @Index(name = "idx_applicationuser_username", columnList = "username", unique = true),
    @Index(name = "idx_applicationuser_email", columnList = "email", unique = true)})
public class ApplicationUser implements UserDetails, Serializable {

  @Id
  @Column
  @Type(type = "uuid-char")
  private UUID id;

  @Column(nullable = false)
  private String username;

  @Column(nullable = false)
  private String password;

  @Column(nullable = false)
  private Date accountExpiry;

  @Column(nullable = false)
  private Date credentialsExpiry;

  private String displayName;

  private String nickname;

  @Column(nullable = false)
  private String email;

  @Column(nullable = false)
  private String firstName;

  @Column(nullable = false)
  private String surname;

  private boolean locked = false;

  private boolean enabled = true;

  private long balance;

  @Column
  @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
  @JoinTable(name = "appuser_userauthority", joinColumns = @JoinColumn(name = "applicationuser_id"
      , referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "userauthority_id",
      referencedColumnName = "role"))
  private Set<UserAuthority> authorityList = new HashSet<>();

  @OneToMany(cascade = CascadeType.REMOVE, mappedBy = "user")
  private Collection<RefreshToken> activeTokens;

  public ApplicationUser() {
  }

  public ApplicationUser(RegisterDTO dto) {
    this(dto.getUsername(), dto.getPassword(), dto.getFirstName(), dto.getSurname(), dto.getEmail());
  }

  public ApplicationUser(String username, String password, String firstname, String surname, String email) {
    Calendar expiry = Calendar.getInstance();
    expiry.add(Calendar.YEAR, 1000);
    accountExpiry = expiry.getTime();
    credentialsExpiry = expiry.getTime();
    setUsername(username);
    savePassword(password);
    id = UUID.randomUUID();
    this.balance = 1000;
    setFirstName(firstname);
    setSurname(surname);
    setEmail(email);
  }

  public Collection<RefreshToken> getActiveTokens() {
    return activeTokens;
  }

  public void setActiveTokens(Collection<RefreshToken> activeTokens) {
    this.activeTokens = activeTokens;
  }

  public boolean isLocked() {
    return locked;
  }

  public void setLocked(boolean locked) {
    this.locked = locked;
  }

  public Date getAccountExpiry() {
    return accountExpiry;
  }

  public void setAccountExpiry(Date accountExpiry) {
    this.accountExpiry = accountExpiry;
  }

  public Date getCredentialsExpiry() {
    return credentialsExpiry;
  }

  public void setCredentialsExpiry(Date credentialsExpiry) {
    this.credentialsExpiry = credentialsExpiry;
  }

  public Set<UserAuthority> getAuthorityList() {
    return authorityList;
  }

  public void setAuthorityList(Set<UserAuthority> auths) {
    this.authorityList = new HashSet<>(auths);
  }

  public void addAuthority(UserAuthority authority) {
    authorityList.add(authority);
  }

  public void delAuthority(GrantedAuthority authority) {
    if (authorityList.contains(authority)) {
      this.authorityList.remove(authority);
    }
  }

  @Override
  public Set<? extends GrantedAuthority> getAuthorities() {
    return new HashSet(authorityList);
  }

  public UUID getUuid() {
    return id;
  }

  public String getId() {
    return id.toString();
  }

  protected void setId(String id) {
    this.id = UUID.fromString(id);
  }

  public void setId(UUID id) {
    this.id = id;
  }

  @Override
  public String getPassword() {
    return password;
  }

  void setPassword(String password) {
    this.password = password;
  }

  public void savePassword(String password) {
    if (!password.matches(PASSWORD_PATTERN)) {
      throw new IllegalArgumentException("password");
    }
    this.password = BCrypt.hashpw(password, BCrypt.gensalt(10));
  }

  @Override
  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    if (!username.matches(USERNAME_PATTERN)) {
      throw new IllegalArgumentException();
    }
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    if (!email.matches(EMAIL_PATTERN)) {
      throw new IllegalArgumentException();
    }
    this.email = email;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    if (!firstName.matches(FIRST_NAME_PATTERN)) {
      throw new IllegalArgumentException("firstname");
    }
    this.firstName = firstName;
  }

  public String getSurname() {
    return surname;
  }

  public void setSurname(String surname) {
    if (!surname.matches(SURNAME_PATTERN)) {
      throw new IllegalArgumentException("surname");
    }
    this.surname = surname;
  }

  @Override
  public boolean isAccountNonExpired() {
    return new Date().before(accountExpiry);
  }

  @Override
  public boolean isAccountNonLocked() {
    return !locked;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return new Date().before(credentialsExpiry);
  }

  @Override
  public boolean isEnabled() {
    return enabled;
  }

  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }

  public long getBalance() {
    return balance;
  }

  public void setBalance(long balance) {
    this.balance = balance;
  }

  public void changeBalance(long change) {
    balance += change;
  }

  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  public String getNickname() {
    return nickname;
  }

  public void setNickname(String nickname) {
    this.nickname = nickname;
  }

}
