package com.zenika.proxybeez.alibeez.v2

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "application.alibeez", ignoreUnknownFields = true)
class AlibeezProperties {
    val instances: Map<String, AlibeezInstanceProperties> = mutableMapOf()
}

class AlibeezInstanceProperties {
    lateinit var baseUrl: String
    lateinit var key: String
    val fields: List<String> = mutableListOf()
    val filters: List<String> = mutableListOf()
    var defaults: AlibeezInstanceDefaults? = null
}

class AlibeezInstanceDefaults {
    var location: String? = null
    var division: String? = null
}
