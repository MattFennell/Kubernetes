package uk.co.scottlogic.gradProject.server.routers;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.Authorization;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.co.scottlogic.gradProject.server.misc.Icons;
import uk.co.scottlogic.gradProject.server.misc.Regex;
import uk.co.scottlogic.gradProject.server.repos.TransactionManager1;
import uk.co.scottlogic.gradProject.server.repos.TransactionRepo;
import uk.co.scottlogic.gradProject.server.repos.documents.ApplicationUser;
import uk.co.scottlogic.gradProject.server.repos.documents.Transaction;
import uk.co.scottlogic.gradProject.server.routers.dto.CountPerMonthDTO;
import uk.co.scottlogic.gradProject.server.routers.dto.GetCountDTO;
import uk.co.scottlogic.gradProject.server.routers.dto.GetTransactionDTO;
import uk.co.scottlogic.gradProject.server.routers.dto.InputCategoryDTO;
import uk.co.scottlogic.gradProject.server.routers.dto.InputTransactionDTO;
import uk.co.scottlogic.gradProject.server.routers.dto.TransactionDTO;

@RestController
@RequestMapping("/api")
@Api(value = "transaction", description = "Operations pertaining to retrieving transaction info "
    + "from the database")
public class TransactionController {

  private static final Logger log = LoggerFactory.getLogger(User.class);

  private TransactionManager1 transactionManager1;

  private TransactionRepo transactionRepo;

  @Autowired
  public TransactionController(TransactionManager1 transactionManager1,
      TransactionRepo transactionRepo) {
    this.transactionManager1 = transactionManager1;
    this.transactionRepo = transactionRepo;
  }

  @ApiOperation(value = Icons.key
      + " Gets the transactions in a specific category for a given date range (sorted by price)",
      notes = "Requires User role", authorizations = {
      @Authorization(value = "jwtAuth")})
  @GetMapping("/transaction/category/{id}/date")
  @ApiResponses(value = {@ApiResponse(code = 200, message = "Returned successfully"),
      @ApiResponse(code = 400, message = "Invalid date / category"),
      @ApiResponse(code = 500, message = "Server Error")})
  @PreAuthorize("hasRole('USER')")
  public List<TransactionDTO> getTransactionByUserByDateByCategory(
      @AuthenticationPrincipal ApplicationUser user, HttpServletResponse response,
      @ApiParam("ID of Category") @PathVariable("id") String category_id, GetTransactionDTO dto) {
    try {
      if (category_id == null) {
        response.setStatus(400);
        throw new IllegalArgumentException("Must be a valid UUID");
      }
      // If the UUID string does not match the required input
      if (!category_id.matches(Regex.UUID_PATTERN)) {
        response.setStatus(400);
        throw new IllegalArgumentException("Must be a valid UUID");
      }
      List<Transaction> transactions = transactionManager1.getTransactionsOverview(user, dto.getStartDate(),
          dto.getEndDate(), dto.getPageSize(), category_id);
      return transactionManager1.convertListToDTO(transactions);
    } catch (IllegalArgumentException e) {
      response.setStatus(400);
    } catch (Exception e) {
      log.error(e.getMessage());
    }
    return new ArrayList<>();
  }

  @ApiOperation(value = Icons.key + " Make a transaction (admin only)", authorizations = {
      @Authorization(value = "jwtAuth")})
  @ApiResponses(value = {
      @ApiResponse(code = 200, message = "Never returned but swagger won't let me get rid of it"),
      @ApiResponse(code = 201, message = "Transaction successfully created"),
      @ApiResponse(code = 400, message = "Invalid input"),
      @ApiResponse(code = 409, message = "Transaction exists"),
      @ApiResponse(code = 500, message = "Server Error")})
  @PostMapping(value = "/transaction")
  @PreAuthorize("hasRole('ADMIN')")
  public TransactionDTO makeTrans(@AuthenticationPrincipal ApplicationUser user,
      @RequestBody InputTransactionDTO transactionDTO, HttpServletResponse response) {
    try {
      if (transactionDTO == null) {
        response.setStatus(400);
        throw new IllegalArgumentException("Must be a valid transaction object");
      }
      Transaction t = transactionManager1.buildTransaction(transactionDTO);
      transactionManager1.saveTransaction(t);
      response.setStatus(201);
      return new TransactionDTO(t);
    } catch (DuplicateKeyException e) {
      response.setStatus(409);
    } catch (IllegalArgumentException e) {
      response.setStatus(400);
    }
    return null;
  }

  @ApiOperation(value = Icons.key + " Sets a note", authorizations = {
      @Authorization(value = "jwtAuth")})
  @ApiResponses(value = {
      @ApiResponse(code = 200, message = "Never returned but swagger won't let me get rid of it"),
      @ApiResponse(code = 201, message = "Note successfully set"),
      @ApiResponse(code = 404, message = "Note not found"),
      @ApiResponse(code = 500, message = "Server Error")})
  @PostMapping(value = "/transaction/{id}/note", consumes = {"text/plain"})
  public void editNote(@AuthenticationPrincipal ApplicationUser user,
      @ApiParam("ID of Transaction") @PathVariable("id") String transaction_id,
      HttpServletResponse response, @RequestBody String description) {
    if (transaction_id == null) {
      response.setStatus(400);
      return;
    }
    // If the UUID string does not match the required input
    if (!transaction_id.matches(Regex.UUID_PATTERN)) {
      response.setStatus(400);
      return;
    }
    try {
      Optional<Transaction> t = transactionRepo.findById(UUID.fromString(transaction_id));
      if (t.isPresent()) {
        transactionManager1.updateTransactionNote(user, t.get(), description);
        response.setStatus(201);
      } else {
        response.setStatus(404);
      }
    } catch (IllegalArgumentException e) {
      response.setStatus(400);
    } catch (SecurityException e) {
      response.setStatus(403);
    }
  }

  @ApiOperation(value = Icons.key + " Deletes a note", authorizations = {
      @Authorization(value = "jwtAuth")})
  @ApiResponses(value = {
      @ApiResponse(code = 204, message = "Note Successfully deleted"),
      @ApiResponse(code = 403, message = "Not permitted to do that"),
      @ApiResponse(code = 404, message = "Note not found")
  })
  @DeleteMapping(value = "/transaction/{id}/note")
  @PreAuthorize("hasRole('USER')")
  public void deleteNote(
      @AuthenticationPrincipal ApplicationUser user,
      @ApiParam("ID of Transaction") @PathVariable("id") String transaction_id,
      HttpServletResponse response
  ) {
    if (transaction_id == null) {
      response.setStatus(400);
      return;
    }
    // If the UUID string does not match the required input
    if (!transaction_id.matches(Regex.UUID_PATTERN)) {
      response.setStatus(400);
      return;
    }
    try {
      Optional<Transaction> t = transactionRepo.findById(UUID.fromString(transaction_id));
      if (t.isPresent()) {
        transactionManager1.deleteTransactionNote(user, t.get());
        response.setStatus(204);
      } else {
        response.setStatus(404);
      }
    } catch (IllegalArgumentException e) {
      response.setStatus(400);
    } catch (SecurityException e) {
      response.setStatus(403);
    }
  }

  @ApiOperation(value = Icons.key + " Change the category for a transaction", authorizations = {
      @Authorization(value = "jwtAuth")})
  @ApiResponses(value = {
      @ApiResponse(code = 200, message = "Never returned but swagger won't let me get rid of it"),
      @ApiResponse(code = 201, message = "Category changed successfully"),
      @ApiResponse(code = 500, message = "Server Error")})
  @PostMapping(value = "/transaction/{id}/category")
  @PreAuthorize("hasRole('USER')")
  public void editCategory(@AuthenticationPrincipal ApplicationUser user,
      @RequestBody InputCategoryDTO category, HttpServletResponse response,
      @ApiParam("ID of Transaction") @PathVariable("id") String transaction_id) {
    try {
      if (!category.getCategory_id().matches(Regex.UUID_PATTERN)) {
        response.setStatus(400);
        throw new IllegalArgumentException("Must be a valid UUID");
      }
      Optional<Transaction> t = transactionRepo.findById(UUID.fromString(transaction_id));
      if (t.isPresent()) {
        transactionManager1.updateTransactionCategory(user, t.get(), category.getCategory_id());
        response.setStatus(201);
      } else {
        response.setStatus(400);
      }
    } catch (DuplicateKeyException e) {
      response.setStatus(409);
    } catch (IllegalArgumentException e) {
      response.setStatus(400);
    }
  }

  @ApiOperation(value = Icons.key
      + " Gets transactions according to specified conditions", notes = "Requires User role",
      authorizations = {
      @Authorization(value = "jwtAuth")})
  @GetMapping("/transaction")
  @ApiResponses(value = {@ApiResponse(code = 200, message = "Successfully returned"),
      @ApiResponse(code = 400, message = "Invalid date"),
      @ApiResponse(code = 500, message = "Server Error")})
  @PreAuthorize("hasRole('USER')")
  public List<TransactionDTO> getTransactions(@AuthenticationPrincipal ApplicationUser user,
      HttpServletResponse response, GetTransactionDTO dto) {
    try {
      // Just provide the start date, end date and how many to search for
      List<Transaction> transactions = transactionManager1.getTransactionsOverview(user, dto.getStartDate(),
          dto.getEndDate(), dto.getPageSize(), null);
      return transactionManager1.convertListToDTO(transactions);
      // example date - 2018-11-21t17:32:28.000Z
    } catch (IllegalArgumentException e) {
      response.setStatus(400);
    } catch (Exception e) {
      log.error(e.getMessage());
    }
    return null;
  }

  @ApiOperation(value = Icons.key
      + " Gets the number of transactions per month", notes = "Requires User role",
      authorizations = {
      @Authorization(value = "jwtAuth")})
  @GetMapping("/transaction/month/count")
  @ApiResponses(value = {@ApiResponse(code = 200, message = "Successfully returned"),
      @ApiResponse(code = 400, message = "Invalid category ID"),
      @ApiResponse(code = 500, message = "Server Error")})
  @PreAuthorize("hasRole('USER')")
  public List<CountPerMonthDTO> numberOfTransactionPerMonth(
      @AuthenticationPrincipal ApplicationUser user, HttpServletResponse response,
      GetCountDTO dto) {
    try {
      // Just provide the start date, end date and how many to search for
      return transactionManager1.findCorrectTransactions(user, dto.getCategory_id());
    } catch (IllegalArgumentException e) {
      response.setStatus(400);
      // example date - 2018-11-21t17:32:28.000Z
    } catch (Exception e) {
      log.error(e.getMessage());
    }
    return null;
  }

}