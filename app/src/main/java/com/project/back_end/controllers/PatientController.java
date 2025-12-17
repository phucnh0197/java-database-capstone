package com.project.back_end.controllers;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Patient;
import com.project.back_end.services.PatientService;
import com.project.back_end.services.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/patient")
public class PatientController {

    private final PatientService patientService;
    private final Service service;

    @Autowired
    public PatientController(PatientService patientService, Service service) {
        this.patientService = patientService;
        this.service = service;
    }

    @GetMapping("/{token}")
    public ResponseEntity<Map<String, Object>> getPatientDetails(@PathVariable String token) {
        Map<String, String> validation = service.validateToken(token, "patient");
        if (!validation.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>(validation);
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }

        Map<String, Object> result = patientService.getPatientDetails(token).getBody();
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> createPatient(@RequestBody Patient patient) {
        Map<String, String> response = new HashMap<>();
        if (service.validatePatient(patient)) {
            int result = patientService.createPatient(patient);
            if (result == 1) {
                response.put("message", "Signup successful");
                return new ResponseEntity<>(response, HttpStatus.CREATED);
            } else {
                response.put("message", "Internal server error");
                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            response.put("message", "Patient with email id or phone no already exist");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Login login) {
        return service.validatePatientLogin(login);
    }

    @GetMapping("/{id}/{token}")
    public ResponseEntity<Map<String, Object>> getPatientAppointment(
            @PathVariable Long id,
            @PathVariable String token) {

        Map<String, String> validation = service.validateToken(token, "patient");
        if (!validation.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>(validation);
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }

        return patientService.getPatientAppointment(id, token);
    }

    @GetMapping("/filter/{condition}/{name}/{token}")
    public ResponseEntity<Map<String, Object>> filterPatientAppointment(
            @PathVariable String condition,
            @PathVariable String name,
            @PathVariable String token) {

        Map<String, String> validation = service.validateToken(token, "patient");
        if (!validation.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>(validation);
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }

        // Map "null" string to null for service logic if needed, similar to
        // DoctorController assumption
        String filterCondition = "null".equals(condition) ? null : condition;
        String filterName = "null".equals(name) ? null : name;

        return service.filterPatient(filterCondition, filterName, token);
    }
}
