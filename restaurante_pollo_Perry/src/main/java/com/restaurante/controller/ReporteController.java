package com.restaurante.controller;

import com.restaurante.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    // ==================== EXCEL ====================

    @GetMapping("/mesas/excel")
    public ResponseEntity<InputStreamResource> descargarExcelMesas() throws IOException {
        ByteArrayInputStream stream = reporteService.generarExcelMesas();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=reporte_mesas.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(stream));
    }

    @GetMapping("/productos/excel")
    public ResponseEntity<InputStreamResource> descargarExcelProductos() throws IOException {
        ByteArrayInputStream stream = reporteService.generarExcelProductos();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=reporte_productos.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(stream));
    }

    @GetMapping("/usuarios/excel")
    public ResponseEntity<InputStreamResource> descargarExcelUsuarios() throws IOException {
        ByteArrayInputStream stream = reporteService.generarExcelUsuarios();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=reporte_usuarios.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(stream));
    }

    @GetMapping("/pedidos/excel")
    public ResponseEntity<InputStreamResource> descargarExcelPedidos() throws IOException {
        ByteArrayInputStream stream = reporteService.generarExcelPedidos();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=reporte_pedidos.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(stream));
    }

    // ==================== PDF ====================

    @GetMapping("/mesas/pdf")
    public ResponseEntity<InputStreamResource> descargarPdfMesas() throws IOException {
        ByteArrayInputStream stream = reporteService.generarPdfMesas();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=reporte_mesas.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(stream));
    }

    @GetMapping("/productos/pdf")
    public ResponseEntity<InputStreamResource> descargarPdfProductos() throws IOException {
        ByteArrayInputStream stream = reporteService.generarPdfProductos();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=reporte_productos.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(stream));
    }

    @GetMapping("/usuarios/pdf")
    public ResponseEntity<InputStreamResource> descargarPdfUsuarios() throws IOException {
        ByteArrayInputStream stream = reporteService.generarPdfUsuarios();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=reporte_usuarios.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(stream));
    }

    @GetMapping("/pedidos/pdf")
    public ResponseEntity<InputStreamResource> descargarPdfPedidos() throws IOException {
        ByteArrayInputStream stream = reporteService.generarPdfPedidos();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=reporte_pedidos.pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(stream));
    }
}