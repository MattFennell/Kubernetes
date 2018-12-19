package uk.co.scottlogic.gradProject.server.routers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ErrorResponseMVCConfig implements WebMvcConfigurer {

  @Autowired
  private ErrorResponseInterceptor errorResponseInterceptor;

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(errorResponseInterceptor)
      .addPathPatterns("/api/**");
  }
}
