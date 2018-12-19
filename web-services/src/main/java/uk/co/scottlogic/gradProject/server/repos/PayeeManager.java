package uk.co.scottlogic.gradProject.server.repos;

import com.google.common.collect.Lists;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uk.co.scottlogic.gradProject.server.repos.documents.ApplicationUser;
import uk.co.scottlogic.gradProject.server.repos.documents.Payee;
import uk.co.scottlogic.gradProject.server.routers.dto.PayeeDTO;

@Service
public class PayeeManager {

  private static final Logger log = LoggerFactory.getLogger(PayeeManager.class);

  // Methods on payees
  private PayeeRepo payeeRepo;

  // Methods on transactions
  private TransactionRepo transactionRepo;

  @Autowired
  public PayeeManager(PayeeRepo payeeRepo, TransactionRepo transactionRepo) {
    this.payeeRepo = payeeRepo;
    this.transactionRepo = transactionRepo;
  }

  // Returns a long equal to the total amount of money that 'user' has sent to 'payee'
  public long getTotalSpendByCustomerByPayee(ApplicationUser user, UUID payee_id) {
    // Gets all the transactions between the user and payee
    return transactionRepo.aggregate(user, payeeRepo.findById(payee_id).get());
  }

  public List<PayeeDTO> findAllPayees() {
    List<Payee> payeeList = Lists.newArrayList(payeeRepo.findAll());
    List<PayeeDTO> payeeDTOS = new ArrayList<>();
    for (Payee p : payeeList) {
      payeeDTOS.add(new PayeeDTO(p));
    }
    return payeeDTOS;
  }

  // Returns the number of times a 'user' has paid 'payee'
  public long findNumberOfVisitsByUserToPayee(ApplicationUser user, UUID payee_id) {
    return transactionRepo.countByUserByPayee(user, payeeRepo.findById(payee_id).get());
  }

  // Generates a new payee
  public Payee makePayee(String name) {
    if (name.length() >= 64) {
      throw new IllegalArgumentException("Payee name too long - must be less than 64 characters");
    }
    List<Payee> payees = payeeRepo.findByName(name);
    if (payees.isEmpty()) {
      Payee p = new Payee(name);
      payeeRepo.save(p);
      log.debug("Made a new payee with name ({})", name);
      return p;
    } else {
      log.debug("There is already a payee with that name ({})", name);
      throw new IllegalArgumentException("There is already a payee with that name (" + name + ")");
    }
  }

  public String findAddress(UUID payee_id) {
    Optional<Payee> payee = payeeRepo.findById(payee_id);
    if (payee.isPresent()) {
      return payee.get().getAddress();
    } else {
      return null;
    }
  }

}
