package com.restaurante.controller;

import com.restaurante.dto.MesaDTO;
import com.restaurante.service.MesaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mesas")
@CrossOrigin(origins = "*")
public class MesaController {

    @Autowired
    private MesaService mesaService;

    @GetMapping
    public ResponseEntity<List<MesaDTO>> listar() {
        return ResponseEntity.ok(mesaService.listarTodas());
    }

    @PostMapping
    public ResponseEntity<MesaDTO> crear(@RequestBody MesaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(mesaService.guardar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MesaDTO> actualizar(@PathVariable Integer id, @RequestBody MesaDTO dto) {
        dto.setIdMesa(id);
        return ResponseEntity.ok(mesaService.guardar(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        mesaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}