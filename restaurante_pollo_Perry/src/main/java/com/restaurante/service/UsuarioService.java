package com.restaurante.service;

import com.restaurante.dto.UsuarioDTO;
import com.restaurante.entity.Perfil;
import com.restaurante.entity.Usuario;
import com.restaurante.repository.PerfilRepository;
import com.restaurante.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PerfilRepository perfilRepository;

    public List<UsuarioDTO> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public UsuarioDTO obtenerPorId(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
        return convertirADTO(usuario);
    }

    public UsuarioDTO guardar(UsuarioDTO dto) {
        Usuario usuario = convertirAEntidad(dto);
        Usuario guardado = usuarioRepository.save(usuario);
        return convertirADTO(guardado);
    }

    public void eliminar(Integer id) {
        usuarioRepository.deleteById(id);
    }

    private UsuarioDTO convertirADTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setNombre(usuario.getNombre());
        dto.setUsuario(usuario.getUsuario());
        dto.setContrasena(usuario.getContrasena());
        dto.setCorreo(usuario.getCorreo());
        if (usuario.getPerfil() != null) {
            dto.setIdPerfil(usuario.getPerfil().getIdPerfil());
        }
        dto.setEstado(usuario.getEstado());
        return dto;
    }

    private Usuario convertirAEntidad(UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(dto.getIdUsuario());
        usuario.setNombre(dto.getNombre());
        usuario.setUsuario(dto.getUsuario());
        usuario.setContrasena(dto.getContrasena());
        usuario.setCorreo(dto.getCorreo());
        
        if (dto.getIdPerfil() != null) {
            Perfil perfil = perfilRepository.findById(dto.getIdPerfil())
                    .orElseThrow(() -> new RuntimeException("Perfil no encontrado con ID: " + dto.getIdPerfil()));
            usuario.setPerfil(perfil);
        }
        
        usuario.setEstado(dto.getEstado());
        return usuario;
    }
}