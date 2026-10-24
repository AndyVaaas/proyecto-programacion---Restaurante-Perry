package com.restaurante.service;

import com.restaurante.dto.MesaDTO;
import com.restaurante.entity.Mesa;
import com.restaurante.entity.Usuario;
import com.restaurante.repository.MesaRepository;
import com.restaurante.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MesaService {

    private final MesaRepository mesaRepository;
    private final UsuarioRepository usuarioRepository;

    public MesaService(MesaRepository mesaRepository, UsuarioRepository usuarioRepository) {
        this.mesaRepository = mesaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<MesaDTO> listarTodas() {
        return mesaRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public MesaDTO obtenerPorId(Integer id) {
        Mesa mesa = mesaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mesa no encontrada: " + id));
        return convertirADTO(mesa);
    }

    public MesaDTO guardar(MesaDTO dto) {
        Mesa mesa;
        if (dto.getIdMesa() != null) {
            mesa = mesaRepository.findById(dto.getIdMesa()).orElse(new Mesa());
        } else {
            mesa = new Mesa();
        }

        mesa.setNumeroMesa(dto.getNumeroMesa());
        mesa.setCapacidad(dto.getCapacidad());

        if (dto.getEstado() != null && !dto.getEstado().toString().isEmpty()) {
            mesa.setEstado(dto.getEstado().toString());
        } else {
            mesa.setEstado("Disponible");
        }

        if (dto.getIdUsuario() != null) {
            Usuario user = usuarioRepository.findById(dto.getIdUsuario()).orElse(null);
            mesa.setUsuario(user);
        } else {
            mesa.setUsuario(null);
        }

        Mesa guardada = mesaRepository.save(mesa);
        return convertirADTO(guardada);
    }

    public void eliminar(Integer id) {
        mesaRepository.deleteById(id);
    }

    private MesaDTO convertirADTO(Mesa mesa) {
        MesaDTO dto = new MesaDTO();
        dto.setIdMesa(mesa.getIdMesa());
        dto.setNumeroMesa(mesa.getNumeroMesa());
        dto.setCapacidad(mesa.getCapacidad());

        if (mesa.getEstado() != null) {
            dto.setEstado(mesa.getEstado());
        } else {
            dto.setEstado("Disponible");
        }

        if (mesa.getUsuario() != null) {
            dto.setIdUsuario(mesa.getUsuario().getIdUsuario());
            dto.setUsuarioNombre(mesa.getUsuario().getNombre());
        }

        return dto;
    }
}