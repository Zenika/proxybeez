package com.zenika.proxybeez.alibeez.user;

import com.zenika.proxybeez.alibeez.HttpClient;
import com.zenika.proxybeez.config.ApplicationProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by marc on 22/05/2017.
 */

public class AlibeezUserRequester {

    private final Logger log = LoggerFactory.getLogger(AlibeezUserRequester.class);

    private ApplicationProperties applicationProperties;

    private static String BASE_URL = "/users";

    private static String FIELDS = "fields=lastName,firstName,operationalManager,emailPro,tag.etablissement,arrivalDay,leaveDay,operationalManagerShortUsername";

    private static String FILTER = "filter=enabled==true";

    public AlibeezUserRequester(ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;
    }

    public List<AlibeezUserProxy> getUsers() throws IOException {
        HttpClient client = new HttpClient();

        AlibeezUserResponse alibeezUserResponse = client.get(applicationProperties.getAlibeez().getBaseUrl() + BASE_URL + "?" + applicationProperties
                .getAlibeez().getKey() + "&" + FIELDS + "&" + FILTER, AlibeezUserResponse.class);

        List<AlibeezUser> users = alibeezUserResponse.getResult();

        List<AlibeezUserProxy> alibeezUsers = new ArrayList<>();

        for (AlibeezUser user : users) {
            alibeezUsers.add(new AlibeezUserProxy(user));
        }

        return alibeezUsers;
    }

    private Map<String, AlibeezUser> buildUsersMap(List<AlibeezUser> users) {
        Map<String, AlibeezUser> map = new HashMap<>();
        for (AlibeezUser user : users) {
            map.put(user.getEmailPro(), user);
        }
        return map;
    }
}
