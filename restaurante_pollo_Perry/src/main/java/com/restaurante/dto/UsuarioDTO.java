package com.restaurante.dto;

import lombok.Data;

@Data
public class UsuarioDTO {
    private Integer idUsuario;
    private String nombre;
    private String usuario;
    private String contrasena;
    private String correo;
    private Integer idPerfil;
    private Boolean estado;
}