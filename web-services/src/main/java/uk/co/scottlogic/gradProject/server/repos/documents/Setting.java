package uk.co.scottlogic.gradProject.server.repos.documents;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;

@Entity
public class Setting {

  @Id
  private String option;

  @Lob
  private Serializable value;

  public Setting() {
  }

  public Setting(String option) {
    this.option = option;
  }

  public Setting(String option, Serializable value) {
    this.option = option;
    this.value = value;
  }

  public Object getValue() {
    return value;
  }

  public void setValue(Serializable value) {
    this.value = value;
  }

  public boolean getBool() {
    return (boolean) value;
  }

  public String getOption() {
    return option;
  }

  public void setOption(String option) {
    this.option = option;
  }

  public String getStr() {
    return (String) value;
  }

}
