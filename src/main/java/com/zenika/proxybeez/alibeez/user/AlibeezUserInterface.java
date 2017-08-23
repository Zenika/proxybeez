package com.zenika.proxybeez.alibeez.user;

import java.util.Date;

/**
 * Created by marc on 22/05/2017.
 */
public interface AlibeezUserInterface {

    public String getFirstName();

    public String getLastName();

    public String getFullName();

    public String getCurrentManager();

    public String getZenikaEmail();

    public Date getArrivalDay();

    public String getOperationalManagerShortUsername();
}
