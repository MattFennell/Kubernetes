package uk.co.scottlogic.gradProject.server.routers.dto;

import java.util.Date;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

public class GetCategoryDTO {

  @DateTimeFormat(iso = ISO.DATE_TIME)
  private Date startDate;

  @DateTimeFormat(iso = ISO.DATE_TIME)
  private Date endDate;

  public GetCategoryDTO(Date startDate, Date endDate) {
    this.startDate = startDate;
    this.endDate = endDate;
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

}

