package uk.co.scottlogic.gradProject.server.routers;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

@Component
public class ErrorResponseInterceptor extends HandlerInterceptorAdapter {
  private static final Logger log = LoggerFactory.getLogger(ErrorResponseInterceptor.class);

  @Override
  public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
    if (response.getStatus() >= 300 || response.getStatus() < 200) {
      log.error("{} {} {} {} {}",
          request.getMethod(),
          response.getStatus(),
          request.getRequestURI(),
          request.getRemoteAddr(),
          request.getRemoteUser()
      );
    }
  }
}
