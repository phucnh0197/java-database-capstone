package com.project.back_end.controllers;

import com.project.back_end.models.Appointment;
import com.project.back_end.services.AppointmentService;
import com.project.back_end.services.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final Service service;

    @Autowired
    public AppointmentController(AppointmentService appointmentService, Service service) {
        this.appointmentService = appointmentService;
        this.service = service;
    }

    @GetMapping("/{date}/{patientName}/{token}")
    public ResponseEntity<Map<String, Object>> getAppointments(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @PathVariable String patientName,
            @PathVariable String token) {

        Map<String, String> validation = service.validateToken(token, "doctor");
        if (!validation.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>(validation);
            // Convert Map<String, String> to Map<String, Object> for ResponseEntity type
            // consistency
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }

        if ("null".equals(patientName)) {
            patientName = null;
        }

        Map<String, Object> result = appointmentService.getAppointment(patientName, date, token);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @PostMapping("/{token}")
    public ResponseEntity<Map<String, String>> bookAppointment(
            @PathVariable String token,
            @RequestBody Appointment appointment) {

        Map<String, String> validation = service.validateToken(token, "patient");
        if (!validation.isEmpty()) {
            return new ResponseEntity<>(validation, HttpStatus.UNAUTHORIZED);
        }

        Map<String, String> response = new HashMap<>();
        int validity = service.validateAppointment(appointment);

        if (validity == 1) {
            int result = appointmentService.bookAppointment(appointment);
            if (result == 1) {
                response.put("message", "Appointment booked successfully");
                return new ResponseEntity<>(response, HttpStatus.CREATED);
            } else {
                response.put("message", "Failed to book appointment");
                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else if (validity == 0) {
            response.put("message", "Time slot unavailable");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } else {
            response.put("message", "Invalid doctor ID");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{token}")
    public ResponseEntity<Map<String, String>> updateAppointment(
            @PathVariable String token,
            @RequestBody Appointment appointment) {

        Map<String, String> validation = service.validateToken(token, "patient");
        if (!validation.isEmpty()) {
            return new ResponseEntity<>(validation, HttpStatus.UNAUTHORIZED);
        }

        return appointmentService.updateAppointment(appointment);
    }

    @DeleteMapping("/{id}/{token}")
    public ResponseEntity<Map<String, String>> cancelAppointment(
            @PathVariable long id,
            @PathVariable String token) {

        Map<String, String> validation = service.validateToken(token, "patient");
        if (!validation.isEmpty()) {
            return new ResponseEntity<>(validation, HttpStatus.UNAUTHORIZED);
        }

        return appointmentService.cancelAppointment(id, token);
    }
}
