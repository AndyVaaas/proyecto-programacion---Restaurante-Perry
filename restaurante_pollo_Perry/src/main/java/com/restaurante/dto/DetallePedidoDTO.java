package com.restaurante.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DetallePedidoDTO {
    private Integer idDetallePedido;
    private Integer idProducto;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
}