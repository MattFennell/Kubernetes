package uk.co.scottlogic.gradProject.server.routers.dto;

import java.util.Date;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

public class GetTransactionDTO {

  @DateTimeFormat(iso = ISO.DATE_TIME)
  private Date startDate;

  @DateTimeFormat(iso = ISO.DATE_TIME)
  private Date endDate;

  private int pageSize;

  public GetTransactionDTO(Date startDate, Date endDate, int pageSize) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.pageSize = pageSize;
  }

  public Date getEndDate() {
    return endDate;
  }

  public void setEndDate(Date endDate) {
    this.endDate = endDate;
  }

  public Date getStartDate() {
    return startDate;
  }

  public void setStartDate(Date startDate) {
    this.startDate = startDate;
  }

  public int getPageSize() {
    return pageSize;
  }

  public void setPageSize(int pageSize) {
    this.pageSize = pageSize;
  }

}

