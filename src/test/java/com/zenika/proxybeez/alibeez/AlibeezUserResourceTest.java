package com.zenika.proxybeez.alibeez;

import com.zenika.proxybeez.ProxybeezApp;
import com.zenika.proxybeez.alibeez.user.AlibeezUserProxy;
import com.zenika.proxybeez.alibeez.user.AlibeezUserRequester;
import com.zenika.proxybeez.config.ApplicationProperties;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.util.List;

import static org.junit.Assert.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = ProxybeezApp.class)
public class AlibeezUserResourceTest {

    private ApplicationProperties applicationProperties = new ApplicationProperties();

    private AlibeezUserRequester alibeezUserRequester = new AlibeezUserRequester(applicationProperties);

    @Test
    public void getUsersTest() throws IOException {
        List<AlibeezUserProxy> users = alibeezUserRequester.getUsers();
        System.out.println(users);

        assertTrue(!users.isEmpty());
    }
}
