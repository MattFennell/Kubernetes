package uk.co.scottlogic.gradProject.server.routers;

import static com.google.common.base.Predicates.or;
import static springfox.documentation.builders.PathSelectors.regex;

import com.google.common.base.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.ApiKey;
import springfox.documentation.service.BasicAuth;
import springfox.documentation.service.Contact;
import springfox.documentation.service.SecurityScheme;
import springfox.documentation.service.VendorExtension;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {

  @Bean
  public Docket api() {
    List<SecurityScheme> schemeList = new ArrayList<>();
    schemeList.add(new BasicAuth("basicAuth"));
    schemeList.add(new ApiKey("jwtAuth", "Authorization", "header"));
    return new Docket(DocumentationType.SWAGGER_2).ignoredParameterTypes(
        AuthenticationPrincipal.class)
        .useDefaultResponseMessages(false)
        .securitySchemes(schemeList)
        .select()
        .apis(RequestHandlerSelectors.any())
        .paths(paths())
        .build();
  }

  private ApiInfo metaData() {
    ApiInfo apiInfo = new ApiInfo("Grad App API",
        "API to allow the GradApp web project to get data from stripe", "0.0", "",
        new Contact("", "", ""), "", "", new ArrayList<VendorExtension>());
    return apiInfo;
  }

  private Predicate<String> paths() {
    return or(regex("/api/.*"));
  }

}