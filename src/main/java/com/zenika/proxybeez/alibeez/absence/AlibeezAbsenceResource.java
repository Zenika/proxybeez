package com.zenika.proxybeez.alibeez.absence;

import com.codahale.metrics.annotation.Timed;
import io.swagger.annotations.Api;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by marc on 29/05/2017.
 */
@Api(tags = "Absences", description = "AlibeezAbsenceAPI")
@RestController
@RequestMapping("/api")
public class AlibeezAbsenceResource {

    private final Logger log = LoggerFactory.getLogger(AlibeezAbsence.class);

    private final AlibeezAbsenceService alibeezAbsenceService;

    public AlibeezAbsenceResource(AlibeezAbsenceService alibeezAbsenceService) {
        this.alibeezAbsenceService = alibeezAbsenceService;
    }

    /**
     * GET /absences : get all absences.
     *
     * @return the ResponseEntity with status 200 (OK) and with body all absences
     */
    @GetMapping("/absences")
    @Timed
    public List<AlibeezAbsenceProxy> getAllAbsences() {
        List<AlibeezAbsenceProxy> absences = alibeezAbsenceService.getAbsences();
        return absences;
    }
}
