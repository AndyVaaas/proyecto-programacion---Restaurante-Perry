import React, { useEffect, useState } from 'react';
import { getProductos, createProducto } from '../services/productosServices';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');

  const cargarProductos = async () => {
    try {
      const res = await getProductos();
      setProductos(res.data);
    } catch (err) {
      console.error('Error al obtener productos:', err);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProducto({
        nombre,
        precio: parseFloat(precio),
        categoria,
        estado: true,
      });
      setNombre('');
      setPrecio('');
      setCategoria('');
      cargarProductos();
    } catch (err) {
      console.error('Error al guardar el producto:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestión de Productos</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Nombre del Producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        />
        <button type="submit">Guardar Producto</button>
      </form>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.idProducto}>
              <td>{p.idProducto}</td>
              <td>{p.nombre}</td>
              <td>Q{p.precio?.toFixed(2)}</td>
              <td>{p.categoria}</td>
              <td>{p.estado ? 'Disponible' : 'Agotado'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Productos;