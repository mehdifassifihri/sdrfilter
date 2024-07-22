package com.example.reportservices.controllers;

import com.example.reportservices.services.ReportService;
import com.itextpdf.text.DocumentException;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/report")
@CrossOrigin("*")
public class ReportController {
    @Autowired
    private ReportService reportService;

    @PostMapping("/generate")
    public String generateReport(@RequestBody Map<String, Object> records, @RequestParam String email) {
        try {
            reportService.generateAndSendReport(records, email);
            return "Report sent successfully";
        } catch (MessagingException | IOException | DocumentException e) {
            e.printStackTrace();
            return "Failed to send report";
        }
    }
}
