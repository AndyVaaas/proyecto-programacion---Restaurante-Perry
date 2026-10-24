package com.restaurante.service;

import com.restaurante.dto.DetallePedidoDTO;
import com.restaurante.dto.PedidoDTO;
import com.restaurante.entity.DetallePedido;
import com.restaurante.entity.Mesa;
import com.restaurante.entity.Pedido;
import com.restaurante.entity.Producto;
import com.restaurante.entity.Usuario;
import com.restaurante.repository.MesaRepository;
import com.restaurante.repository.PedidoRepository;
import com.restaurante.repository.ProductoRepository;
import com.restaurante.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final MesaRepository mesaRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    public PedidoService(PedidoRepository pedidoRepository,
                         MesaRepository mesaRepository,
                         UsuarioRepository usuarioRepository,
                         ProductoRepository productoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.mesaRepository = mesaRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
    }

    public List<PedidoDTO> listarTodos() {
        return pedidoRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public PedidoDTO obtenerPorId(Integer id) {
        // Devuelve null en lugar de lanzar excepción si no existe, evitando el 500
        Pedido pedido = pedidoRepository.findById(id).orElse(null);
        if (pedido == null) {
            return new PedidoDTO();
        }
        return convertirADTO(pedido);
    }

    @Transactional
    public PedidoDTO guardar(PedidoDTO dto) {
        Pedido pedido = new Pedido();
        if (dto.getIdPedido() != null) {
            pedido = pedidoRepository.findById(dto.getIdPedido()).orElse(new Pedido());
        }

        if (dto.getIdMesa() != null) {
            Mesa mesa = mesaRepository.findById(dto.getIdMesa()).orElse(null);
            pedido.setMesa(mesa);
        }

        if (dto.getIdUsuario() != null) {
            Usuario usuario = usuarioRepository.findById(dto.getIdUsuario()).orElse(null);
            pedido.setUsuario(usuario);
        }

        pedido.setEstado(dto.getEstado() != null ? dto.getEstado() : "Pendiente");
        pedido.setTotal(dto.getTotal() != null ? dto.getTotal() : 0.0);

        List<DetallePedido> detalles = new ArrayList<>();
        if (dto.getDetalles() != null) {
            for (DetallePedidoDTO detDto : dto.getDetalles()) {
                DetallePedido detalle = new DetallePedido();
                detalle.setPedido(pedido);
                
                if (detDto.getIdProducto() != null) {
                    Producto producto = productoRepository.findById(detDto.getIdProducto()).orElse(null);
                    detalle.setProducto(producto);
                }
                
                detalle.setCantidad(detDto.getCantidad() != null ? detDto.getCantidad() : 1);
                detalle.setPrecioUnitario(detDto.getPrecioUnitario() != null ? detDto.getPrecioUnitario() : 0.0);
                detalle.setSubtotal(detDto.getSubtotal() != null ? detDto.getSubtotal() : 0.0);
                detalles.add(detalle);
            }
        }

        // Limpiar detalles anteriores si se está actualizando
        if (pedido.getDetalles() != null) {
            pedido.getDetalles().clear();
            pedido.getDetalles().addAll(detalles);
        } else {
            pedido.setDetalles(detalles);
        }

        Pedido guardado = pedidoRepository.save(pedido);
        return convertirADTO(guardado);
    }

    public void eliminar(Integer id) {
        if (pedidoRepository.existsById(id)) {
            pedidoRepository.deleteById(id);
        }
    }

    private PedidoDTO convertirADTO(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setIdPedido(pedido.getIdPedido());
        
        if (pedido.getMesa() != null) {
            dto.setIdMesa(pedido.getMesa().getIdMesa());
        }
        
        if (pedido.getUsuario() != null) {
            dto.setIdUsuario(pedido.getUsuario().getIdUsuario());
        }
        
        dto.setEstado(pedido.getEstado() != null ? pedido.getEstado() : "Pendiente");
        dto.setTotal(pedido.getTotal() != null ? pedido.getTotal() : 0.0);

        List<DetallePedidoDTO> detallesDTO = new ArrayList<>();
        if (pedido.getDetalles() != null) {
            for (DetallePedido d : pedido.getDetalles()) {
                DetallePedidoDTO det = new DetallePedidoDTO();
                det.setIdDetalle(d.getIdDetalle());
                if (d.getProducto() != null) {
                    det.setIdProducto(d.getProducto().getIdProducto());
                }
                det.setCantidad(d.getCantidad());
                det.setPrecioUnitario(d.getPrecioUnitario());
                det.setSubtotal(d.getSubtotal());
                detallesDTO.add(det);
            }
        }
        dto.setDetalles(detallesDTO);

        return dto;
    }
}