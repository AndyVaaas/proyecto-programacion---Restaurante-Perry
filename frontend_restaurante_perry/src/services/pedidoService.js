import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/api/pedidos`;

export const getPedidos = () => axios.get(API_URL);

export const createPedido = (pedidoData) => {
  return axios.post(API_URL, {
    idMesa: Number(pedidoData.idMesa),
    idUsuario: Number(pedidoData.idUsuario),
    estado: pedidoData.estado || 'Pendiente',
    total: Number(pedidoData.total) || 0,
    detalles: (pedidoData.detalles || []).map((det) => ({
      idProducto: Number(det.idProducto),
      cantidad: Number(det.cantidad),
      precioUnitario: Number(det.precioUnitario),
      subtotal: Number(det.subtotal)
    }))
  });
};

export const updatePedido = (id, pedidoData) => axios.put(`${API_URL}/${id}`, pedidoData);