package com.zenika.proxybeez.alibeez.absence;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Date;

/**
 * Created by marc on 22/05/17.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class AlibeezAbsence {

    private String lastName;
    private String firstName;
    private String status;
    private String title;
    private Date creationDate;
    private Date updateDate;
    private Date startDay;
    private Date endDay;
    private String numberOfDays;

    public AlibeezAbsence() {
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public Date getStartDay() {
        return startDay;
    }

    public void setStartDay(Date startDay) {
        this.startDay = startDay;
    }

    public Date getEndDay() {
        return endDay;
    }

    public void setEndDay(Date endDay) {
        this.endDay = endDay;
    }

    public String getNumberOfDays() {
        return numberOfDays;
    }

    public void setNumberOfDays(String numberOfDays) {
        this.numberOfDays = numberOfDays;
    }

    @Override
    public String toString() {
        return "AlibeezAbsence{" +
                "lastName='" + lastName + '\'' +
                ", firstName='" + firstName + '\'' +
                ", status='" + status + '\'' +
                ", title='" + title + '\'' +
                ", creationDate=" + creationDate +
                ", updateDate=" + updateDate +
                ", startDay=" + startDay +
                ", endDay=" + endDay +
                ", numberOfDays='" + numberOfDays + '\'' +
                '}';
    }
}
