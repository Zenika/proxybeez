package com.zenika.proxybeez.alibeez.v2

import com.codahale.metrics.annotation.Timed
import com.fasterxml.jackson.databind.ObjectMapper
import io.swagger.annotations.Api
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder

@Api(tags = ["User", "Employee"], description = "API to get current employees")
@RestController
@RequestMapping("/api/v2")
class CurrentEmployeesResource(
    val alibeezProperties: AlibeezProperties,
    val objectMapper: ObjectMapper
) {
    @GetMapping("/current-employees")
    @Timed
    fun get(): ResultForAllInstances =
        alibeezProperties.instances
            .filter { it.value.key.isNotEmpty() }
            .mapValues { getFromInstance(it.value) }
            .mapValues { (instance, result) ->
                alibeezProperties.instances[instance]?.defaults?.let { applyDefaults(result, it) } ?: result
            }
            .entries
            .fold(ResultForAllInstances()) { resultForAll, (instance, resultForOne) ->
                resultForAll.merge(resultForOne, instance)
            }

    private fun getFromInstance(config: AlibeezInstanceProperties): ResultForOneInstance {
        val uri = UriComponentsBuilder.fromHttpUrl(config.baseUrl)
            .pathSegment("users")
            .queryParam("key", config.key)
            .queryParam("fields", config.fields.joinToString(","))
            .queryParam("filter", *config.filters.toTypedArray())
            .build()
            .encode()
            .toUri()
        val restTemplate = RestTemplate()
        val response = try {
            restTemplate.getForObject(uri, AlibeezResponse::class.java)
        } catch (ex: HttpClientErrorException) {
            val error = objectMapper.readValue(ex.responseBodyAsString, AlibeezError::class.java)
            return ResultForOneInstance(
                error = ErrorDto(
                    statusCode = ex.statusCode.value(),
                    statusText = ex.statusText,
                    errorCode = error.errorCode,
                    errorMessage = error.errorMessage
                )
            )
        }
        val employees = response.result.map { user ->
            EmployeeDto(
                id = user.uuid,
                fullName = "${user.firstName} ${user.lastName}",
                email = user.username,
                location = user.tags?.etablissement,
                division = user.tags?.agency,
                manager = user.operationalManagerShortUsername?.let { managerFullName ->
                    ManagerDto(
                        fullName = managerFullName,
                        email = "${user.operationalManagerShortUsername}@zenika.com"
                    )
                }
            )
        }
        return ResultForOneInstance(employees, employees.size)
    }

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
