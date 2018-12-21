package com.zenika.proxybeez.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to JHipster.
 *
 * <p>
 * Properties are configured in the application.yml file.
 * </p>
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {

    private final Alibeez alibeez = new Alibeez();

    private final Tyk tyk = new Tyk();

    public static class Alibeez {
        private String baseUrl = "";
        private String key = "";
        private String keyCanada = "";
        private String keySingapore = "";

        public String getKeyCanada() {
            return keyCanada;
        }

        public void setKeyCanada(String keyCanada) {
            this.keyCanada = keyCanada;
        }

        public String getKeySingapore() {
            return keySingapore;
        }

        public void setKeySingapore(String keySingapore) {
            this.keySingapore = keySingapore;
        }

        Alibeez() {
        }

        public String getBaseUrl() {
            return baseUrl;
        }

        public void setBaseUrl(String baseUrl) {
            this.baseUrl = baseUrl;
        }

        public String getKey() {
            return key;
        }

        public void setKey(String key) {
            this.key = key;
        }
    }

    public static class Tyk {
        private String token;

        Tyk() {
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }
    }

    public Alibeez getAlibeez() {
        return alibeez;
    }

    Tyk getTyk() {
        return tyk;
    }
}
