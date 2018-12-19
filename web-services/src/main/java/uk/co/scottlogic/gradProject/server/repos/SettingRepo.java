package uk.co.scottlogic.gradProject.server.repos;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.stereotype.Repository;
import uk.co.scottlogic.gradProject.server.SettingDefaults;
import uk.co.scottlogic.gradProject.server.repos.documents.Setting;

@Repository
public class SettingRepo {

  private static final Logger log = LoggerFactory.getLogger(SettingRepo.class);

  private final DefaultSettingRepo settingRepo;

  SettingRepo(DefaultSettingRepo settingRepo) {
    this.settingRepo = settingRepo;
  }

  public Setting findByOption(String option) {
    try {
      Optional<Setting> setting = settingRepo.findByOption(option);
      if (!setting.isPresent()) {
        setting = Optional.of(SettingDefaults.get(option));
        settingRepo.save(setting.get());
      }
      return setting.get();
    } catch (JpaSystemException e) {
      log.error(e.getMessage() + " Caused by getting setting with option = " + option, e);
      Setting setting = SettingDefaults.get(option);
      settingRepo.save(setting);
      return setting;
    }
  }

  public Setting save(Setting setting) {
    if (setting.getValue() instanceof String) {
      setting.setValue(((String) setting.getValue()).getBytes());
    }
    return settingRepo.save(setting);
  }

}
