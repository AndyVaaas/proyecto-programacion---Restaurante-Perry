package com.restaurante.service;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurante.entity.Mesa;
import com.restaurante.entity.Pedido;
import com.restaurante.entity.Producto;
import com.restaurante.entity.Usuario;
import com.restaurante.repository.MesaRepository;
import com.restaurante.repository.PedidoRepository;
import com.restaurante.repository.ProductoRepository;
import com.restaurante.repository.UsuarioRepository;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ReporteService {

    @Autowired
    private MesaRepository mesaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    // ==================== EXCEL ====================

    public ByteArrayInputStream generarExcelMesas() throws IOException {
        List<Mesa> mesas = mesaRepository.findAll();
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Mesas");
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("ID");
            headerRow.createCell(1).setCellValue("Capacidad");
            headerRow.createCell(2).setCellValue("Estado");

            int rowIdx = 1;
            for (Mesa m : mesas) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(m.getIdMesa() != null ? m.getIdMesa() : 0);
                row.createCell(1).setCellValue(m.getCapacidad() != null ? m.getCapacidad() : 0);
                row.createCell(2).setCellValue(m.getEstado() != null ? m.getEstado() : "");
            }
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public ByteArrayInputStream generarExcelProductos() throws IOException {
        List<Producto> productos = productoRepository.findAll();
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Productos");
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("ID");
            headerRow.createCell(1).setCellValue("Nombre");
            headerRow.createCell(2).setCellValue("Precio");
            headerRow.createCell(3).setCellValue("Estado");

            int rowIdx = 1;
            for (Producto p : productos) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(p.getIdProducto() != null ? p.getIdProducto() : 0);
                row.createCell(1).setCellValue(p.getNombre() != null ? p.getNombre() : "");
                row.createCell(2).setCellValue(p.getPrecio() != null ? p.getPrecio().doubleValue() : 0.0);
                row.createCell(3).setCellValue(p.getEstado() != null ? p.getEstado() : "");
            }
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public ByteArrayInputStream generarExcelUsuarios() throws IOException {
        List<Usuario> usuarios = usuarioRepository.findAll();
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Usuarios");
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("ID");
            headerRow.createCell(1).setCellValue("Nombre");
            headerRow.createCell(2).setCellValue("Usuario");
            headerRow.createCell(3).setCellValue("Correo");
            headerRow.createCell(4).setCellValue("Rol");

            int rowIdx = 1;
            for (Usuario u : usuarios) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(u.getIdUsuario() != null ? u.getIdUsuario() : 0);
                row.createCell(1).setCellValue(u.getNombre() != null ? u.getNombre() : "");
                row.createCell(2).setCellValue(u.getUsuario() != null ? u.getUsuario() : "");
                row.createCell(3).setCellValue(u.getCorreo() != null ? u.getCorreo() : "");
                row.createCell(4).setCellValue(u.getRol() != null ? u.getRol() : "");
            }
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public ByteArrayInputStream generarExcelPedidos() throws IOException {
        List<Pedido> pedidos = pedidoRepository.findAll();
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Pedidos");
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("ID");
            headerRow.createCell(1).setCellValue("Total");
            headerRow.createCell(2).setCellValue("Estado");

            int rowIdx = 1;
            for (Pedido p : pedidos) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(p.getIdPedido() != null ? p.getIdPedido() : 0);
                row.createCell(1).setCellValue(p.getTotal() != null ? p.getTotal().doubleValue() : 0.0);
                row.createCell(2).setCellValue(p.getEstado() != null ? p.getEstado() : "");
            }
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    // ==================== PDF ====================

    public ByteArrayInputStream generarPdfMesas() {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            PdfWriter.getInstance(document, out);
            document.open();
            Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            document.add(new Paragraph("Reporte de Mesas", fontTitle));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(3);
            table.addCell("ID");
            table.addCell("Capacidad");
            table.addCell("Estado");

            List<Mesa> mesas = mesaRepository.findAll();
            for (Mesa m : mesas) {
                table.addCell(m.getIdMesa() != null ? String.valueOf(m.getIdMesa()) : "");
                table.addCell(m.getCapacidad() != null ? String.valueOf(m.getCapacidad()) : "");
                table.addCell(m.getEstado() != null ? m.getEstado() : "");
            }
            document.add(table);
            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }
        return new ByteArrayInputStream(out.toByteArray());
    }

    public ByteArrayInputStream generarPdfProductos() {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            PdfWriter.getInstance(document, out);
            document.open();
            Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            document.add(new Paragraph("Reporte de Productos", fontTitle));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(4);
            table.addCell("ID");
            table.addCell("Nombre");
            table.addCell("Precio");
            table.addCell("Estado");

            List<Producto> productos = productoRepository.findAll();
            for (Producto p : productos) {
                table.addCell(p.getIdProducto() != null ? String.valueOf(p.getIdProducto()) : "");
                table.addCell(p.getNombre() != null ? p.getNombre() : "");
                table.addCell(p.getPrecio() != null ? String.valueOf(p.getPrecio()) : "");
                table.addCell(p.getEstado() != null ? p.getEstado() : "");
            }
            document.add(table);
            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }
        return new ByteArrayInputStream(out.toByteArray());
    }

    public ByteArrayInputStream generarPdfUsuarios() {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            PdfWriter.getInstance(document, out);
            document.open();
            Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            document.add(new Paragraph("Reporte de Usuarios", fontTitle));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(5);
            table.addCell("ID");
            table.addCell("Nombre");
            table.addCell("Usuario");
            table.addCell("Correo");
            table.addCell("Rol");

            List<Usuario> usuarios = usuarioRepository.findAll();
            for (Usuario u : usuarios) {
                table.addCell(u.getIdUsuario() != null ? String.valueOf(u.getIdUsuario()) : "");
                table.addCell(u.getNombre() != null ? u.getNombre() : "");
                table.addCell(u.getUsuario() != null ? u.getUsuario() : "");
                table.addCell(u.getCorreo() != null ? u.getCorreo() : "");
                table.addCell(u.getRol() != null ? u.getRol() : "");
            }
            document.add(table);
            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }
        return new ByteArrayInputStream(out.toByteArray());
    }

    public ByteArrayInputStream generarPdfPedidos() {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            PdfWriter.getInstance(document, out);
            document.open();
            Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            document.add(new Paragraph("Reporte de Pedidos", fontTitle));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(3);
            table.addCell("ID");
            table.addCell("Total");
            table.addCell("Estado");

            List<Pedido> pedidos = pedidoRepository.findAll();
            for (Pedido p : pedidos) {
                table.addCell(p.getIdPedido() != null ? String.valueOf(p.getIdPedido()) : "");
                table.addCell(p.getTotal() != null ? String.valueOf(p.getTotal()) : "");
                table.addCell(p.getEstado() != null ? p.getEstado() : "");
            }
            document.add(table);
            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }
        return new ByteArrayInputStream(out.toByteArray());
    }
}