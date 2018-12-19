package uk.co.scottlogic.gradProject.server.routers;

import io.swagger.annotations.Api;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.co.scottlogic.gradProject.server.auth.JwtTokenProvider;
import uk.co.scottlogic.gradProject.server.repos.ApplicationUserRepo;

@RestController
@RequestMapping("/api")
@Api(value = "token management", description = "Operations pertaining to Token management. "
    + "For authentication and token renewal see Authentication. ")
public class Token {

  private static final Logger log = LoggerFactory.getLogger(Token.class);

  @Autowired
  private JwtTokenProvider jwtTokenProvider;

  private ApplicationUserRepo applicationUserRepo;

  @Autowired
  public Token(ApplicationUserRepo applicationUserRepo) {
    this.applicationUserRepo = applicationUserRepo;
  }

}