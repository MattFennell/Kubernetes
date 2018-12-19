package uk.co.scottlogic.gradProject.server.routers;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import uk.co.scottlogic.gradProject.server.repos.ApplicationUserRepo;
import uk.co.scottlogic.gradProject.server.repos.CategoryManager;
import uk.co.scottlogic.gradProject.server.repos.CategoryRepo;
import uk.co.scottlogic.gradProject.server.repos.PayeeRepo;
import uk.co.scottlogic.gradProject.server.repos.TransactionManager1;
import uk.co.scottlogic.gradProject.server.repos.TransactionRepo;
import uk.co.scottlogic.gradProject.server.repos.documents.ApplicationUser;
import uk.co.scottlogic.gradProject.server.routers.dto.CategoryDTO;
import uk.co.scottlogic.gradProject.server.routers.dto.GetCategoryDTO;

@RunWith(SpringRunner.class)
@ContextConfiguration
public class CategoryControllerTest {

  @Mock
  private ApplicationUserRepo applicationUserRepo;

  @Mock
  private CategoryRepo categoryRepo;

  @Mock
  private PayeeRepo payeeRepo;

  @Mock
  private TransactionRepo transactionRepo;

  private TransactionManager1 transactionManager1;

  private CategoryController categoryController;

  private CategoryManager categoryManager;

  @Before
  public void setUp() {
    transactionManager1 = new TransactionManager1(categoryRepo, payeeRepo, applicationUserRepo,
        transactionRepo);
    categoryManager = new CategoryManager(categoryRepo, transactionManager1);
    categoryController = new CategoryController(categoryManager);
  }

  @Test
  public void creatingCategoryReturnsCategoryWithCorrectName() {
    String categoryName = "category name";
    MockHttpServletResponse response = new MockHttpServletResponse();
    ApplicationUser user = new ApplicationUser();
    CategoryDTO categoryDTO = categoryController.makeCategory(user, categoryName, response);
    assertEquals(categoryName, categoryDTO.getDescription());
  }

  @Test
  public void creatingCategoryReturnsCategoryWithCorrectResponseCode() {
    String categoryName = "category name";
    MockHttpServletResponse response = new MockHttpServletResponse();
    ApplicationUser user = new ApplicationUser();
    categoryController.makeCategory(user, categoryName, response);
    assertEquals(201, response.getStatus());
  }

  @Test
  public void creatingCategoryWithInvalidNameGives400() {
    String categoryName = "\uD83D\uDC40";
    MockHttpServletResponse response = new MockHttpServletResponse();
    ApplicationUser user = new ApplicationUser();
    categoryController.makeCategory(user, categoryName, response);
    assertEquals(400, response.getStatus());
  }

  @Test
  public void getDistinctCostPerCategoryByUserByDateReturns200ForValidDates() throws Exception {
    MockHttpServletResponse response = new MockHttpServletResponse();
    String end = "Jan 2018";
    String start = "Dec 2017";
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date mar_2018 = df.parse(end);
    Date dec_2017 = df.parse(start);
    GetCategoryDTO dto = new GetCategoryDTO(dec_2017, mar_2018);
    ApplicationUser user = new ApplicationUser();
    when(transactionRepo.findByUserByDateRange(any(), any(), any(), any())).thenReturn(
        new ArrayList<>());
    when(transactionRepo.findByUserByDateRangeReversed(any(), any(), any())).thenReturn(
        new ArrayList<>());
    categoryController.getDistinctCostPerCategoryByUserByDate(user, response, dto);
    assertEquals(200, response.getStatus());
  }

  @Test
  public void getDistinctCostPerCategoryByUserByDateReturns400WhenBothDatesNull() throws Exception {
    MockHttpServletResponse response = new MockHttpServletResponse();
    String end = "Jan 2018";
    String start = "Dec 2017";
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date mar_2018 = df.parse(end);
    Date dec_2017 = df.parse(start);
    GetCategoryDTO dto = new GetCategoryDTO(null, null);
    ApplicationUser user = new ApplicationUser();
    when(transactionRepo.findByUserByDateRange(any(), any(), any(), any())).thenReturn(
        new ArrayList<>());
    when(transactionRepo.findByUserByDateRangeReversed(any(), any(), any())).thenReturn(
        new ArrayList<>());
    categoryController.getDistinctCostPerCategoryByUserByDate(user, response, dto);
    assertEquals(400, response.getStatus());
  }

}
