package com.restaurante.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class UsuarioDTO {

    private Integer idUsuario;

    @JsonAlias({"nombre", "nombreCompleto", "nombre_completo"})
    private String nombre;

    @JsonAlias({"usuario", "username", "nombreUsuario"})
    private String usuario;

    @JsonAlias({"clave", "contrasena", "password", "claveUsuario"})
    private String contrasena;

    @JsonAlias({"correo", "email", "correoElectronico"})
    private String correo;

    private String rol;
    private String estado;

    public UsuarioDTO() {}

    public Integer getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Integer idUsuario) { this.idUsuario = idUsuario; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }

    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }

    public String getClave() { return contrasena; }
    public void setClave(String clave) { this.contrasena = clave; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}