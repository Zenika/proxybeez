package com.zenika.proxybeez.alibeez.user;

import com.codahale.metrics.annotation.Timed;
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
@Api(tags = "User", description = "AlibeezUserAPI")
@RestController
@RequestMapping("/api")
public class AlibeezUserResource {

    private final Logger log = LoggerFactory.getLogger(AlibeezUser.class);

    private final AlibeezUserService alibeezUserService;

    public AlibeezUserResource(AlibeezUserService alibeezUserService) {
        this.alibeezUserService = alibeezUserService;
    }

    /**
     * GET /users : get all users.
     *
     * @return the ResponseEntity with status 200 (OK) and with body all users
     */
    @GetMapping("/users")
    @Timed
    public List<AlibeezUserProxy> getAllUsers() {
        List<AlibeezUserProxy> users = alibeezUserService.getUsers();
        return users;
    }
}
