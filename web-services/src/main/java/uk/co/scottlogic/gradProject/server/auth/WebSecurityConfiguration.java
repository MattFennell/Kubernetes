package uk.co.scottlogic.gradProject.server.auth;

import java.util.Arrays;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import uk.co.scottlogic.gradProject.server.repos.ApplicationUserRepo;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

  @Autowired
  private ApplicationUserRepo applicationUserRepo;

  @Autowired
  private JwtTokenProvider jwtTokenProvider;

  @Autowired
  private JwtTokenFilterConfiguration jwtTokenFilterConfigurer;

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    // Disable CSRF (cross site request forgery)
    http.cors(); // TODO REMOVE CORS DISABLE
    http.csrf().disable();
    http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    // Entry points
    http.authorizeRequests()
        .antMatchers(HttpMethod.POST, "/api/user/")
        .permitAll()
        .antMatchers(HttpMethod.POST, "/api/user")
        .permitAll()
        .antMatchers(HttpMethod.POST, "/api/token/")
        .permitAll()
        .antMatchers(HttpMethod.POST, "/api/token")
        .permitAll()
        // Disallow everything else..
        .anyRequest()
        .authenticated();
    http.apply(jwtTokenFilterConfigurer);
  }

  @Override
  public void configure(WebSecurity web) throws Exception {
    // Allow swagger to be accessed without authentication
    web.ignoring().antMatchers("/v2/api-docs")//
        .antMatchers("/swagger-resources/**")//
        .antMatchers("/swagger-ui.html")//
        .antMatchers("/configuration/**")//
        .antMatchers("/webjars/**")//
        .antMatchers("/actuator/**")//
        .antMatchers("/public");
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("*"));
    configuration.setAllowedHeaders(
        Arrays.asList("Authorization", "Cache-Control", "Content-Type", "Origin", "Referer",
            "User-Agent"));
    configuration.setAllowCredentials(true);
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);
  }

}