package com.zenika.proxybeez.config.filters;

import com.google.common.base.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.stream.Stream;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class AuthorizationFilter extends OncePerRequestFilter {

    @Value("${application.security.authorization}")
    private String authorization;

    @Autowired
    private Environment environment;

    @Value("#{'${application.security.secured-profiles}'.split(',')}")
    private List<String> securedProfiles;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
        if (Strings.isNullOrEmpty(this.authorization) && !containsOnlyIgnoredProfiles()){
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                "Security authorization is missing in application's properties");
        } else if (!isValid(request)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                "Please pass valid Authorization header");
        } else {
            filterChain.doFilter(request, response);
        }
    }

    private boolean isValid(HttpServletRequest request) {
        return Strings.isNullOrEmpty(this.authorization)
            ? containsOnlyIgnoredProfiles()
            : this.authorization.equals(request.getHeader("Authorization"));
    }

    private boolean containsOnlyIgnoredProfiles(){
        return Stream.of(this.environment.getActiveProfiles())
            .noneMatch(activeProfiles ->
                this.securedProfiles.parallelStream().anyMatch(activeProfiles::equals)
            );
    }
}
