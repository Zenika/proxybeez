package com.zenika.proxybeez.alibeez.user;

import java.util.Date;

/**
 * Created by marc on 22/05/2017.
 */
public class AlibeezUserProxy implements AlibeezUserInterface {

    public AlibeezUserProxy(AlibeezUser alibeezUser) {
        this.alibeezUser = alibeezUser;
    }

    public AlibeezUserProxy() {
    }

    private AlibeezUser alibeezUser;

    private String lastName;
    private String firstName;
    private String fullName;
    private String etablissement;
    private String currentManager;
    private String zenikaEmail;
    private String operationalManagerShortUsername;
    private Date arrivalDay;

    public String getFirstName() {
        return alibeezUser.getFirstName();
    }

    public void setFirstName(String firstName) {
        this.alibeezUser.setFirstName(firstName);
    }

    public String getFullName() {
        fullName = this.getFirstName() + " " + this.getLastName();
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public AlibeezUser getAlibeezUser() {
        return alibeezUser;
    }

    public void setAlibeezUser(AlibeezUser alibeezUser) {
        this.alibeezUser = alibeezUser;
    }

    public String getEtablissement() {
        return alibeezUser.getEtablissement();
    }

    public void setEtablissement(String etablissement) {
        alibeezUser.setEtablissement(etablissement);
    }

    public String getCurrentManager() {
        return alibeezUser.getOperationalManager();
    }

    public void setCurrentManager(String currentManager) {
        this.alibeezUser.setOperationalManager(currentManager);
    }

    public String getZenikaEmail() {
        return this.alibeezUser.getEmailPro();
    }

    public void setZenikaEmail(String zenikaEmail) {
        this.alibeezUser.setEmailPro(zenikaEmail);
    }

    public Date getArrivalDay() {
        return this.alibeezUser.getArrivalDay();
    }

    public void setArrivalDay(Date arrivalDay) {
        this.alibeezUser.setArrivalDay(arrivalDay);
    }

    public String getLastName() {
        return alibeezUser.getLastName();
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getOperationalManagerShortUsername() {
        return this.alibeezUser.getOperationalManagerShortUsername();
    }

    public void setOperationalManagerShortUsername(String operationalManagerShortUsername) {
        this.alibeezUser.setOperationalManagerShortUsername(operationalManagerShortUsername);
    }
}
