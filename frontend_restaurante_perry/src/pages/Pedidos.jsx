import React, { useEffect, useState } from 'react';
import { getPedidos, createPedido, updatePedido } from '../services/pedidoService';
import { getMesas } from '../services/mesasService';
import { getUsuarios } from '../services/usuarioService';
import { getProductos } from '../services/productosService';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);

  const [idMesa, setIdMesa] = useState('');
  const [idUsuario, setIdUsuario] = useState('');
  const [estadoPedido, setEstadoPedido] = useState('Pendiente');
  
  const [idProductoSel, setIdProductoSel] = useState('');
  const [cantidadSel, setCantidadSel] = useState(1);
  const [detallesCarrito, setDetallesCarrito] = useState([]);

  const cargarDatos = async () => {
    try {
      const [resPed, resMesa, resUser, resProd] = await Promise.allSettled([
        getPedidos(),
        getMesas(),
        getUsuarios(),
        getProductos()
      ]);

      const listaPed = resPed.status === 'fulfilled' && resPed.value?.data ? resPed.value.data : [];
      const listaMesa = resMesa.status === 'fulfilled' && resMesa.value?.data ? resMesa.value.data : [];
      const listaUser = resUser.status === 'fulfilled' && resUser.value?.data ? resUser.value.data : [];
      const listaProd = resProd.status === 'fulfilled' && resProd.value?.data ? resProd.value.data : [];

      setPedidos(Array.isArray(listaPed) ? listaPed : []);
      setMesas(Array.isArray(listaMesa) ? listaMesa : []);
      setUsuarios(Array.isArray(listaUser) ? listaUser : []);
      setProductos(Array.isArray(listaProd) ? listaProd : []);

      if (listaMesa.length > 0 && listaMesa[0].idMesa) {
        setIdMesa(String(listaMesa[0].idMesa));
      }
      if (listaUser.length > 0 && listaUser[0].idUsuario) {
        setIdUsuario(String(listaUser[0].idUsuario));
      }
      if (listaProd.length > 0 && listaProd[0].idProducto) {
        setIdProductoSel(String(listaProd[0].idProducto));
      }

    } catch (err) {
      console.error('Error al cargar datos:', err);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const agregarProductoAlCarrito = () => {
    if (!idProductoSel) return;
    const prodObj = productos.find(p => Number(p.idProducto) === Number(idProductoSel));
    if (!prodObj) return;

    const precio = Number(prodObj.precio) || 0;
    const cant = Number(cantidadSel) || 1;
    const subtotal = precio * cant;

    const existeIndex = detallesCarrito.findIndex(d => Number(d.idProducto) === Number(prodObj.idProducto));
    if (existeIndex >= 0) {
      const copia = [...detallesCarrito];
      copia[existeIndex].cantidad += cant;
      copia[existeIndex].subtotal = copia[existeIndex].cantidad * precio;
      setDetallesCarrito(copia);
    } else {
      setDetallesCarrito([
        ...detallesCarrito,
        {
          idProducto: Number(prodObj.idProducto),
          productoNombre: prodObj.nombre,
          precioUnitario: precio,
          cantidad: cant,
          subtotal: subtotal
        }
      ]);
    }
    setCantidadSel(1);
  };

  const eliminarDetalle = (index) => {
    setDetallesCarrito(detallesCarrito.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return detallesCarrito.reduce((acc, curr) => acc + (curr.subtotal || 0), 0);
  };

  const handleSubmitPedido = async (e) => {
    e.preventDefault();
    if (detallesCarrito.length === 0) {
      alert('Debe agregar al menos un producto al pedido');
      return;
    }

    if (!idMesa || isNaN(Number(idMesa))) {
      alert('Seleccione una mesa válida');
      return;
    }

    const payload = {
      idMesa: Number(idMesa),
      idUsuario: Number(idUsuario),
      estado: estadoPedido,
      total: calcularTotal(),
      detalles: detallesCarrito
    };

    try {
      await createPedido(payload);
      alert('Pedido creado correctamente');
      setDetallesCarrito([]);
      cargarDatos();
    } catch (err) {
      console.error('Error al guardar el pedido:', err);
      alert('Error en el servidor al procesar la solicitud');
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#261610', padding: '30px', borderRadius: '10px', width: '100%', maxWidth: '1100px' }}>
        <h1 style={{ textAlign: 'center', color: '#ff5722' }}>GESTIÓN Y TOMA DE PEDIDOS</h1>
        
        <div style={{ backgroundColor: '#1a0e0a', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <h3 style={{ color: '#ff5722' }}>Crear Nuevo Pedido</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ color: '#fff', display: 'block' }}>Mesa:</label>
              <select
                value={idMesa}
                onChange={(e) => setIdMesa(e.target.value)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#261610', color: '#fff' }}
              >
                {mesas.map((m) => (
                  <option key={m.idMesa} value={m.idMesa}>
                    Mesa #{m.numeroMesa || m.idMesa}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ color: '#fff', display: 'block' }}>Atendido por (Mesero):</label>
              <select
                value={idUsuario}
                onChange={(e) => setIdUsuario(e.target.value)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#261610', color: '#fff' }}
              >
                {usuarios.map((u) => (
                  <option key={u.idUsuario} value={u.idUsuario}>
                    {u.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ color: '#fff', display: 'block' }}>Estado Inicial:</label>
              <select
                value={estadoPedido}
                onChange={(e) => setEstadoPedido(e.target.value)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#261610', color: '#fff' }}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Atendido">Atendido</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <select
              value={idProductoSel}
              onChange={(e) => setIdProductoSel(e.target.value)}
              style={{ flex: 2, padding: '10px', backgroundColor: '#261610', color: '#fff' }}
            >
              {productos.map((p) => (
                <option key={p.idProducto} value={p.idProducto}>
                  {p.nombre} - Q{Number(p.precio || 0).toFixed(2)}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={cantidadSel}
              onChange={(e) => setCantidadSel(e.target.value)}
              style={{ width: '80px', padding: '10px', backgroundColor: '#261610', color: '#fff' }}
            />

            <button
              type="button"
              onClick={agregarProductoAlCarrito}
              style={{ backgroundColor: '#ff5722', color: '#fff', border: 'none', padding: '10px 15px', fontWeight: 'bold' }}
            >
              + Agregar
            </button>
          </div>

          {detallesCarrito.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <table style={{ width: '100%', color: '#fff' }}>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cant.</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {detallesCarrito.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.productoNombre}</td>
                      <td>{item.cantidad}</td>
                      <td>Q{Number(item.precioUnitario).toFixed(2)}</td>
                      <td>Q{Number(item.subtotal).toFixed(2)}</td>
                      <td>
                        <button type="button" onClick={() => eliminarDetalle(idx)} style={{ backgroundColor: '#c62828', color: '#fff' }}>
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ textAlign: 'right', marginTop: '10px', color: '#ff5722', fontWeight: 'bold' }}>
                Total Pedido: Q{calcularTotal().toFixed(2)}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmitPedido}
            style={{ width: '100%', backgroundColor: '#2e7d32', color: '#fff', padding: '12px', border: 'none', fontWeight: 'bold' }}
          >
            Registrar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pedidos;
