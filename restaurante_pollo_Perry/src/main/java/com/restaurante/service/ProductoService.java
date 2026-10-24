package com.restaurante.service;

import com.restaurante.dto.ProductoDTO;
import com.restaurante.entity.Producto;
import com.restaurante.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public List<ProductoDTO> listarTodos() {
        return productoRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public ProductoDTO obtenerPorId(Integer id) {
        Producto producto = productoRepository.findById(id).orElse(null);
        if (producto == null) return new ProductoDTO();
        return convertirADTO(producto);
    }

    public ProductoDTO guardar(ProductoDTO dto) {
        Producto producto = new Producto();
        if (dto.getIdProducto() != null) {
            producto = productoRepository.findById(dto.getIdProducto()).orElse(new Producto());
        }
        producto.setNombre(dto.getNombre());
        producto.setPrecio(dto.getPrecio());

        Producto guardado = productoRepository.save(producto);
        return convertirADTO(guardado);
    }

    public void eliminar(Integer id) {
        if (productoRepository.existsById(id)) {
            productoRepository.deleteById(id);
        }
    }

    private ProductoDTO convertirADTO(Producto producto) {
        ProductoDTO dto = new ProductoDTO();
        dto.setIdProducto(producto.getIdProducto());
        dto.setNombre(producto.getNombre());
        dto.setPrecio(producto.getPrecio());
        return dto;
    }
}