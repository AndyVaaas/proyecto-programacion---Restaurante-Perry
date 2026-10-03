package com.restaurante.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class PedidoDTO {
    private Integer idPedido;
    private Integer idMesa;
    private Integer idUsuario;
    private String estadoPedido;
    private BigDecimal total;
    private Boolean estado;
    private List<DetallePedidoDTO> detalles;
}