package uk.co.scottlogic.gradProject.server.repos;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import uk.co.scottlogic.gradProject.server.repos.documents.ApplicationUser;
import uk.co.scottlogic.gradProject.server.repos.documents.Category;
import uk.co.scottlogic.gradProject.server.repos.documents.Payee;
import uk.co.scottlogic.gradProject.server.repos.documents.Transaction;

@Repository
public interface TransactionRepo extends CrudRepository<Transaction, UUID> {

  // Find by the customers unique id
  public List<Transaction> findByCustomer(ApplicationUser customer);

  // Find the number of times a user has visited a single payee
  @Query(value = "SELECT COUNT(t) FROM Transaction t WHERE t.customer=?1 AND t.payee=?2")
  public long countByUserByPayee(ApplicationUser user, Payee payee);

  // Find the number of times a user has visited a single payee
  @Query(value = "SELECT SUM(t.amount) FROM Transaction as t WHERE t.customer = ?1 AND t.payee = "
      + "?2")
  public long aggregate(ApplicationUser user, Payee payee);

  @Query(value = "FROM Transaction WHERE customer = ?1 AND date >= ?2 AND date < ?3 ORDER BY date"
      + " ASC")
  List<Transaction> findByUserByDateRange(ApplicationUser customer, Date start, Date end,
      PageRequest pr);

  @Query(value = "FROM Transaction WHERE customer = ?1 AND date < ?2 ORDER BY date DESC")
  List<Transaction> findByUserByDateRangeReversed(ApplicationUser user, Date end, PageRequest pr);

  @Query(value =
      "FROM Transaction WHERE customer = ?1 AND date >= ?2 AND date < ?3 AND category = ?4 ORDER "
          + "BY date" + " ASC")
  List<Transaction> findByUserByDateRangeByCategory(ApplicationUser customer, Date start, Date end,
      Category category, PageRequest pr);

  @Query(value = "FROM Transaction WHERE customer = ?1 AND date < ?2 AND category = ?3 ORDER BY "
      + "date DESC")
  List<Transaction> findByUserByDateRangeReversedByCategory(ApplicationUser user, Date end,
      Category category, PageRequest pr);

  @Query(value = "FROM Transaction WHERE customer = ?1 ORDER BY date ASC")
  List<Transaction> findAllByUser(ApplicationUser customer);

  @Query(value = "FROM Transaction WHERE customer = ?1 AND category = ?2 ORDER BY DATE ASC")
  public List<Transaction> findByUserByCategory(ApplicationUser customer, Category category);

}