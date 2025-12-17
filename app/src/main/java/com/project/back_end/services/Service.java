package com.project.back_end.services;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Admin;
import com.project.back_end.models.Appointment;
import com.project.back_end.models.Doctor;
import com.project.back_end.models.Patient;
import com.project.back_end.repo.AdminRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@org.springframework.stereotype.Service
public class Service {

    private final TokenService tokenService;
    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DoctorService doctorService;
    private final PatientService patientService;

    @Autowired
    public Service(TokenService tokenService,
            AdminRepository adminRepository,
            DoctorRepository doctorRepository,
            PatientRepository patientRepository,
            @Lazy DoctorService doctorService,
            @Lazy PatientService patientService) {
        this.tokenService = tokenService;
        this.adminRepository = adminRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.doctorService = doctorService;
        this.patientService = patientService;
    }

    public Map<String, String> validateToken(String token, String user) {
        Map<String, String> response = new HashMap<>();
        if (tokenService.validateToken(token, user)) {
            return response;
        } else {
            response.put("message", "Invalid or expired token");
            return response;
        }
    }

    public ResponseEntity<Map<String, String>> validateAdmin(Admin receivedAdmin) {
        Map<String, String> response = new HashMap<>();
        try {
            Admin admin = adminRepository.findByUsername(receivedAdmin.getUsername());
            if (admin != null) {
                if (admin.getPassword().equals(receivedAdmin.getPassword())) {
                    String token = tokenService.generateToken(admin.getUsername());
                    response.put("token", token);
                    return new ResponseEntity<>(response, HttpStatus.OK);
                } else {
                    response.put("message", "Invalid credentials");
                    return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
                }
            } else {
                response.put("message", "Admin not found");
                return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            response.put("message", "Internal server error");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public Map<String, Object> filterDoctor(String name, String specialty, String time) {
        if (name != null && !name.isEmpty() && specialty != null && !specialty.isEmpty() && time != null
                && !time.isEmpty()) {
            return doctorService.filterDoctorsByNameSpecilityandTime(name, specialty, time);
        } else if (name != null && !name.isEmpty() && time != null && !time.isEmpty()) {
            return doctorService.filterDoctorByNameAndTime(name, time);
        } else if (name != null && !name.isEmpty() && specialty != null && !specialty.isEmpty()) {
            return doctorService.filterDoctorByNameAndSpecility(name, specialty);
        } else if (specialty != null && !specialty.isEmpty() && time != null && !time.isEmpty()) {
            return doctorService.filterDoctorByTimeAndSpecility(specialty, time);
        } else if (name != null && !name.isEmpty()) {
            return doctorService.findDoctorByName(name);
        } else if (specialty != null && !specialty.isEmpty()) {
            return doctorService.filterDoctorBySpecility(specialty);
        } else if (time != null && !time.isEmpty()) {
            return doctorService.filterDoctorsByTime(time);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("data", doctorService.getDoctors());
            return response;
        }
    }

    public int validateAppointment(Appointment appointment) {
        Doctor doctor = doctorRepository.findById(appointment.getDoctor().getId()).orElse(null);
        if (doctor != null) {
            List<String> availableSlots = doctorService.getDoctorAvailability(doctor.getId(),
                    appointment.getAppointmentTime().toLocalDate());
            String appointmentTime = appointment.getAppointmentTime().toLocalTime()
                    .format(DateTimeFormatter.ofPattern("HH:mm"));
            if (availableSlots.contains(appointmentTime)) {
                return 1;
            } else {
                return 0;
            }
        } else {
            return -1;
        }
    }

    public boolean validatePatient(Patient patient) {
        Patient existingPatient = patientRepository.findByEmailOrPhone(patient.getEmail(), patient.getPhone());
        return existingPatient == null;
    }

    public ResponseEntity<Map<String, String>> validatePatientLogin(Login login) {
        Map<String, String> response = new HashMap<>();
        try {
            Patient patient = patientRepository.findByEmail(login.getIdentifier());
            if (patient != null) {
                if (patient.getPassword().equals(login.getPassword())) {
                    String token = tokenService.generateToken(patient.getEmail());
                    response.put("token", token);
                    return new ResponseEntity<>(response, HttpStatus.OK);
                } else {
                    response.put("message", "Invalid password");
                    return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
                }
            } else {
                response.put("message", "Patient not found");
                return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            response.put("message", "Internal server error");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<Map<String, Object>> filterPatient(String condition, String name, String token) {
        String email = tokenService.extractEmail(token);
        Patient patient = patientRepository.findByEmail(email);

        if (patient != null) {
            if (condition != null && !condition.isEmpty() && name != null && !name.isEmpty()) {
                return patientService.filterByDoctorAndCondition(condition, name, patient.getId());
            } else if (name != null && !name.isEmpty()) {
                return patientService.filterByDoctor(name, patient.getId());
            } else if (condition != null && !condition.isEmpty()) {
                return patientService.filterByCondition(condition, patient.getId());
            } else {
                return patientService.getPatientAppointment(patient.getId(), token);
            }
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Patient not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
}
