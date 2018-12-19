package uk.co.scottlogic.gradProject.server.repos.documents;

import java.util.Date;
import java.util.UUID;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import org.hibernate.annotations.Type;

@Entity
@Table(indexes = {@Index(name = "idx_refreshtoken_user", columnList = "user"),
    @Index(name = "idx_refreshtoken_expiry", columnList = "expiry")})
public class RefreshToken {

  @Id
  @Type(type = "uuid-char")
  private UUID refresh;

  @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
  @JoinColumn(name = "user")
  private ApplicationUser user;

  private Date expiry;

  private boolean used;

  public RefreshToken() {
  }

  public RefreshToken(UUID refresh, ApplicationUser user, Date expiry) {
    this.refresh = refresh;
    this.user = user;
    this.expiry = expiry;
    this.used = false;
  }

  public Date getExpiry() {
    return expiry;
  }

  public void setExpiry(Date expiry) {
    this.expiry = expiry;
  }

  public UUID getRefresh() {
    return refresh;
  }

  public void setRefresh(UUID refresh) {
    this.refresh = refresh;
  }

  public ApplicationUser getUser() {
    return user;
  }

  public void setUser(ApplicationUser user) {
    this.user = user;
  }

  public boolean isUsed() {
    return used;
  }

  public void setUsed(boolean used) {
    this.used = used;
  }

}
