package com.zenika.proxybeez.alibeez.absence;

import com.zenika.proxybeez.config.ApplicationProperties;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by marc on 22/05/2017.
 */
@Service
public class AlibeezAbsenceService {

    private final ApplicationProperties applicationProperties;

    public AlibeezAbsenceService(ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;
    }

    public List<AlibeezAbsenceProxy> getAbsences() {
        try {
            AlibeezAbsenceRequester alibeezRequester = new AlibeezAbsenceRequester(applicationProperties);
            List<AlibeezAbsenceProxy> absences = alibeezRequester.getAbsences();
            return absences;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
