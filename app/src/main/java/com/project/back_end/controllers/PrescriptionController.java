package com.project.back_end.controllers;

import com.project.back_end.models.Prescription;
import com.project.back_end.services.PrescriptionService;
import com.project.back_end.services.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("${api.path}" + "prescription")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final Service service;

    @Autowired
    public PrescriptionController(PrescriptionService prescriptionService, Service service) {
        this.prescriptionService = prescriptionService;
        this.service = service;
    }

    @PostMapping("/{token}")
    public ResponseEntity<Map<String, String>> savePrescription(
            @PathVariable String token,
            @RequestBody Prescription prescription) {

        Map<String, String> validation = service.validateToken(token, "doctor");
        if (!validation.isEmpty()) {
            return new ResponseEntity<>(validation, HttpStatus.UNAUTHORIZED);
        }

        return prescriptionService.savePrescription(prescription);
    }

    @GetMapping("/{appointmentId}/{token}")
    public ResponseEntity<Map<String, Object>> getPrescription(
            @PathVariable Long appointmentId,
            @PathVariable String token) {

        Map<String, String> validation = service.validateToken(token, "doctor");
        if (!validation.isEmpty()) {
            Map<String, Object> errorResponse = new HashMap<>(validation);
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }

        return prescriptionService.getPrescription(appointmentId);
    }
}
