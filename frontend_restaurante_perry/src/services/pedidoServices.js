import api from '../api/axios';

export const getPedidos = () => api.get('/pedidos');
export const createPedido = (pedido) => api.post('/pedidos', pedido);
export const getPedidoById = (id) => api.get(`/pedidos/${id}`);