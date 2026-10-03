package com.restaurante.service;

import com.restaurante.dto.DetallePedidoDTO;
import com.restaurante.dto.PedidoDTO;
import com.restaurante.entity.*;
import com.restaurante.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    @Autowired
    private MesaRepository mesaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<PedidoDTO> listarTodos() {
        return pedidoRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public PedidoDTO obtenerPorId(Integer id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con ID: " + id));
        return convertirADTO(pedido);
    }

    @Transactional
    public PedidoDTO guardar(PedidoDTO dto) {
        Pedido pedido = convertirAEntidad(dto);
        Pedido pedidoGuardado = pedidoRepository.save(pedido);

        if (dto.getDetalles() != null && !dto.getDetalles().isEmpty()) {
            List<DetallePedido> detallesGuardados = new ArrayList<>();
            for (DetallePedidoDTO ddto : dto.getDetalles()) {
                DetallePedido detalle = new DetallePedido();
                detalle.setIdDetallePedido(ddto.getIdDetallePedido());

                if (ddto.getIdProducto() != null) {
                    Producto producto = productoRepository.findById(ddto.getIdProducto())
                            .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + ddto.getIdProducto()));
                    detalle.setProducto(producto);
                }

                detalle.setCantidad(ddto.getCantidad());
                detalle.setPrecioUnitario(ddto.getPrecioUnitario());
                detalle.setSubtotal(ddto.getSubtotal());
                detalle.setPedido(pedidoGuardado);

                detallesGuardados.add(detallePedidoRepository.save(detalle));
            }
        }

        return convertirADTO(pedidoGuardado);
    }

    private PedidoDTO convertirADTO(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setIdPedido(pedido.getIdPedido());

        if (pedido.getMesa() != null) {
            dto.setIdMesa(pedido.getMesa().getIdMesas());
        }

        if (pedido.getUsuario() != null) {
            dto.setIdUsuario(pedido.getUsuario().getIdUsuario());
        }

        dto.setEstadoPedido(pedido.getEstadoPedido());
        dto.setTotal(pedido.getTotal());
        dto.setEstado(pedido.getEstado());

        List<DetallePedido> detalles = detallePedidoRepository.findByPedidoIdPedido(pedido.getIdPedido());
        if (detalles != null && !detalles.isEmpty()) {
            List<DetallePedidoDTO> detallesDTO = detalles.stream().map(d -> {
                DetallePedidoDTO ddto = new DetallePedidoDTO();
                ddto.setIdDetallePedido(d.getIdDetallePedido());
                if (d.getProducto() != null) {
                    ddto.setIdProducto(d.getProducto().getIdProducto());
                }
                ddto.setCantidad(d.getCantidad());
                ddto.setPrecioUnitario(d.getPrecioUnitario());
                ddto.setSubtotal(d.getSubtotal());
                return ddto;
            }).collect(Collectors.toList());

            dto.setDetalles(detallesDTO);
        }

        return dto;
    }

    private Pedido convertirAEntidad(PedidoDTO dto) {
        Pedido pedido = new Pedido();
        pedido.setIdPedido(dto.getIdPedido());

        if (dto.getIdMesa() != null) {
            Mesa mesa = mesaRepository.findById(dto.getIdMesa())
                    .orElseThrow(() -> new RuntimeException("Mesa no encontrada con ID: " + dto.getIdMesa()));
            pedido.setMesa(mesa);
        }

        if (dto.getIdUsuario() != null) {
            Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + dto.getIdUsuario()));
            pedido.setUsuario(usuario);
        }

        if (dto.getEstadoPedido() != null) {
            pedido.setEstadoPedido(dto.getEstadoPedido());
        }

        pedido.setTotal(dto.getTotal());

        if (dto.getEstado() != null) {
            pedido.setEstado(dto.getEstado());
        }

        return pedido;
    }
}