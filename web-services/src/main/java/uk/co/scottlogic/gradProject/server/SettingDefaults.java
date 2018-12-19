package uk.co.scottlogic.gradProject.server;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import uk.co.scottlogic.gradProject.server.repos.documents.Setting;

public class SettingDefaults {

  private static final Map<String, Serializable> defaults = new HashMap<>();

  static {
    defaults.put("enableRegistration", Boolean.valueOf(false));
  }

  public static Setting get(String key) {
    return new Setting(key, defaults.get(key));
  }

}
