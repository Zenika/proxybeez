package com.zenika.proxybeez.swagger;

import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.stereotype.Service;

/**
 * Created by pc on 07/06/2017.
 */
@Service
public class SwaggerService {

    private ServerProperties serverProperties;

    public SwaggerService(ServerProperties serverProperties) {
        this.serverProperties = serverProperties;
    }

    public SwaggerJsonModel getSwaggerJsonModel() {
        try {
            SwaggerRequester swaggerRequester = new SwaggerRequester(serverProperties);
            SwaggerJsonModel swaggerJsonModel = swaggerRequester.getSwaggerJsonModel();
            return swaggerJsonModel;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
