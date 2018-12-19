package uk.co.scottlogic.gradProject.server.repos;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import uk.co.scottlogic.gradProject.server.misc.StringGenerator;
import uk.co.scottlogic.gradProject.server.repos.documents.Payee;

@RunWith(SpringRunner.class)
@ContextConfiguration
public class PayeeManagerTest {

  @Mock
  private ApplicationUserRepo applicationUserRepo;

  @Mock
  private PayeeRepo payeeRepo;

  @Mock
  private TransactionRepo transactionRepo;

  private PayeeManager payeeManager;

  @Before
  public void setUp() {
    payeeManager = new PayeeManager(payeeRepo, transactionRepo);
  }

  @Test(expected = IllegalArgumentException.class)
  public void creatingPayeeWithNameAtLeast64CharactersFails() {
    String longPayeeName = StringGenerator.generateString(64);
    payeeManager.makePayee(longPayeeName);
  }

  @Test
  public void creatingPayeeWithNameAtLessThan64CharactersSucceedsIfNameDoesNotExist() {
    String shortPayeeName = StringGenerator.generateString(63);
    payeeManager.makePayee(shortPayeeName);
  }

  @Test(expected = IllegalArgumentException.class)
  public void creatingPayeeWIthNameThatAlreadyExistsThrowsException() {
    String payeeName = "payee";
    List<Payee> payees = new ArrayList<>();
    payees.add(new Payee("payee"));
    when(payeeRepo.findByName(any())).thenReturn(payees);
    payeeManager.makePayee(payeeName);
  }

}
