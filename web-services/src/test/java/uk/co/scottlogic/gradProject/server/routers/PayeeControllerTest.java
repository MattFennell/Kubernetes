package uk.co.scottlogic.gradProject.server.routers;

import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import uk.co.scottlogic.gradProject.server.repos.PayeeManager;
import uk.co.scottlogic.gradProject.server.repos.PayeeRepo;
import uk.co.scottlogic.gradProject.server.repos.TransactionRepo;
import uk.co.scottlogic.gradProject.server.repos.documents.ApplicationUser;
import uk.co.scottlogic.gradProject.server.repos.documents.Payee;
import uk.co.scottlogic.gradProject.server.routers.dto.PayeeDTO;

@RunWith(SpringRunner.class)
@ContextConfiguration
public class PayeeControllerTest {

  @Mock
  private PayeeRepo payeeRepo;

  @Mock
  private TransactionRepo transactionRepo;

  private PayeeManager payeeManager;

  private PayeeController payeeController;

  private ApplicationUser user;

  @Before
  public void setUp() {
    payeeManager = new PayeeManager(payeeRepo, transactionRepo);
    payeeController = new PayeeController(payeeManager);
    ApplicationUser user = new ApplicationUser();
  }

  @Test
  public void creatingPayeeReturnsPayeeWithCorrectName() {
    String payeeName = "payee name";
    MockHttpServletResponse response = new MockHttpServletResponse();
    PayeeDTO payeeDTO = payeeController.makePayee(user, payeeName, response);
    assertEquals(payeeName, payeeDTO.getName());
  }

  @Test
  public void creatingPayeeReturns201() {
    String payeeName = "payee name";
    MockHttpServletResponse response = new MockHttpServletResponse();
    payeeController.makePayee(user, payeeName, response);
    assertEquals(201, response.getStatus());
  }

  @Test
  public void creatingPayeeWithInvalidNameGives400() {
    String payeeName = "\uD83D\uDC40";
    MockHttpServletResponse response = new MockHttpServletResponse();
    payeeController.makePayee(user, payeeName, response);
    assertEquals(400, response.getStatus());
  }

  @Test
  public void findAllPayeesReturns200() {
    MockHttpServletResponse response = new MockHttpServletResponse();
    payeeController.getAllPayees(user, response);
    assertEquals(200, response.getStatus());
  }

  @Test
  public void getPayeeSummaryReturns200ForValidIds() {
    MockHttpServletResponse response = new MockHttpServletResponse();
    long returned = 10;
    when(payeeRepo.findById(any())).thenReturn(Optional.of(new Payee("payee")));
    when(transactionRepo.countByUserByPayee(any(), any())).thenReturn(returned);
    when(transactionRepo.aggregate(any(), any())).thenReturn(returned);
    payeeController.getPayeeSummary(user, response, UUID.randomUUID().toString());
    assertEquals(200, response.getStatus());
  }

  @Test
  public void getPayeeSummaryReturns400ForNullPayeeID() {
    MockHttpServletResponse response = new MockHttpServletResponse();
    payeeController.getPayeeSummary(user, response, null);
    assertEquals(400, response.getStatus());
  }

  @Test
  public void getPayeeSummaryReturns400ForInvalidPayeeIDRegex() {
    MockHttpServletResponse response = new MockHttpServletResponse();
    payeeController.getPayeeSummary(user, response, "BAD REGEX");
    assertEquals(400, response.getStatus());
  }

}