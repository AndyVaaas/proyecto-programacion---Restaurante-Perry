import React, { useEffect, useState } from 'react';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../services/productosService';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [idEditando, setIdEditando] = useState(null);

  const cargarProductos = async () => {
    try {
      const res = await getProductos();
      setProductos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error al cargar productos:', err);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !precio) return;

    const payload = { nombre, precio: parseFloat(precio) };

    try {
      if (idEditando) {
        await updateProducto(idEditando, payload);
        setIdEditando(null);
      } else {
        await createProducto(payload);
      }
      setNombre('');
      setPrecio('');
      cargarProductos();
    } catch (err) {
      console.error('Error al guardar producto:', err);
    }
  };

  const handleEdit = (prod) => {
    setIdEditando(prod.idProducto);
    setNombre(prod.nombre);
    setPrecio(prod.precio);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Desea eliminar este producto?')) {
      try {
        await deleteProducto(id);
        cargarProductos();
      } catch (err) {
        console.error('Error al eliminar producto:', err);
      }
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#261610', padding: '30px', borderRadius: '10px', width: '100%', maxWidth: '800px', border: '1px solid #3a2219' }}>
        <h1 style={{ textAlign: 'center', color: '#ff5722', marginBottom: '20px' }}>GESTIÓN DE PRODUCTOS</h1>
        <hr style={{ borderColor: '#ff5722', marginBottom: '25px' }} />

        <form onSubmit={handleSubmit} style={{ backgroundColor: '#1a0e0a', padding: '20px', borderRadius: '8px', border: '1px solid #3a2219', marginBottom: '30px', display: 'flex', gap: '15px' }}>
          <input
            type="text"
            placeholder="Nombre del Producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{ flex: 2, padding: '10px', backgroundColor: '#261610', border: '1px solid #3a2219', color: '#fff', borderRadius: '4px' }}
            required
          />
          <input
            type="number"
            step="0.01"
            placeholder="Precio (Q)"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            style={{ flex: 1, padding: '10px', backgroundColor: '#261610', border: '1px solid #3a2219', color: '#fff', borderRadius: '4px' }}
            required
          />
          <button
            type="submit"
            style={{ backgroundColor: idEditando ? '#2e7d32' : '#ff5722', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {idEditando ? 'Actualizar' : 'Agregar'}
          </button>
        </form>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', color: '#fff' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ff5722', color: '#ff5722' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '20px', color: '#aaa' }}>No hay productos registrados.</td>
              </tr>
            ) : (
              productos.map((p) => (
                <tr key={p.idProducto} style={{ borderBottom: '1px solid #3a2219' }}>
                  <td style={{ padding: '12px' }}>#{p.idProducto}</td>
                  <td>{p.nombre}</td>
                  <td style={{ fontWeight: 'bold' }}>Q{Number(p.precio || 0).toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleEdit(p)} style={{ backgroundColor: '#1976d2', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', marginRight: '8px', cursor: 'pointer' }}>
                      Editar
                    </button>
                    <button onClick={() => handleDelete(p.idProducto)} style={{ backgroundColor: '#c62828', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Productos;