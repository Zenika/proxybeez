package com.zenika.proxybeez.config.filters;

import com.google.common.base.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class AuthorizationFilter extends OncePerRequestFilter {

    @Value("${application.security.security-key}")
    private String securityKey;

    @Autowired
    private Environment environment;

    @Value("#{'${application.security.secured-profiles}'.split(',')}")
    private List<String> securedProfiles;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

        if (Strings.isNullOrEmpty(this.securityKey)) {
            if (anySecuredProfileIsActive()) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN,
                    "Security authorization is missing in application's properties");
                return;
            }
        } else {
            if (!this.securityKey.equals(request.getHeader("Authorization"))) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                    "Please pass valid Authorization header");
                return;
            }
        }
        filterChain.doFilter(request, response);

    }

    private boolean anySecuredProfileIsActive() {
        return this.securedProfiles.stream().anyMatch(securedProfile ->
            Arrays.asList(this.environment.getActiveProfiles()).contains(securedProfile)
        );
    }
}
