package com.zenika.proxybeez.alibeez.user;

import java.util.Date;

/**
 * Created by marc on 22/05/2017.
 */
public class AlibeezUserProxy {

    public AlibeezUserProxy(AlibeezUser alibeezUser) {
        this.alibeezUser = alibeezUser;
    }

    public AlibeezUserProxy() {
    }

    private AlibeezUser alibeezUser;

    public String getFirstName() {
        return alibeezUser.getFirstName();
    }

    public void setFirstName(String firstName) {
        this.alibeezUser.setFirstName(firstName);
    }

    public String getFullName() {
        return this.getFirstName() + " " + this.getLastName();
    }

    public String getGeographicalAgency() {
        return alibeezUser.getTags().getEtablissement();
    }

    public String getCurrentManager() {
        return alibeezUser.getOperationalManager();
    }

    public String getZenikaEmail() {
        return this.alibeezUser.getEmailPro();
    }

    public Date getArrivalDay() {
        return this.alibeezUser.getArrivalDay();
    }

    public String getLastName() {
        return alibeezUser.getLastName();
    }

    public String getOperationalManagerShortUsername() {
        return this.alibeezUser.getOperationalManagerShortUsername();
    }

}
