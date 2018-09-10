package com.zenika.proxybeez.alibeez.user;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Date;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AlibeezUser {

    private String username;
    private String lastName;
    private String firstName;
    private String operationalManager;
    private Tags tags;
    private Date arrivalDay;
    private Date leaveDay;
    private String operationalManagerShortUsername;

    public AlibeezUser() {
    }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }

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

    public Tags getTags() {
        return tags;
    }

    public void setTags(Tags tags) {
        this.tags = tags;
    }

    @Override
    public String toString() {
        return "AlibeezUser{" +
            "username='" + username + '\'' +
            ", lastName='" + lastName + '\'' +
            ", firstName='" + firstName + '\'' +
            ", operationalManager='" + operationalManager + '\'' +
            ", tags=" + tags +
            ", arrivalDay=" + arrivalDay +
            ", leaveDay=" + leaveDay +
            ", operationalManagerShortUsername='" + operationalManagerShortUsername + '\'' +
            '}';
    }

    public static class Tags {
        private String etablissement;

        public String getEtablissement() {
            return etablissement;
        }

        public void setEtablissement(String etablissement) {
            this.etablissement = etablissement;
        }
    }
}
