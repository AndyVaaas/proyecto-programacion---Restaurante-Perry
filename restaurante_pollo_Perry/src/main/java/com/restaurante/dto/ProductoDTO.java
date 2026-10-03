package com.restaurante.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductoDTO {
    private Integer idProducto;
    private String nombre;
    private String categoria;
    private BigDecimal precio;
    private Boolean estado;
}