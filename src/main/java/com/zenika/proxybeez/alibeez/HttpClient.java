package com.zenika.proxybeez.alibeez;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by ggaulard on 09/12/2016.
 */
public class HttpClient {

    public HttpClient() {
    }

    public <T> T post(String urlPath, String postData, Class<T> clazz) throws IOException {
        HttpURLConnection con = sendPostRequest(urlPath, postData);
        return readResponse(con, clazz);
    }

    public <T> T get(String urlPath, Class<T> clazz) throws IOException {
        HttpURLConnection con = sendGetRequest(urlPath);
        return readResponse(con, clazz);
    }

    private HttpURLConnection sendGetRequest(String urlPath) throws IOException {
        URL url = new URL(urlPath);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();

        con.setRequestMethod("GET");
        con.setInstanceFollowRedirects(true);

        con.setDoOutput(true);

        return con;
    }

    private HttpURLConnection sendPostRequest(String urlPath, String postData) throws IOException {
        URL url = new URL(urlPath);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();

        con.setRequestMethod("POST");
        con.setInstanceFollowRedirects(true);

        con.setRequestProperty("Content-length", String.valueOf(postData.length()));

        con.setDoOutput(true);
        con.setDoInput(true);

        DataOutputStream output = new DataOutputStream(con.getOutputStream());
        output.writeBytes(postData);
        output.close();

        return con;
    }

    private <T> T readResponse(HttpURLConnection con, Class<T> clazz) throws IOException {
        DataInputStream inputRaw = new DataInputStream(con.getInputStream());
        BufferedReader input = new BufferedReader(new InputStreamReader(inputRaw, "UTF-8"));
        int c;
        StringBuilder resultBuf = new StringBuilder();
        while ((c = input.read()) != -1) {
            resultBuf.append((char) c);
        }
        input.close();

        String response = resultBuf.toString();

        ObjectMapper om = new ObjectMapper();

        /*
         * JsonNode rootNode = om.readTree(response); JsonNode resultNode = rootNode.path("result");
         *
         * System.out.println("ResultNode: "+resultNode);
         */
        T object = om.readValue(response, clazz);
        return object;
    }
}
