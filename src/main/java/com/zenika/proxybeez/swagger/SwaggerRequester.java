package com.zenika.proxybeez.swagger;

import org.json.JSONException;
import org.springframework.boot.autoconfigure.web.ServerProperties;

import java.io.IOException;

/**
 * Created by pc on 07/06/2017.
 */
public class SwaggerRequester {

    private ServerProperties serverProperties;

    public SwaggerRequester(ServerProperties serverProperties) {
        this.serverProperties = serverProperties;
    }

    public SwaggerJsonModel getSwaggerJsonModel() throws IOException, JSONException {
        SwaggerJsonRefactorer swaggerJsonRefactorer = new SwaggerJsonRefactorer(serverProperties);
        return swaggerJsonRefactorer.updateJson();
    }
}
