package com.zenika.proxybeez.swagger;

import com.codahale.metrics.annotation.Timed;
import com.zenika.proxybeez.alibeez.user.AlibeezUser;
import com.zenika.proxybeez.alibeez.user.AlibeezUserProxy;
import com.zenika.proxybeez.alibeez.user.AlibeezUserService;
import com.zenika.proxybeez.swagger.SwaggerJsonModel;
import com.zenika.proxybeez.swagger.SwaggerService;
import io.swagger.annotations.Api;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by marc on 29/05/2017.
 */
@Api(tags = "Swagger", description = "AlibeezSwaggerAPI")
@RestController
@RequestMapping("/api")
public class SwaggerResource {

    private final Logger log = LoggerFactory.getLogger(AlibeezUser.class);

    private final SwaggerService swaggerService;

    public SwaggerResource(SwaggerService swaggerService) {
        this.swaggerService = swaggerService;
    }

    /**
     * GET /swagger : get all users.
     *
     * @return the ResponseEntity with status 200 (OK) and with body all users
     */
    @GetMapping("/swagger")
    @Timed
    public SwaggerJsonModel getJsonModel() {
        SwaggerJsonModel swaggerJsonModel = swaggerService.getSwaggerJsonModel();

        log.debug(swaggerJsonModel.toString());
        return swaggerJsonModel;
    }
}
