package com.zenika.proxybeez.alibeez.absence;

import java.util.Date;

/**
 * Created by marc on 22/05/2017.
 */
public interface AlibeezAbsenceInterface {

    String getFirstName();

    String getLastName();

    String getStatus();

    String getTitle();

    Date getStartDay();

    Date getEndDay();

    String getNumberOfDays();
}
