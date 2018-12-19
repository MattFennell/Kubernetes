package uk.co.scottlogic.gradProject.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class ServerCommandLineRunner implements CommandLineRunner {

  @Autowired
  public ServerCommandLineRunner() {
  }

  @Override
  public void run(String... args) throws Exception {
  }

}

