package com.restaurante.controller;

import com.restaurante.dto.MesaDTO;
import com.restaurante.service.MesaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/mesas")
public class MesaController {

    @Autowired
    private MesaService mesaService;

    @GetMapping
    public ResponseEntity<List<MesaDTO>> listar() {
        return ResponseEntity.ok(mesaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MesaDTO> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(mesaService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<MesaDTO> crear(@RequestBody MesaDTO dto) {
        return ResponseEntity.ok(mesaService.guardar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MesaDTO> actualizar(@PathVariable Integer id, @RequestBody MesaDTO dto) {
        dto.setIdMesas(id);
        return ResponseEntity.ok(mesaService.guardar(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        mesaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}