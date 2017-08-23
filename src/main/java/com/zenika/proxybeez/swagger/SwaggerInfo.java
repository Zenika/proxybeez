package com.zenika.proxybeez.swagger;

/**
 * Created by marc on 30/05/2017.
 */
public class SwaggerInfo {

    private String description;
    private String version;
    private String title;
    private SwaggerContact contact;
    private SwaggerLicense license;

    public SwaggerInfo() {
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public SwaggerContact getContact() {
        return contact;
    }

    public void setContact(SwaggerContact contact) {
        this.contact = contact;
    }

    public SwaggerLicense getLicense() {
        return license;
    }

    public void setLicense(SwaggerLicense license) {
        this.license = license;
    }
}
