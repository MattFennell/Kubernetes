package uk.co.scottlogic.gradProject.server.routers;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import uk.co.scottlogic.gradProject.server.misc.StringGenerator;
import uk.co.scottlogic.gradProject.server.repos.ApplicationUserRepo;
import uk.co.scottlogic.gradProject.server.repos.CategoryManager;
import uk.co.scottlogic.gradProject.server.repos.CategoryRepo;
import uk.co.scottlogic.gradProject.server.repos.PayeeRepo;
import uk.co.scottlogic.gradProject.server.repos.TransactionManager1;
import uk.co.scottlogic.gradProject.server.repos.TransactionRepo;
import uk.co.scottlogic.gradProject.server.repos.documents.ApplicationUser;
import uk.co.scottlogic.gradProject.server.repos.documents.Category;
import uk.co.scottlogic.gradProject.server.repos.documents.Payee;
import uk.co.scottlogic.gradProject.server.repos.documents.Transaction;
import uk.co.scottlogic.gradProject.server.routers.dto.GetCountDTO;
import uk.co.scottlogic.gradProject.server.routers.dto.GetTransactionDTO;
import uk.co.scottlogic.gradProject.server.routers.dto.InputCategoryDTO;
import uk.co.scottlogic.gradProject.server.routers.dto.InputTransactionDTO;
import uk.co.scottlogic.gradProject.server.routers.dto.TransactionDTO;

@RunWith(SpringRunner.class)
@ContextConfiguration
public class TransactionControllerTest {

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

  private TransactionController transactionController;

  @Before
  public void setUp() {
    transactionManager1 = new TransactionManager1(categoryRepo, payeeRepo, applicationUserRepo,
        transactionRepo);
    categoryManager = new CategoryManager(categoryRepo, transactionManager1);
    categoryController = new CategoryController(categoryManager);
    transactionController = new TransactionController(transactionManager1, transactionRepo);
  }

  @Test
  public void creatingTransactionReturnsTransactionWithCorrectProperties() {
    int transactionAmount = 100;
    Category category = new Category("Category");
    Payee payee = new Payee("Payee");
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    when(categoryRepo.findById(any())).thenReturn(Optional.of(category));
    when(payeeRepo.findById(any())).thenReturn(Optional.of(payee));
    when(applicationUserRepo.findById(any())).thenReturn(Optional.of(user));
    InputTransactionDTO inputTransactionDTO = new InputTransactionDTO(transactionAmount,
        UUID.randomUUID().toString(), category.getId().toString(), payee.getId().toString());
    MockHttpServletResponse response = new MockHttpServletResponse();
    TransactionDTO transactionDTO = transactionController.makeTrans(user, inputTransactionDTO,
        response);
    assertEquals(transactionAmount, transactionDTO.getAmount());
    assertEquals(category.getId(), transactionDTO.getCategory().getId());
    assertEquals(payee.getId(), transactionDTO.getPayee().getId());
    assertEquals(201, response.getStatus());
  }

  @Test
  public void nullTransactionGives400() {
    ApplicationUser user = new ApplicationUser();
    MockHttpServletResponse response = new MockHttpServletResponse();
    transactionController.makeTrans(user, null, response);
    assertEquals(400, response.getStatus());
  }

  @Test
  public void invalidTransactionCategoryIDGives400() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    InputTransactionDTO inputTransactionDTO = new InputTransactionDTO(100,
        UUID.randomUUID().toString(), "BAD STRING", UUID.randomUUID().toString());
    MockHttpServletResponse response = new MockHttpServletResponse();
    transactionController.makeTrans(user, inputTransactionDTO, response);
    assertEquals(400, response.getStatus());
  }

  @Test
  public void invalidTransactionPayeeIDGives400() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    InputTransactionDTO inputTransactionDTO = new InputTransactionDTO(100,
        UUID.randomUUID().toString(), UUID.randomUUID().toString(), "BAD STRING");
    MockHttpServletResponse response = new MockHttpServletResponse();
    transactionController.makeTrans(user, inputTransactionDTO, response);
    assertEquals(400, response.getStatus());
  }

  @Test
  public void invalidTransactionUserIDGives400() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    InputTransactionDTO inputTransactionDTO = new InputTransactionDTO(100, "BAD STRING",
        UUID.randomUUID().toString(), UUID.randomUUID().toString());
    MockHttpServletResponse response = new MockHttpServletResponse();
    transactionController.makeTrans(user, inputTransactionDTO, response);
    assertEquals(400, response.getStatus());
  }

  @Test
  public void getTransactionByUserByDateByCategoryReturns200ForValidInfo() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    MockHttpServletResponse response = new MockHttpServletResponse();
    transactionController.getTransactionByUserByDateByCategory(user, response,
        UUID.randomUUID().toString(), null);
    assertEquals(200, response.getStatus());
  }

  @Test
  public void getTransactionByUserByDateByCategoryReturns400ForInvalidCategoryIDRegex() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    MockHttpServletResponse response = new MockHttpServletResponse();
    transactionController.getTransactionByUserByDateByCategory(user, response, "BAD ID", null);
    assertEquals(400, response.getStatus());
  }

  @Test
  public void getTransactionByUserByDateByCategoryReturns400ForNullCategoryID() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    MockHttpServletResponse response = new MockHttpServletResponse();
    transactionController.getTransactionByUserByDateByCategory(user, response, null, null);
    assertEquals(400, response.getStatus());
  }

  @Test
  public void editNoteReturns201WhenValidNote() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    Transaction t = new Transaction(user, 100, "", null, null);
    MockHttpServletResponse response = new MockHttpServletResponse();
    when(transactionRepo.findById(any())).thenReturn(Optional.of(t));
    transactionController.editNote(user, UUID.randomUUID().toString(), response, "description");
    assertEquals(201, response.getStatus());
  }

  @Test
  public void editNoteReturns400WhenNoteTooLong() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    Transaction t = new Transaction(user, 100, "", null, null);
    MockHttpServletResponse response = new MockHttpServletResponse();
    when(transactionRepo.findById(any())).thenReturn(Optional.of(t));
    transactionController.editNote(user, UUID.randomUUID().toString(), response,
        StringGenerator.generateString(64));
    assertEquals(400, response.getStatus());
  }

  @Test
  public void editNoteReturns400WhenTransactionIdNull() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    Transaction t = new Transaction(user, 100, "", null, null);
    MockHttpServletResponse response = new MockHttpServletResponse();
    when(transactionRepo.findById(any())).thenReturn(Optional.of(t));
    transactionController.editNote(user, null, response, StringGenerator.generateString(64));
    assertEquals(400, response.getStatus());
  }

  @Test
  public void editNoteReturns400WhenTransactionRegexInvalid() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    Transaction t = new Transaction(user, 100, "", null, null);
    MockHttpServletResponse response = new MockHttpServletResponse();
    when(transactionRepo.findById(any())).thenReturn(Optional.of(t));
    transactionController.editNote(user, "INVALID UUID REGEX", response,
        StringGenerator.generateString(64));
    assertEquals(400, response.getStatus());
  }

  @Test
  public void deleteNoteReturns204WhenValidParametersGiven() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    Transaction t = new Transaction(user, 100, "", null, null);
    MockHttpServletResponse response = new MockHttpServletResponse();
    when(transactionRepo.findById(any())).thenReturn(Optional.of(t));
    transactionController.deleteNote(user, UUID.randomUUID().toString(), response);
    assertEquals(204, response.getStatus());
  }

  @Test
  public void deleteNoteReturns400WhenTransactionIdNull() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    Transaction t = new Transaction(user, 100, "", null, null);
    MockHttpServletResponse response = new MockHttpServletResponse();
    when(transactionRepo.findById(any())).thenReturn(Optional.of(t));
    transactionController.deleteNote(user, null, response);
    assertEquals(400, response.getStatus());
  }

  @Test
  public void deleteNoteReturns400WhenTransactionRegexInvalid() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    Transaction t = new Transaction(user, 100, "", null, null);
    MockHttpServletResponse response = new MockHttpServletResponse();
    when(transactionRepo.findById(any())).thenReturn(Optional.of(t));
    transactionController.deleteNote(user, "INVALID UUID REGEX", response);
    assertEquals(400, response.getStatus());
  }

  @Test
  public void editCategoryReturns201WhenCategoryValid() {
    InputCategoryDTO dto = new InputCategoryDTO(UUID.randomUUID().toString());
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    Transaction t = new Transaction(user, 100, "", null, null);
    Category c = new Category("category");
    MockHttpServletResponse response = new MockHttpServletResponse();
    when(transactionRepo.findById(any())).thenReturn(Optional.of(t));
    when(categoryRepo.findById(any())).thenReturn(Optional.of(c));
    transactionController.editCategory(user, dto, response, UUID.randomUUID().toString());
    assertEquals(201, response.getStatus());
  }

  @Test
  public void editCategoryReturns400WhenCategoryDTORegexInvalid() {
    InputCategoryDTO dto = new InputCategoryDTO("BAD REGEX");
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    Transaction t = new Transaction(user, 100, "", null, null);
    Category c = new Category("category");
    MockHttpServletResponse response = new MockHttpServletResponse();
    when(transactionRepo.findById(any())).thenReturn(Optional.of(t));
    when(categoryRepo.findById(any())).thenReturn(Optional.of(c));
    transactionController.editCategory(user, dto, response, UUID.randomUUID().toString());
    assertEquals(400, response.getStatus());
  }

  @Test
  public void editCategoryReturns400WhenTransactionDoesNotExist() {
    InputCategoryDTO dto = new InputCategoryDTO("BAD REGEX");
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    MockHttpServletResponse response = new MockHttpServletResponse();
    when(transactionRepo.findById(any())).thenReturn(Optional.empty());
    transactionController.editCategory(user, dto, response, UUID.randomUUID().toString());
    assertEquals(400, response.getStatus());
  }

  @Test
  public void editCategoryReturns400WhenCategoryDoesNotExist() {
    InputCategoryDTO dto = new InputCategoryDTO("BAD REGEX");
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    Transaction t = new Transaction(user, 100, "", null, null);
    MockHttpServletResponse response = new MockHttpServletResponse();
    when(transactionRepo.findById(any())).thenReturn(Optional.of(t));
    when(categoryRepo.findById(any())).thenReturn(Optional.empty());
    transactionController.editCategory(user, dto, response, UUID.randomUUID().toString());
    assertEquals(400, response.getStatus());
  }

  @Test
  public void getTransactionsReturns200ForValidInput() throws Exception {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    MockHttpServletResponse response = new MockHttpServletResponse();
    String end = "Jan 2018";
    String start = "Dec 2017";
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date mar_2018 = df.parse(end);
    Date dec_2017 = df.parse(start);
    GetTransactionDTO dto = new GetTransactionDTO(dec_2017, mar_2018, 10);
    transactionController.getTransactions(user, response, dto);
    assertEquals(200, response.getStatus());
  }

  @Test
  public void getTransactionsReturns400WhenBothDatesNull() throws Exception {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    MockHttpServletResponse response = new MockHttpServletResponse();
    GetTransactionDTO dto = new GetTransactionDTO(null, null, 10);
    transactionController.getTransactions(user, response, dto);
    assertEquals(400, response.getStatus());
  }

  @Test
  public void getTransactionsReturns400WhenPageSizeZero() throws Exception {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    MockHttpServletResponse response = new MockHttpServletResponse();
    String end = "Jan 2018";
    String start = "Dec 2017";
    DateFormat df = new SimpleDateFormat("MMM yyyy", Locale.ENGLISH);
    Date mar_2018 = df.parse(end);
    Date dec_2017 = df.parse(start);
    GetTransactionDTO dto = new GetTransactionDTO(dec_2017, mar_2018, 0);
    transactionController.getTransactions(user, response, dto);
    assertEquals(400, response.getStatus());
  }

  @Test
  public void numberOfTransactionPerMonthReturns200ForValidDetailsWithCategory() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    MockHttpServletResponse response = new MockHttpServletResponse();
    List<Transaction> transactionList = new ArrayList<>();
    when(transactionRepo.findByUserByCategory(any(), any())).thenReturn(transactionList);
    when(categoryRepo.findById(any())).thenReturn(Optional.of(new Category("category")));
    transactionController.numberOfTransactionPerMonth(user, response,
        new GetCountDTO(UUID.randomUUID().toString()));
    assertEquals(200, response.getStatus());
  }

  @Test
  public void numberOfTransactionPerMonthReturns200ForValidDetailsWithoutCategory() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    MockHttpServletResponse response = new MockHttpServletResponse();
    transactionController.numberOfTransactionPerMonth(user, response, new GetCountDTO(null));
    assertEquals(200, response.getStatus());
  }

  @Test
  public void numberOfTransactionPerMonthReturns400ForCategoryWithInvalidRegex() {
    ApplicationUser user = new ApplicationUser("user", "123456", "a", "a", "a@a.com");
    MockHttpServletResponse response = new MockHttpServletResponse();
    List<Transaction> transactionList = new ArrayList<>();
    when(transactionRepo.findByUserByCategory(any(), any())).thenReturn(transactionList);
    when(categoryRepo.findById(any())).thenReturn(Optional.of(new Category("category")));
    transactionController.numberOfTransactionPerMonth(user, response, new GetCountDTO("BAD ID"));
    assertEquals(400, response.getStatus());
  }

}