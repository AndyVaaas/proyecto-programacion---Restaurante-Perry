import api from '../api/axios';

export const getMesas = () => api.get('/mesas');
export const createMesa = (mesa) => api.post('/mesas', mesa);
export const updateMesa = (id, mesa) => api.put(`/mesas/${id}`, mesa);
export const deleteMesa = (id) => api.delete(`/mesas/${id}`);