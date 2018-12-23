package com.zenika.proxybeez

import com.zenika.proxybeez.alibeez.v2.AlibeezProperties
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Configuration

/**
 * Since Java sources are compiled before Kotlin sources,
 * Java code cannot refer to Kotlin code. This means the
 * AlibeezProperties configuration properties class cannot
 * be referred to in ProxybeezApp. This is why ProxybeezAppKt
 * exists.
 */
@Configuration
@EnableConfigurationProperties(AlibeezProperties::class)
class ProxybeezAppKt
