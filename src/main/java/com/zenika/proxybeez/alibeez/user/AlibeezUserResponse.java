package com.zenika.proxybeez.alibeez.user;

import java.util.Date;
import java.util.List;

/**
 * Created by marc on 22/05/2017.
 */
public class AlibeezUserResponse {

    private List<AlibeezUser> result;
    private String duration;
    private Date executionDate;

    public AlibeezUserResponse() {
    }

    public List<AlibeezUser> getResult() {
        return result;
    }

    public void setResult(List<AlibeezUser> result) {
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
