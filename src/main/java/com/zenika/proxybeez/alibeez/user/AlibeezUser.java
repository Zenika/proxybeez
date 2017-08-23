package com.zenika.proxybeez.alibeez.user;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Date;

/**
 * Created by marc on 22/05/17.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class AlibeezUser {

    private String lastName;
    private String firstName;
    private String operationalManager;
    private String emailPro;
    private Date arrivalDay;
    private Date leaveDay;
    private String operationalManagerShortUsername;

    public AlibeezUser() {
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

    public String getOperationalManager() {
        return operationalManager;
    }

    public void setOperationalManager(String operationalManager) {
        this.operationalManager = operationalManager;
    }

    public String getEmailPro() {
        return emailPro;
    }

    public void setEmailPro(String emailPro) {
        this.emailPro = emailPro;
    }

    public Date getArrivalDay() {
        return arrivalDay;
    }

    public void setArrivalDay(Date arrivalDay) {
        this.arrivalDay = arrivalDay;
    }

    public Date getLeaveDay() {
        return leaveDay;
    }

    public void setLeaveDay(Date leaveDay) {
        this.leaveDay = leaveDay;
    }

    public String getOperationalManagerShortUsername() {
        return operationalManagerShortUsername;
    }

    public void setOperationalManagerShortUsername(String operationalManagerShortUsername) {
        this.operationalManagerShortUsername = operationalManagerShortUsername;
    }

    @Override
    public String toString() {
        return "AlibeezUser{" +
                "lastName='" + lastName + '\'' +
                ", firstName='" + firstName + '\'' +
                ", operationalManager='" + operationalManager + '\'' +
                ", emailPro='" + emailPro + '\'' +
                ", arrivalDay=" + arrivalDay +
                ", leaveDay=" + leaveDay +
                ", operationalManagerShortUsername=" + operationalManagerShortUsername +
                '}';
    }
}
