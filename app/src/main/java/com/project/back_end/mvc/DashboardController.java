package com.project.back_end.mvc;

import com.project.back_end.services.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@Controller
public class DashboardController {

    // Autowire the Shared Service
    @Autowired
    private Service service;

    // Define the adminDashboard Method
    @GetMapping("/adminDashboard/{token}")
    public String adminDashboard(@PathVariable String token) {
        Map<String, String> validation = service.validateToken(token, "admin");
        if (validation.isEmpty()) {
            // Token is valid -> return the admin/adminDashboard view
            return "admin/adminDashboard";
        } else {
            // If not empty: Redirect to login page
            return "redirect:/";
        }
    }

    // Define the doctorDashboard Method
    @GetMapping("/doctorDashboard/{token}")
    public String doctorDashboard(@PathVariable String token) {
        Map<String, String> validation = service.validateToken(token, "doctor");
        if (validation.isEmpty()) {
            // Token is valid -> return the doctor/doctorDashboard view
            return "doctor/doctorDashboard";
        } else {
            // If invalid: Redirects the user to the login page
            return "redirect:/";
        }
    }
}
