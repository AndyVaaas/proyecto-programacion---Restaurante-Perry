package com.restaurante.service;

import com.restaurante.dto.MesaDTO;
import com.restaurante.entity.Mesa;
import com.restaurante.repository.MesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MesaService {

    @Autowired
    private MesaRepository mesaRepository;

    public List<MesaDTO> listarTodas() {
        return mesaRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public MesaDTO obtenerPorId(Integer id) {
        Mesa mesa = mesaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mesa no encontrada con ID: " + id));
        return convertirADTO(mesa);
    }

    public MesaDTO guardar(MesaDTO dto) {
        Mesa mesa = convertirAEntidad(dto);
        Mesa guardada = mesaRepository.save(mesa);
        return convertirADTO(guardada);
    }

    public void eliminar(Integer id) {
        mesaRepository.deleteById(id);
    }

  private MesaDTO convertirADTO(Mesa mesa) {
    MesaDTO dto = new MesaDTO();
    dto.setIdMesas(mesa.getIdMesas());
    dto.setNumero(mesa.getNumero());
    dto.setCapacidad(mesa.getCapacidad());
    dto.setEstado(mesa.getEstado());
    return dto;
}

private Mesa convertirAEntidad(MesaDTO dto) {
    Mesa mesa = new Mesa();
    mesa.setIdMesas(dto.getIdMesas());
    mesa.setNumero(dto.getNumero());
    mesa.setCapacidad(dto.getCapacidad());
    mesa.setEstado(dto.getEstado());
    return mesa;
}
}