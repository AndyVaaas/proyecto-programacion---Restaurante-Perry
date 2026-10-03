package com.restaurante.dto;

import lombok.Data;

@Data
public class MesaDTO {
    private Integer idMesas;
    private Integer numero;
    private Integer capacidad;
    private Boolean estado;
}