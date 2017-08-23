package com.zenika.proxybeez.alibeez.absence;

import java.util.Date;
import java.util.List;

/**
 * Created by marc on 22/05/2017.
 */
public class AlibeezAbsenceResponse {

    private List<AlibeezAbsence> result;
    private String duration;
    private Date executionDate;

    public AlibeezAbsenceResponse() {
    }

    public List<AlibeezAbsence> getResult() {
        return result;
    }

    public void setResult(List<AlibeezAbsence> result) {
        this.result = result;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public Date getExecutionDate() {
        return executionDate;
    }

    public void setExecutionDate(Date executionDate) {
        this.executionDate = executionDate;
    }
}
