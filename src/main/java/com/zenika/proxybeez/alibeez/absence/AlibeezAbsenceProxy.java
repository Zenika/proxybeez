package com.zenika.proxybeez.alibeez.absence;

import java.util.Date;

/**
 * Created by marc on 22/05/2017.
 */
public class AlibeezAbsenceProxy implements AlibeezAbsenceInterface {

    public AlibeezAbsenceProxy(AlibeezAbsence alibeezAbsence) {
        this.alibeezAbsence = alibeezAbsence;
    }

    public AlibeezAbsenceProxy() {
    }

    private AlibeezAbsence alibeezAbsence;

    private String lastName;
    private String firstName;
    private String status;
    private String title;
    private Date creationDate;
    private Date updateDate;
    private Date startDay;
    private Date endDay;
    private String numberOfDays;

    public String getFirstName() {
        return alibeezAbsence.getFirstName();
    }

    public void setFirstName(String firstName) {
        this.alibeezAbsence.setFirstName(firstName);
    }

    public String getLastName() {
        return alibeezAbsence.getLastName();
    }

    public void setLastName(String lastName) {
        this.alibeezAbsence.setLastName(lastName);
    }

    public String getStatus() {
        return alibeezAbsence.getStatus();
    }

    public void setStatus(String status) {
        this.alibeezAbsence.setStatus(status);
    }

    public String getTitle() {
        return alibeezAbsence.getTitle();
    }

    public void setTitle(String title) {
        this.alibeezAbsence.setTitle(title);
    }

    public Date getCreationDate() {
        return alibeezAbsence.getCreationDate();
    }

    public void setCreationDate(Date creationDate) {
        this.alibeezAbsence.setCreationDate(creationDate);
    }

    public Date getUpdateDate() {
        return alibeezAbsence.getUpdateDate();
    }

    public void setUpdateDate(Date updateDate) {
        this.alibeezAbsence.setUpdateDate(updateDate);
    }

    public Date getStartDay() {
        return alibeezAbsence.getStartDay();
    }

    public void setStartDay(Date startDay) {
        this.alibeezAbsence.setStartDay(startDay);
    }

    public Date getEndDay() {
        return alibeezAbsence.getEndDay();
    }

    public void setEndDay(Date endDay) {
        this.alibeezAbsence.setEndDay(endDay);
    }

    public String getNumberOfDays() {
        return alibeezAbsence.getNumberOfDays();
    }

    public void setNumberOfDays(String numberOfDays) {
        this.alibeezAbsence.setNumberOfDays(numberOfDays);
    }
}
