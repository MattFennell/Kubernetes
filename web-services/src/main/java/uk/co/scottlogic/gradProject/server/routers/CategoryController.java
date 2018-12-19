package uk.co.scottlogic.gradProject.server.routers;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.Authorization;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.co.scottlogic.gradProject.server.misc.Icons;
import uk.co.scottlogic.gradProject.server.misc.Regex;
import uk.co.scottlogic.gradProject.server.repos.CategoryManager;
import uk.co.scottlogic.gradProject.server.repos.CategorySummary;
import uk.co.scottlogic.gradProject.server.repos.documents.ApplicationUser;
import uk.co.scottlogic.gradProject.server.repos.documents.Category;
import uk.co.scottlogic.gradProject.server.routers.dto.CategoryDTO;
import uk.co.scottlogic.gradProject.server.routers.dto.CategorySpendDTO;
import uk.co.scottlogic.gradProject.server.routers.dto.GetCategoryDTO;

@RestController
@RequestMapping("/api")
@Api(value = "category", description = "Operations pertaining to retrieving category info from "
    + "the database")
public class CategoryController {

  private static final Logger log = LoggerFactory.getLogger(User.class);

  private CategoryManager categoryManager;

  @Autowired
  public CategoryController(CategoryManager categoryManager) {
    this.categoryManager = categoryManager;
  }

  @ApiOperation(value = Icons.key
      + " Gets all of the categories stored in the system (unsorted)", notes = "Requires User "
      + "role", authorizations = {@Authorization(value = "jwtAuth")})
  @GetMapping("/category/all")
  @ApiResponses(value = {@ApiResponse(code = 200, message = "Successfully returned"),
      @ApiResponse(code = 500, message = "Server Error")})
  @PreAuthorize("hasRole('USER')")
  public List<CategoryDTO> getAllCategories(@AuthenticationPrincipal ApplicationUser user,
      HttpServletResponse response) {
    try {
      return categoryManager.findAllCategories();
    } catch (Exception e) {
      log.error(e.getMessage());
    }
    return null;
  }

  @ApiOperation(value = Icons.key
      + " Gets the total cost per category within a date range (sorted by price)", notes =
      "Requires User role", authorizations = {
      @Authorization(value = "jwtAuth")})
  @ApiResponses(value = {@ApiResponse(code = 200, message = "Successfully returned"),
      @ApiResponse(code = 400, message = "Invalid date"),
      @ApiResponse(code = 500, message = "Server Error")})
  @GetMapping("/category/date/total")
  @PreAuthorize("hasRole('USER')")
  public List<CategorySpendDTO> getDistinctCostPerCategoryByUserByDate(
      @AuthenticationPrincipal ApplicationUser user, HttpServletResponse response,
      GetCategoryDTO dto) {
    try {
      Map<Category, CategorySummary> transactions =
          categoryManager.findDistinctCostPerCategoryByUserByDate(
          user, dto.getStartDate(), dto.getEndDate(), Integer.MAX_VALUE);
      List<CategorySpendDTO> transactionDTOS = new ArrayList<>();
      for (Category cat : transactions.keySet()) {
        transactionDTOS.add(new CategorySpendDTO(cat, transactions.get(cat)));
      }
      return transactionDTOS;
    } catch (IllegalArgumentException e) {
      response.setStatus(400);
    } catch (Exception e) {
      log.error(e.getMessage());
    }
    return null;
  }

  @ApiOperation(value = Icons.key + " Make a category (admin only)", authorizations = {
      @Authorization(value = "jwtAuth")})
  @ApiResponses(value = {
      @ApiResponse(code = 200, message = "Never returned but swagger won't let me get rid of it"),
      @ApiResponse(code = 201, message = "Category successfully added"),
      @ApiResponse(code = 400, message = "Must provide valid category name"),
      @ApiResponse(code = 500, message = "Server Error")})
  @PostMapping(value = "/category", consumes = {"text/plain"})
  @PreAuthorize("hasRole('ADMIN')")
  public CategoryDTO makeCategory(@AuthenticationPrincipal ApplicationUser user,
      @RequestBody String category_name, HttpServletResponse response) {
    try {
      if (category_name == null) {
        response.setStatus(400);
        throw new IllegalArgumentException("Must provide a category name");
      }
      if (!category_name.matches(Regex.CATEGORY_DESCRIPTION_PATTERN)) {
        response.setStatus(400);
        throw new IllegalArgumentException("Must only contain standard characters");
      }
      Category c = categoryManager.makeCategory(category_name);
      response.setStatus(201);
      return new CategoryDTO(c);
    } catch (DuplicateKeyException e) {
      response.setStatus(409);
    } catch (IllegalArgumentException e) {
      response.setStatus(400);
    }
    return null;
  }

}