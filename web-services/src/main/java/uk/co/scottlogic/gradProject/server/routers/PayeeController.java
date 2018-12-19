package uk.co.scottlogic.gradProject.server.routers;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.Authorization;
import java.util.List;
import java.util.UUID;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.co.scottlogic.gradProject.server.misc.Icons;
import uk.co.scottlogic.gradProject.server.misc.Regex;
import uk.co.scottlogic.gradProject.server.repos.PayeeManager;
import uk.co.scottlogic.gradProject.server.repos.documents.ApplicationUser;
import uk.co.scottlogic.gradProject.server.repos.documents.Payee;
import uk.co.scottlogic.gradProject.server.routers.dto.PayeeDTO;
import uk.co.scottlogic.gradProject.server.routers.dto.PayeeSummaryDTO;

@RestController
@RequestMapping("/api")
@Api(value = "transaction", description = "Operations pertaining to retrieving payee info from "
    + "the database")
public class PayeeController {

  private static final Logger log = LoggerFactory.getLogger(User.class);

  private PayeeManager payeeManager;

  @Autowired
  public PayeeController(PayeeManager payeeManager) {
    this.payeeManager = payeeManager;
  }

  @ApiOperation(value = Icons.key
      + " Gets a summary about transactions to the specific payee (total visits and total spend)"
      , notes = "Requires User role", authorizations = {
      @Authorization(value = "jwtAuth")})
  @GetMapping("/payee/{id}/summary")
  @ApiResponses(value = {@ApiResponse(code = 200, message = "Successfully returned"),
      @ApiResponse(code = 400, message = "Invalid ID"),
      @ApiResponse(code = 500, message = "Server Error")})
  @PreAuthorize("hasRole('USER')")
  public PayeeSummaryDTO getPayeeSummary(@AuthenticationPrincipal ApplicationUser user,
      HttpServletResponse response, @ApiParam("ID of Payee") @PathVariable("id") String payee_id) {
    try {
      if (payee_id == null) {
        response.setStatus(400);
        throw new IllegalArgumentException("Must be a valid UUID");
      }
      // If the UUID string does not match the required input
      if (!payee_id.matches(Regex.UUID_PATTERN)) {
        response.setStatus(400);
        throw new IllegalArgumentException("Must be a valid UUID");
      }
      long numberOfVisits = payeeManager.findNumberOfVisitsByUserToPayee(user,
          UUID.fromString(payee_id));
      long totalSpend = payeeManager.getTotalSpendByCustomerByPayee(user,
          UUID.fromString(payee_id));
      String address = payeeManager.findAddress(UUID.fromString(payee_id));
      return new PayeeSummaryDTO(numberOfVisits, totalSpend, address);
    } catch (Exception e) {
      log.error(e.getMessage());
    }
    return null;
  }

  @ApiOperation(value = Icons.key
      + " Gets all of the payees stored in the system (unsorted)", notes = "Requires User role",
      authorizations = {
      @Authorization(value = "jwtAuth")})
  @GetMapping("/payee/all")
  @ApiResponses(value = {@ApiResponse(code = 200, message = "Successfully returned"),
      @ApiResponse(code = 500, message = "Server Error")})
  @PreAuthorize("hasRole('USER')")
  public List<PayeeDTO> getAllPayees(@AuthenticationPrincipal ApplicationUser user,
      HttpServletResponse response) {
    try {
      return payeeManager.findAllPayees();
    } catch (Exception e) {
      log.error(e.getMessage());
    }
    return null;
  }

  @ApiOperation(value = Icons.key + " Make a payee (admin only)", authorizations = {
      @Authorization(value = "jwtAuth")})
  @ApiResponses(value = {
      @ApiResponse(code = 200, message = "Never returned but swagger won't let me get rid of it"),
      @ApiResponse(code = 201, message = "Payee successfully added"),
      @ApiResponse(code = 400, message = "Must provide valid payee name"),
      @ApiResponse(code = 500, message = "Server Error")})
  @PostMapping(value = "/payee", consumes = {"text/plain"})
  @PreAuthorize("hasRole('ADMIN')")
  public PayeeDTO makePayee(@AuthenticationPrincipal ApplicationUser user,
      @RequestBody String payee_name, HttpServletResponse response) {
    try {
      if (payee_name == null) {
        response.setStatus(400);
        throw new IllegalArgumentException("Must provide a payee name");
      }
      if (!payee_name.matches(Regex.PAYEE_NAME_PATTERN)) {
        response.setStatus(400);
        throw new IllegalArgumentException("Must only contain standard characters");
      }
      Payee p = payeeManager.makePayee(payee_name);
      response.setStatus(201);
      return new PayeeDTO(p);
    } catch (DuplicateKeyException e) {
      response.setStatus(409);
    } catch (IllegalArgumentException e) {
      response.setStatus(400);
    }
    return null;
  }

}