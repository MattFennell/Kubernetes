package uk.co.scottlogic.gradProject.server.repos.documents;

import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Transient;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.SpringSecurityCoreVersion;
import org.springframework.util.Assert;

@Entity
public class UserAuthority implements GrantedAuthority {

  private static final long serialVersionUID = SpringSecurityCoreVersion.SERIAL_VERSION_UID;

  @Id
  private String role;

  @ManyToMany(mappedBy = "authorityList")
  @Transient
  private Set<ApplicationUser> applicationUsers;

  public UserAuthority() {
  }

  public UserAuthority(String role) {
    Assert.hasText(role, "A granted authority textual representation is required");
    this.role = role;
  }

  public static long getSerialVersionUID() {
    return serialVersionUID;
  }

  public Set<ApplicationUser> getApplicationUsers() {
    return applicationUsers;
  }

  public void setApplicationUsers(Set<ApplicationUser> applicationUsers) {
    this.applicationUsers = applicationUsers;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  @Override
  public String getAuthority() {
    return role;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) {
      return true;
    }
    if (obj instanceof UserAuthority) {
      return role.equals(((UserAuthority) obj).role);
    }
    return false;
  }

  @Override
  public int hashCode() {
    return this.role.hashCode();
  }

  @Override
  public String toString() {
    return this.role;
  }

}