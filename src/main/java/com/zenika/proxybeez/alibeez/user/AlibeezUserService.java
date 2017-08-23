package com.zenika.proxybeez.alibeez.user;

import com.zenika.proxybeez.config.ApplicationProperties;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by marc on 22/05/2017.
 */
@Service
public class AlibeezUserService {

    private final ApplicationProperties applicationProperties;

    public AlibeezUserService(ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;
    }

    public List<AlibeezUserProxy> getUsers() {
        try {
            AlibeezUserRequester alibeezRequester = new AlibeezUserRequester(applicationProperties);
            List<AlibeezUserProxy> users = alibeezRequester.getUsers();
            return users;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
