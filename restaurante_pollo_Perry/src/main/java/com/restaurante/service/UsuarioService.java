package com.restaurante.service;

import com.restaurante.dto.UsuarioDTO;
import com.restaurante.entity.Usuario;
import com.restaurante.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<UsuarioDTO> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public UsuarioDTO obtenerPorId(Integer id) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        if (usuario == null) return new UsuarioDTO();
        return convertirADTO(usuario);
    }

    public UsuarioDTO guardar(UsuarioDTO dto) {
        try {
            Usuario usuario = new Usuario();
            if (dto.getIdUsuario() != null) {
                usuario = usuarioRepository.findById(dto.getIdUsuario()).orElse(new Usuario());
            }

            usuario.setNombre(dto.getNombre() != null ? dto.getNombre() : "Usuario Nuevo");
            usuario.setUsuario(dto.getUsuario() != null ? dto.getUsuario() : "user_" + System.currentTimeMillis());

            String pass = dto.getContrasena() != null ? dto.getContrasena() : dto.getClave();
            usuario.setContrasena(pass != null && !pass.isEmpty() ? pass : "123456");

            usuario.setCorreo(dto.getCorreo() != null ? dto.getCorreo() : "correo@ejemplo.com");
            usuario.setRol(dto.getRol() != null && !dto.getRol().isEmpty() ? dto.getRol() : "Mesero");
            usuario.setEstado(dto.getEstado() != null && !dto.getEstado().isEmpty() ? dto.getEstado() : "Activo");

            Usuario guardado = usuarioRepository.save(usuario);
            return convertirADTO(guardado);
        } catch (Exception e) {
            System.err.println("======== ERROR REAL DE MYSQL ========");
            e.printStackTrace();
            System.err.println("=====================================");
            throw e;
        }
    }

    public void eliminar(Integer id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
        }
    }

    private UsuarioDTO convertirADTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setNombre(usuario.getNombre());
        dto.setUsuario(usuario.getUsuario());
        dto.setContrasena(usuario.getContrasena());
        dto.setClave(usuario.getContrasena());
        dto.setCorreo(usuario.getCorreo());
        dto.setRol(usuario.getRol());
        dto.setEstado(usuario.getEstado());
        return dto;
    }
}