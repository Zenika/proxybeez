package com.zenika.proxybeez.alibeez.v2

import com.codahale.metrics.annotation.Timed
import com.zenika.proxybeez.config.ApplicationProperties
import io.swagger.annotations.Api
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder

@Api(tags = ["User", "Employee"], description = "API to get current employees")
@RestController
@RequestMapping("/api/v2")
class CurrentEmployeesResource(
    val applicationProperties: ApplicationProperties
) {
    @GetMapping("/current-employees")
    @Timed
    fun get(): EmployeesDto =
        listOf(
            applicationProperties.alibeez.key,
            applicationProperties.alibeez.keyCanada,
            applicationProperties.alibeez.keySingapore
        )
            .filter { it.isNotEmpty() }
            .map { getFromAlibeezWithKey(it) }
            .reduce { employees, employeesForKey -> employees.merge(employeesForKey) }

    private fun getFromAlibeezWithKey(key: String): EmployeesDto {
        val uri = UriComponentsBuilder.fromHttpUrl(applicationProperties.alibeez.baseUrl)
            .pathSegment("users")
            .query(key)
            .queryParam("fields", "lastName,firstName,operationalManager,emailPro,tag.etablissement,tag.agency,arrivalDay,operationalManagerShortUsername")
            .queryParam("filter", "type==EMPLOYEE", "enabled==true")
            .build()
            .encode()
            .toUri()
        val restTemplate = RestTemplate()
        val response = restTemplate.getForObject(uri, AlibeezResponse::class.java)
        val employees = response.result.map {
            EmployeeDto(
                "${it.firstName} ${it.lastName}",
                it.emailPro,
                it.tags.etablissement,
                it.tags.agency,
                ManagerDto(
                    it.operationalManager,
                    it.operationalManagerShortUsername + "@zenika.com"
                )
            )
        }
        return EmployeesDto(employees, employees.size)
    }
}

data class AlibeezResponse(
    val result: List<AlibeezUser>
)

data class AlibeezUser(
    val firstName: String,
    val lastName: String,
    val operationalManager: String,
    val operationalManagerShortUsername: String,
    val emailPro: String,
    val arrivalDay: String,
    val tags: AlibeezTags
)

data class AlibeezTags(
    val etablissement: String,
    val agency: String
)

data class EmployeesDto(
    val employees: List<EmployeeDto>,
    val size: Int
) {
    fun merge(other: EmployeesDto): EmployeesDto {
        return EmployeesDto(
            employees = employees + other.employees,
            size = employees.size + other.employees.size
        )
    }
}

data class EmployeeDto(
    val fullName: String,
    val email: String,
    val location: String,
    val division: String,
    val manager: ManagerDto
)

data class ManagerDto(
    val fullName: String,
    val email: String
)
