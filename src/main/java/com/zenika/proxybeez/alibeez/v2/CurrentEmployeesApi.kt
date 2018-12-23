package com.zenika.proxybeez.alibeez.v2

import com.codahale.metrics.annotation.Timed
import com.fasterxml.jackson.databind.ObjectMapper
import io.swagger.annotations.Api
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.util.UriComponentsBuilder
import java.net.URI

@Api(tags = ["User", "Employee"], description = "API to get current employees")
@RestController
@RequestMapping("/api/v2")
class CurrentEmployeesResource(
    val alibeezProperties: AlibeezProperties,
    val fetcher: AlibeezCurrentEmployeesFetcher
) {
    @GetMapping("/current-employees")
    @Timed
    fun get(): ResultForAllInstances =
        alibeezProperties.instances
            .filter { it.value.key.isNotEmpty() }
            .mapValues { buildUri(it.value) }
            .mapValues { fetchCurrentEmployees(it.value) }
            .mapValues { (instance, result) ->
                alibeezProperties.instances[instance]?.defaults?.let { applyDefaults(result, it) } ?: result
            }
            .entries
            .fold(ResultForAllInstances()) { resultForAll, (instance, resultForOne) ->
                resultForAll.merge(resultForOne, instance)
            }

    private fun buildUri(config: AlibeezInstanceProperties): URI =
        UriComponentsBuilder.fromHttpUrl(config.baseUrl)
            .pathSegment("users")
            .queryParam("key", config.key)
            .queryParam("fields", config.fields.joinToString(","))
            .queryParam("filter", *config.filters.toTypedArray())
            .build()
            .encode()
            .toUri()

    private fun fetchCurrentEmployees(uri: URI): ResultForOneInstance =
        fetcher.fetch(
            uri,
            ::mapSuccess,
            ::mapError
        )

    private fun mapSuccess(response: AlibeezResponse): ResultForOneInstance {
        val employees = response.result.map { user ->
            EmployeeDto(
                id = user.uuid,
                fullName = "${user.firstName} ${user.lastName}",
                email = user.username,
                location = user.tags?.etablissement,
                division = user.tags?.agency,
                manager = user.operationalManagerShortUsername?.let { operationalManagerShortUsername ->
                    ManagerDto(
                        email = "$operationalManagerShortUsername@zenika.com",
                        // if short user name is present then this one is also present so it's safe to !! here
                        fullName = user.operationalManager!!
                    )
                }
            )
        }
        return ResultForOneInstance(employees, employees.size)
    }

    private fun mapError(exception: HttpClientErrorException, error: AlibeezError) =
        ResultForOneInstance(
            error = ErrorDto(
                statusCode = exception.statusCode.value(),
                statusText = exception.statusText,
                errorCode = error.errorCode,
                errorMessage = error.errorMessage
            )
        )

    private fun applyDefaults(result: ResultForOneInstance, defaults: AlibeezInstanceDefaults) =
        ResultForOneInstance(
            employees = result.employees.map {
                it.copy(
                    location = it.location ?: defaults.location,
                    division = it.division ?: defaults.division
                )
            }
        )
}

@Service
class AlibeezCurrentEmployeesFetcher(
    restTemplateBuilder: RestTemplateBuilder,
    private val objectMapper: ObjectMapper
) {
    private val restTemplate = restTemplateBuilder.build()

    fun fetch(
        uri: URI,
        mapSuccess: (success: AlibeezResponse) -> ResultForOneInstance,
        mapError: (exception: HttpClientErrorException, error: AlibeezError) -> ResultForOneInstance
    ): ResultForOneInstance =
        try {
            val response = restTemplate.getForObject(uri, AlibeezResponse::class.java)
            mapSuccess(response)
        } catch (ex: HttpClientErrorException) {
            val error = objectMapper.readValue(ex.responseBodyAsString, AlibeezError::class.java)
            mapError(ex, error)
        }
}

data class AlibeezResponse(
    val result: List<AlibeezUser>
)

data class AlibeezUser(
    val uuid: String,
    val firstName: String,
    val lastName: String,
    val operationalManager: String?,
    val operationalManagerShortUsername: String?,
    val username: String,
    val arrivalDay: String,
    val tags: AlibeezTags?
)

data class AlibeezTags(
    val etablissement: String?,
    val agency: String?
)

data class AlibeezError(
    val errorCode: String,
    val errorMessage: String
)

data class ResultForAllInstances(
    val employees: List<EmployeeDto> = emptyList(),
    val size: Int = 0,
    val errors: Map<String, ErrorDto> = emptyMap()
) {
    fun merge(other: ResultForOneInstance, errorKey: String): ResultForAllInstances =
        ResultForAllInstances(
            employees = employees + other.employees,
            size = size + other.size,
            errors = other.error?.let { errors + (errorKey to it) } ?: errors
        )
}

data class ResultForOneInstance(
    val employees: List<EmployeeDto> = emptyList(),
    val size: Int = 0,
    val error: ErrorDto? = null
)

data class EmployeeDto(
    val id: String,
    val fullName: String,
    val email: String,
    val location: String?,
    val division: String?,
    val manager: ManagerDto?
)

data class ManagerDto(
    val fullName: String,
    val email: String
)

data class ErrorDto(
    val statusCode: Int,
    val statusText: String,
    val errorCode: String,
    val errorMessage: String
)
