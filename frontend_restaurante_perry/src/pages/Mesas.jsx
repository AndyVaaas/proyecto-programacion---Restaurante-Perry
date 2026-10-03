import React, { useEffect, useState } from 'react';
import { getMesas, createMesa, updateMesa, deleteMesa } from '../services/mesasServices';

const Mesas = () => {
  const [mesas, setMesas] = useState([]);
  const [numero, setNumero] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  const cargarMesas = async () => {
    try {
      const res = await getMesas();
      setMesas(res.data);
    } catch (err) {
      console.error('Error al obtener mesas:', err);
    }
  };

  useEffect(() => {
    cargarMesas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await updateMesa(editandoId, {
          numero: parseInt(numero),
          capacidad: parseInt(capacidad),
          estado: true,
        });
        setEditandoId(null);
      } else {
        await createMesa({
          numero: parseInt(numero),
          capacidad: parseInt(capacidad),
          estado: true,
        });
      }
      setNumero('');
      setCapacidad('');
      cargarMesas();
    } catch (err) {
      console.error('Error al guardar la mesa:', err);
    }
  };

  const handleEdit = (m) => {
    setEditandoId(m.idMesas);
    setNumero(m.numero);
    setCapacidad(m.capacidad);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta mesa?')) {
      try {
        await deleteMesa(id);
        cargarMesas();
      } catch (err) {
        console.error('Error al eliminar mesa:', err);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditandoId(null);
    setNumero('');
    setCapacidad('');
  };

  return (
    <div>
      <h1>Gestión de Mesas</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Número de Mesa"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Capacidad"
          value={capacidad}
          onChange={(e) => setCapacidad(e.target.value)}
          required
        />
        <button type="submit">
          {editandoId ? 'Actualizar Mesa' : 'Guardar Mesa'}
        </button>
        {editandoId && (
          <button type="button" onClick={handleCancelEdit} style={{ backgroundColor: '#6c757d' }}>
            Cancelar
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Número</th>
            <th>Capacidad</th>
            <th>Estado</th>
            {}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mesas.map((m) => (
            <tr key={m.idMesas}>
              <td>{m.idMesas}</td>
              <td>Mesa #{m.numero}</td>
              <td>{m.capacidad} personas</td>
              <td>{m.estado ? 'Disponible' : 'Ocupada'}</td>
              {}
              <td>
                <button className="btn-edit" onClick={() => handleEdit(m)}>
                   Editar
                </button>
                <button className="btn-delete" onClick={() => handleDelete(m.idMesas)}>
                   Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Mesas;