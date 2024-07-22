package com.example.reportservices.services;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtils;
import org.jfree.chart.JFreeChart;
import org.jfree.data.general.DefaultPieDataset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {


    @Autowired
    private JavaMailSender emailSender;

    public void generateAndSendReport(Map<String, Object> records, String email) throws MessagingException, IOException, DocumentException {
        try {
            byte[] pdfReport = generatePdfReport(records);
            sendEmailWithAttachment(email, pdfReport);
        } catch (Exception e) {
            throw e;
        }
    }

    private byte[] generatePdfReport(Map<String, Object> records) throws IOException, DocumentException {
        Document document = new Document();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, baos);
        document.open();

        document.add(new Paragraph("Daily Report"));

        if (records.containsKey("SMResults")) {
            document.add(new Paragraph("SM Results"));
            byte[] smChartImage = createSmChart((List<Map<String, Object>>) records.get("SMResults"));
            Image smChart = Image.getInstance(smChartImage);
            smChart.scaleToFit(500, 300);
            document.add(smChart);
        }

        if (records.containsKey("SIPResults")) {
            document.add(new Paragraph("SIP Results"));
            byte[] sipChartImage = createSipChart((List<Map<String, Object>>) records.get("SIPResults"));
            Image sipChart = Image.getInstance(sipChartImage);
            sipChart.scaleToFit(500, 300);
            document.add(sipChart);
        }

        document.close();
        return baos.toByteArray();
    }

    private byte[] createSmChart(List<Map<String, Object>> smResults) throws IOException {
        DefaultPieDataset dataset = new DefaultPieDataset();
        for (Map<String, Object> record : smResults) {
            Number msgStatus = (Number) record.get("MSG_STATUS");
            String key = "MSG_STATUS: " + msgStatus;
            if (dataset.getIndex(key) >= 0) {
                dataset.setValue(key, dataset.getValue(key).doubleValue() + 1);
            } else {
                dataset.setValue(key, 1);
            }
        }

        JFreeChart chart = ChartFactory.createPieChart("SM Results", dataset, true, true, false);
        chart.setBackgroundPaint(Color.white);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ChartUtils.writeChartAsPNG(baos, chart, 600, 400);
        return baos.toByteArray();
    }

    private byte[] createSipChart(List<Map<String, Object>> sipResults) throws IOException {
        DefaultPieDataset dataset = new DefaultPieDataset();
        for (Map<String, Object> record : sipResults) {
            Number sipRespCode = (Number) record.get("SIP_RESP_CODE");
            String key = "SIP_RESP_CODE: " + sipRespCode;
            if (dataset.getIndex(key) >= 0) {
                dataset.setValue(key, dataset.getValue(key).doubleValue() + 1);
            } else {
                dataset.setValue(key, 1);
            }
        }

        JFreeChart chart = ChartFactory.createPieChart("SIP Results", dataset, true, true, false);
        chart.setBackgroundPaint(Color.white);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ChartUtils.writeChartAsPNG(baos, chart, 600, 400);
        return baos.toByteArray();
    }

    private void sendEmailWithAttachment(String to, byte[] pdfReport) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject("Generated Report");
        helper.setText("Please find the attached report.", true);
        helper.addAttachment("report.pdf", new ByteArrayResource(pdfReport));

        emailSender.send(message);
    }
}