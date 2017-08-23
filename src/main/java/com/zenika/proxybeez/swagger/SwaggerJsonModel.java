package com.zenika.proxybeez.swagger;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;
import java.util.Map;

/**
 * Created by marc on 29/05/2017.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class SwaggerJsonModel {

    private String swagger;
    private SwaggerInfo info;
    private String host;
    private String basePath;
    private List<SwaggerTags> tags;
    private Map<String, Object> paths;
    private Object definitions;

    public SwaggerJsonModel() {
    }

    public String getSwagger() {
        return swagger;
    }

    public void setSwagger(String swagger) {
        this.swagger = swagger;
    }

    public SwaggerInfo getInfo() {
        return info;
    }

    public void setInfo(SwaggerInfo info) {
        this.info = info;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getBasePath() {
        return basePath;
    }

    public void setBasePath(String basePath) {
        this.basePath = basePath;
    }

    public List<SwaggerTags> getTags() {
        return tags;
    }

    public void setTags(List<SwaggerTags> tags) {
        this.tags = tags;
    }

    public Map<String, Object> getPaths() {
        return paths;
    }

    public void setPaths(Map<String, Object> paths) {
        this.paths = paths;
    }

    public Object getDefinitions() {
        return definitions;
    }

    public void setDefinitions(Object definitions) {
        this.definitions = definitions;
    }
}
