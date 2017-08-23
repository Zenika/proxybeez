package com.zenika.proxybeez.alibeez.absence;

import com.zenika.proxybeez.alibeez.HttpClient;
import com.zenika.proxybeez.config.ApplicationProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by marc on 22/05/2017.
 */
public class AlibeezAbsenceRequester {

    private final Logger log = LoggerFactory.getLogger(AlibeezAbsenceRequester.class);

    private ApplicationProperties applicationProperties;

    private static String BASE_URL = "/leaves/requests";

    private static String FIELDS = "fields=lastName,firstName,status,title,creationDate,updateDate,startDay,endDay,numberOfDays";

    private static String FILTER_START = "filter=startDate%3C%3D2017-05-31EVENING";

    private static String FILTER_END = "filter=endDate%3E%3D2017-05-01MORNING";

    private static String FILTER_STATUS = "filter=status%3D%3DPENDING,APPROVED,CANCEL_PENDING";

    public AlibeezAbsenceRequester(ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;
    }

    public List<AlibeezAbsenceProxy> getAbsences() throws IOException {
        HttpClient client = new HttpClient();

        AlibeezAbsenceResponse alibeezAbsenceResponse = client.get(applicationProperties.getAlibeez().getBaseUrl() + BASE_URL + "?"
                + applicationProperties.getAlibeez().getKey() + "&" + FIELDS + "&" + FILTER_START + "&"
                + FILTER_END + "&" + FILTER_STATUS, AlibeezAbsenceResponse.class);

        List<AlibeezAbsence> absences = alibeezAbsenceResponse.getResult();

        List<AlibeezAbsenceProxy> alibeezAbsences = new ArrayList<>();

        for (AlibeezAbsence absence : absences) {
            alibeezAbsences.add(new AlibeezAbsenceProxy(absence));
        }

        return alibeezAbsences;
    }

    private Map<String, AlibeezAbsence> buildUsersMap(List<AlibeezAbsence> absences) {
        Map<String, AlibeezAbsence> map = new HashMap<>();
        for (AlibeezAbsence absence : absences) {
            map.put(absence.getFirstName(), absence);
        }
        return map;
    }
}
