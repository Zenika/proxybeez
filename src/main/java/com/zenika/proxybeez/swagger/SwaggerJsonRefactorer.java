package com.zenika.proxybeez.swagger;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zenika.proxybeez.alibeez.HttpClient;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.ssl.SSLContextBuilder;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.web.ServerProperties;

import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by marc on 29/05/2017.
 */
public class SwaggerJsonRefactorer {
    private static final String API_URI = "/v2/api-docs?group=internal";

    private static SwaggerJsonModel SWAGGER_CACHE = null;

    private String BASE_URL;

    private final Logger log = LoggerFactory.getLogger(SwaggerJsonRefactorer.class);

    public SwaggerJsonRefactorer(ServerProperties serverProperties) {
        if (serverProperties.getPort() == 443) {
            BASE_URL = "https://proxybeez.zenika.com";
        } else {
            BASE_URL = "http://localhost:" + serverProperties.getPort();
        }
    }

    public SwaggerJsonModel updateJson() throws IOException, JSONException {
        if (SWAGGER_CACHE == null) {
            HttpClient client = new HttpClient();
            SwaggerJsonModel originalSwaggerJsonModel = client.get(BASE_URL + API_URI, SwaggerJsonModel.class);

            changeHost(originalSwaggerJsonModel, "zenika.cloud.tyk.io/proxybeez");
            addLicense(originalSwaggerJsonModel, "Zenika", "zenika.com");
            addContact(originalSwaggerJsonModel, "Zenika", "/", "dsi@zenika.com");
            changePaths(originalSwaggerJsonModel);

            return originalSwaggerJsonModel;
        } else {
            return SWAGGER_CACHE;
        }
    }

    private SwaggerJsonModel readResponse(CloseableHttpResponse httpResponse) throws IOException {
        DataInputStream inputRaw = new DataInputStream(httpResponse.getEntity().getContent());
        BufferedReader input = new BufferedReader(new InputStreamReader(inputRaw, "UTF-8"));
        int c;
        StringBuilder resultBuf = new StringBuilder();
        while ((c = input.read()) != -1) {
            resultBuf.append((char) c);
        }
        input.close();

        String response = resultBuf.toString();

        ObjectMapper om = new ObjectMapper();

        SwaggerJsonModel object = om.readValue(response, SwaggerJsonModel.class);
        return object;
    }

    private void changePaths(SwaggerJsonModel originalSwaggerJsonModel) {
        Map<String, Object> newPaths = new HashMap<>();
        originalSwaggerJsonModel.getPaths().entrySet().stream()
                .forEach(entry -> newPaths.put(changePath(entry.getKey()), entry.getValue()));
        originalSwaggerJsonModel.setPaths(newPaths);
    }

    private String changePath(String key) {
        return key.replaceAll("/api", "");
    }

    public void changeHost(SwaggerJsonModel swaggerJson, String host) {
        swaggerJson.setHost(host);
    }

    public void addLicense(SwaggerJsonModel swaggerJson, String name, String url) {
        SwaggerLicense swaggerLicense = swaggerJson.getInfo().getLicense();
        swaggerLicense.setName(name);
        swaggerLicense.setUrl(url);

        swaggerJson.getInfo().setLicense(swaggerLicense);
    }

    public void addContact(SwaggerJsonModel swaggerJson, String name, String url, String email) {
        SwaggerContact swaggerContact = swaggerJson.getInfo().getContact();
        swaggerContact.setEmail(email);
        swaggerContact.setName(name);
        swaggerContact.setUrl(url);

        swaggerJson.getInfo().setContact(swaggerContact);
    }
}
