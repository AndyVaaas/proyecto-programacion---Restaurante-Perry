import React, { useEffect, useState } from 'react';
import { getPedidos } from '../services/pedidoServices';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  const cargarPedidos = async () => {
    try {
      const res = await getPedidos();
      setPedidos(res.data);
    } catch (err) {
      console.error('Error al obtener pedidos:', err);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Historial de Pedidos</h1>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Mesa</th>
            <th>Usuario</th>
            <th>Estado</th>
            <th>Total</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.idPedido}>
              <td>#{p.idPedido}</td>
              <td>Mesa #{p.idMesa}</td>
              <td>ID Usuario #{p.idUsuario}</td>
              <td>{p.estadoPedido}</td>
              <td>Q{p.total?.toFixed(2)}</td>
              <td>
                <ul>
                  {p.detalles?.map((d, index) => (
                    <li key={index}>
                      Producto ID #{d.idProducto} - Cantidad: {d.cantidad} - Subtotal: Q{d.subtotal?.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Pedidos;