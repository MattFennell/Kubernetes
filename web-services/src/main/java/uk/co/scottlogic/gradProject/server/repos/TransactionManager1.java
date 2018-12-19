package uk.co.scottlogic.gradProject.server.repos;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import uk.co.scottlogic.gradProject.server.misc.Regex;
import uk.co.scottlogic.gradProject.server.misc.TransactionCountHelper;
import uk.co.scottlogic.gradProject.server.repos.documents.ApplicationUser;
import uk.co.scottlogic.gradProject.server.repos.documents.Category;
import uk.co.scottlogic.gradProject.server.repos.documents.Payee;
import uk.co.scottlogic.gradProject.server.repos.documents.Transaction;
import uk.co.scottlogic.gradProject.server.routers.dto.CountPerMonthDTO;
import uk.co.scottlogic.gradProject.server.routers.dto.InputTransactionDTO;
import uk.co.scottlogic.gradProject.server.routers.dto.TransactionDTO;

@Service
public class TransactionManager1 {

  private static final Logger log = LoggerFactory.getLogger(TransactionManager1.class);

  private ApplicationUserRepo applicationUserRepo;

  // Methods on categories
  private CategoryRepo categoryRepo;

  // Methods on payees
  private PayeeRepo payeeRepo;

  // Methods on transactions
  private TransactionRepo transactionRepo;

  @Autowired
  public TransactionManager1(CategoryRepo categoryRepo, PayeeRepo payeeRepo,
      ApplicationUserRepo applicationUserRepo, TransactionRepo transactionRepo) {
    this.categoryRepo = categoryRepo;
    this.payeeRepo = payeeRepo;
    this.applicationUserRepo = applicationUserRepo;
    this.transactionRepo = transactionRepo;
  }

  public List<TransactionDTO> convertListToDTO(List<Transaction> input) {
    return input.stream().map(TransactionDTO::new).collect(Collectors.toList());
  }

  public void updateTransactionNote(ApplicationUser user, Transaction transaction,
      String description) {
    if (description.length() >= 64) {
      throw new IllegalArgumentException(
          "Transaction note too long - must be less than 64 characters");
    }
    if (user.getUuid().equals(transaction.getCustomer().getUuid())) {
      transaction.setDescription(description);
      log.debug("updated the transaction");
      transactionRepo.save(transaction);
    } else {
      throw new SecurityException("That's not your transaction");
    }
  }

  public void deleteTransactionNote(ApplicationUser user, Transaction transaction) {
    updateTransactionNote(user, transaction, "");
  }

  public void updateTransactionCategory(ApplicationUser user, Transaction transaction,
      String categoryId) {
    Optional<Category> category = categoryRepo.findById(UUID.fromString(categoryId));
    if (category.isPresent()) {
      Category c = category.get();
      if (user.getUuid().equals(transaction.getCustomer().getUuid())) {
        transaction.setCategory(c);
        log.debug("updated the transaction");
        transactionRepo.save(transaction);
      } else {
        throw new SecurityException("That's not your transaction");
      }
    } else {
      throw new IllegalArgumentException("Invalid category ID");
    }
  }

  public Transaction buildTransaction(InputTransactionDTO dto) {
    if (dto.getAmount() == 0) {
      throw new IllegalArgumentException("Invalid transaction amount");
    }
    Optional<Category> category;
    if (dto.getCategory_id() != null) {
      category = categoryRepo.findById(UUID.fromString(dto.getCategory_id()));
    } else {
      category = categoryRepo.findByDescription("General").stream().findAny();
    }
    Optional<Payee> payee = payeeRepo.findById(UUID.fromString(dto.getPayee_id()));
    Optional<ApplicationUser> source = applicationUserRepo.findById(
        UUID.fromString(dto.getUser_id()));
    if (category.isPresent() && payee.isPresent() && source.isPresent()) {
      Category c = category.get();
      Payee p = payee.get();
      ApplicationUser u = source.get();
      return new Transaction(u, dto.getAmount(), "", c, p);
    } else {
      throw new IllegalArgumentException("Invalid ID or Category does not exist");
    }
  }

  public void saveTransaction(Transaction t) {
    ApplicationUser user = t.getCustomer();
    user.changeBalance(t.getAmount());
    applicationUserRepo.save(user);
    transactionRepo.save(t);
  }

  public List<Transaction> getTransactionsOverview(ApplicationUser user, Date start, Date end,
      Integer pageSize, String categoryId) {
    if (start == null && end == null) {
      throw new IllegalArgumentException("Both start and end cannot be null");
    }
    if (pageSize == null || pageSize < 1) {
      throw new IllegalArgumentException("Page Size");
    }
    PageRequest pr = new PageRequest(0, pageSize);
    if (categoryId != null) {
      return getTransactionsByCategory(user, start, end, pr, categoryId);
    } else {
      return getTransactions(user, start, end, pr);
    }
  }

  private List<Transaction> getTransactionsByCategory(ApplicationUser user, Date start, Date end,
      PageRequest pr, String categoryId) {
    Category cat = categoryRepo.findById(UUID.fromString(categoryId))
        .orElseThrow(() -> new IllegalArgumentException("Must be a valid category ID"));
    if (start == null) {
      return getAllTransactionsBeforeEnd(user, end, pr, cat);
    } else if (end == null) {
      return getAllTransactionsSinceStart(user, start, pr, cat);
    } else {
      if (start.after(end)) {
        throw new IllegalArgumentException("Start date must be before the end date");
      }
      return getAllTransactionsInRange(user, start, end, pr, cat);
    }
  }

  private List<Transaction> getTransactions(ApplicationUser user, Date start, Date end,
      PageRequest pr) {
    if (start == null) {
      return getAllTransactionsBeforeEnd(user, end, pr, null);
    } else if (end == null) {
      return getAllTransactionsSinceStart(user, start, pr, null);
    } else {
      if (start.after(end)) {
        throw new IllegalArgumentException("Start date must be before the end date");
      }
      return getAllTransactionsInRange(user, start, end, pr, null);
    }
  }

  private List<Transaction> getAllTransactionsInRange(ApplicationUser user, Date start, Date end,
      PageRequest pr, Category category) {
    if (category == null) {
      List<Transaction> transactions = transactionRepo.findByUserByDateRange(user, start, end, pr);
      Collections.reverse(transactions);
      return transactions;
    } else {
      List<Transaction> transactions = transactionRepo.findByUserByDateRangeByCategory(user, start,
          end, category, pr);
      Collections.reverse(transactions);
      return transactions;
    }
  }

  private List<Transaction> getAllTransactionsBeforeEnd(ApplicationUser user, Date end,
      PageRequest pr, Category category) {
    if (category == null) {
      return transactionRepo.findByUserByDateRangeReversed(user, end, pr);
    } else {
      return transactionRepo.findByUserByDateRangeReversedByCategory(user, end, category, pr);
    }
  }

  private List<Transaction> getAllTransactionsSinceStart(ApplicationUser user, Date start,
      PageRequest pr, Category category) {
    Date end = DateTime.now().plusDays(1).toDate();
    if (category == null) {
      List<Transaction> transactions = transactionRepo.findByUserByDateRange(user, start, end, pr);
      Collections.reverse(transactions);
      return transactions;
    } else {
      List<Transaction> transactions = transactionRepo.findByUserByDateRangeByCategory(user, start,
          end, category, pr);
      Collections.reverse(transactions);
      return transactions;
    }
  }

  public List<CountPerMonthDTO> findCorrectTransactions(ApplicationUser user, String categoryId) {
    if (categoryId == null) {
      return countPerMonth(findAllSinceStartDate(user));
    } else {
      return countPerMonth(findAllSinceStartDateByCategory(user, categoryId));
    }
  }

  private List<CountPerMonthDTO> countPerMonth(List<Transaction> transactions) {
    if (transactions.isEmpty()) {
      return new ArrayList<>();
    }
    if (transactions.get(0).getDate().after(transactions.get(transactions.size() - 1).getDate())) {
      throw new IllegalArgumentException("Dates are not in the correct order - must be ascending");
    }
    Transaction start = transactions.get(0);
    int previousTransactionMonthOffset = 0;
    List<CountPerMonthDTO> listOfAggregatedTransactions = new ArrayList<>();
    listOfAggregatedTransactions.add(new CountPerMonthDTO(start.getMonth(), start.getYear(), 0));
    for (Transaction t : transactions) {
      int currentTransactionMonthOffset = TransactionCountHelper.calculateMonthOffset(t, start);
      if (currentTransactionMonthOffset == previousTransactionMonthOffset) {
        listOfAggregatedTransactions.get(listOfAggregatedTransactions.size() - 1).increaseCount();
      } else {
        for (int i = 1; i < currentTransactionMonthOffset - previousTransactionMonthOffset; i++) {
          int month = TransactionCountHelper.calculateMonth(start.getMonth(),
              i + previousTransactionMonthOffset - 1);
          int year = TransactionCountHelper.calculateYear(start.getMonth(),
              i + previousTransactionMonthOffset - 1, start.getYear());
          listOfAggregatedTransactions.add(new CountPerMonthDTO(month, year, 0));
        }
        int month = TransactionCountHelper.calculateMonth(start.getMonth(),
            currentTransactionMonthOffset - 1);
        int year = TransactionCountHelper.calculateYear(start.getMonth(),
            currentTransactionMonthOffset - 1, start.getYear());
        listOfAggregatedTransactions.add(new CountPerMonthDTO(month, year, 1));
      }
      previousTransactionMonthOffset = currentTransactionMonthOffset;
    }
    return listOfAggregatedTransactions;
  }

  private List<Transaction> findAllSinceStartDate(ApplicationUser user) {
    return transactionRepo.findAllByUser(user);
  }

  private List<Transaction> findAllSinceStartDateByCategory(ApplicationUser user,
      String categoryId) {
    if (!categoryId.matches(Regex.UUID_PATTERN)) {
      throw new IllegalArgumentException("Must be a valid UUID");
    }
    return categoryRepo.findById(UUID.fromString(categoryId))
        .map(category -> transactionRepo.findByUserByCategory(user, category))
        .orElseThrow(() -> new IllegalArgumentException("Invalid Category"));
  }

}
