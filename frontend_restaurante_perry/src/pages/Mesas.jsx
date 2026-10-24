import React, { useEffect, useState } from 'react';
import { getMesas, createMesa, updateMesa, deleteMesa } from '../services/mesasService';
import { getUsuarios } from '../services/usuarioService';

const Mesas = () => {
  const [mesas, setMesas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Formulario superior: Únicamente Número y Capacidad
  const [numeroMesa, setNumeroMesa] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [idEditando, setIdEditando] = useState(null);

  const cargarDatos = async () => {
    try {
      const [resMesas, resUsers] = await Promise.allSettled([
        getMesas(),
        getUsuarios()
      ]);

      const listaMesas = resMesas.status === 'fulfilled' ? (resMesas.value?.data || resMesas.value || []) : [];
      const listaUsers = resUsers.status === 'fulfilled' ? (resUsers.value?.data || resUsers.value || []) : [];

      setMesas(Array.isArray(listaMesas) ? listaMesas : []);
      setUsuarios(Array.isArray(listaUsers) ? listaUsers : []);
    } catch (err) {
      console.error('Error al cargar mesas y usuarios:', err);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!numeroMesa || !capacidad) {
      alert('Por favor ingrese el Número de Mesa y la Capacidad');
      return;
    }

    if (idEditando) {
      const mesaExistente = mesas.find(m => m.idMesa === idEditando);
      const payload = {
        idMesa: idEditando,
        numeroMesa: parseInt(numeroMesa),
        capacidad: parseInt(capacidad),
        estado: mesaExistente ? (mesaExistente.estado === true || mesaExistente.estado === 'Disponible' || mesaExistente.estado === 'true') : true,
        idUsuario: mesaExistente?.idUsuario || null
      };
      try {
        await updateMesa(idEditando, payload);
        setIdEditando(null);
      } catch (err) {
        console.error('Error al actualizar mesa:', err);
      }
    } else {
      const payload = {
        numeroMesa: parseInt(numeroMesa),
        capacidad: parseInt(capacidad),
        estado: true,
        idUsuario: null
      };
      try {
        await createMesa(payload);
      } catch (err) {
        console.error('Error al crear mesa:', err);
      }
    }

    setNumeroMesa('');
    setCapacidad('');
    cargarDatos();
  };

  const handleEdit = (m) => {
    setIdEditando(m.idMesa);
    setNumeroMesa(m.numeroMesa || '');
    setCapacidad(m.capacidad || '');
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Desea eliminar esta mesa?')) {
      try {
        await deleteMesa(id);
        cargarDatos();
      } catch (err) {
        console.error('Error al eliminar mesa:', err);
      }
    }
  };

  // Cambio dinámico de Estado directo desde la fila
  const handleCambiarEstadoMesa = async (m, nuevoEstadoStr) => {
    try {
      const payload = {
        idMesa: m.idMesa,
        numeroMesa: m.numeroMesa,
        capacidad: m.capacidad,
        estado: nuevoEstadoStr === 'Disponible',
        idUsuario: m.idUsuario ? parseInt(m.idUsuario) : null
      };
      await updateMesa(m.idMesa, payload);
      cargarDatos();
    } catch (err) {
      console.error('Error al actualizar estado de la mesa:', err);
    }
  };

  // Cambio dinámico de Mesero directo desde la fila
  const handleCambiarMeseroMesa = async (m, nuevoIdUsuario) => {
    try {
      const idUserInt = nuevoIdUsuario ? parseInt(nuevoIdUsuario) : null;
      const estadoBool = m.estado === true || m.estado === 'Disponible' || m.estado === 'true';

      const payload = {
        idMesa: m.idMesa,
        numeroMesa: m.numeroMesa,
        capacidad: m.capacidad,
        estado: estadoBool,
        idUsuario: idUserInt
      };

      await updateMesa(m.idMesa, payload);
      cargarDatos();
    } catch (err) {
      console.error('Error al actualizar mesero de la mesa:', err);
    }
  };

  const esDisponible = (val) => {
    return val === true || val === 'true' || val === 'Disponible';
  };

  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#261610', padding: '30px', borderRadius: '10px', width: '100%', maxWidth: '900px', border: '1px solid #3a2219' }}>
        <h1 style={{ textAlign: 'center', color: '#ff5722', marginBottom: '20px' }}>GESTIÓN DE MESAS</h1>
        <hr style={{ borderColor: '#ff5722', marginBottom: '25px' }} />

        {/* Formulario solo para Número y Capacidad */}
        <form onSubmit={handleSubmit} style={{ backgroundColor: '#1a0e0a', padding: '20px', borderRadius: '8px', border: '1px solid #3a2219', marginBottom: '30px', display: 'flex', gap: '15px' }}>
          <input
            id="numeroMesa"
            name="numeroMesa"
            type="number"
            placeholder="Número de Mesa"
            value={numeroMesa}
            onChange={(e) => setNumeroMesa(e.target.value)}
            style={{ flex: 1, padding: '10px', backgroundColor: '#261610', border: '1px solid #3a2219', color: '#fff', borderRadius: '4px' }}
            required
          />
          <input
            id="capacidad"
            name="capacidad"
            type="number"
            placeholder="Capacidad"
            value={capacidad}
            onChange={(e) => setCapacidad(e.target.value)}
            style={{ flex: 1, padding: '10px', backgroundColor: '#261610', border: '1px solid #3a2219', color: '#fff', borderRadius: '4px' }}
            required
          />
          <button
            type="submit"
            style={{ backgroundColor: idEditando ? '#2e7d32' : '#ff5722', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {idEditando ? 'Actualizar Mesa' : 'Guardar Mesa'}
          </button>
        </form>

        {/* Tabla con selectores interactivos directos */}
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', color: '#fff' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ff5722', color: '#ff5722' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th>Número</th>
              <th>Capacidad</th>
              <th>Estado</th>
              <th>Encargado / Mesero</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mesas.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '20px', color: '#aaa' }}>No hay mesas registradas.</td>
              </tr>
            ) : (
              mesas.map((m) => {
                const disponible = esDisponible(m.estado);
                return (
                  <tr key={m.idMesa} style={{ borderBottom: '1px solid #3a2219' }}>
                    <td style={{ padding: '12px' }}>{m.idMesa}</td>
                    <td>Mesa #{m.numeroMesa || m.idMesa}</td>
                    <td>{m.capacidad} personas</td>
                    
                    {/* Selector interactivo de Estado */}
                    <td>
                      <select
                        value={disponible ? 'Disponible' : 'Ocupado'}
                        onChange={(e) => handleCambiarEstadoMesa(m, e.target.value)}
                        style={{
                          backgroundColor: disponible ? '#2e7d32' : '#c62828',
                          color: '#fff',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Disponible">Disponible</option>
                        <option value="Ocupado">Ocupado</option>
                      </select>
                    </td>

                    {/* Selector interactivo de Mesero */}
                    <td>
                      <select
                        value={m.idUsuario || ''}
                        onChange={(e) => handleCambiarMeseroMesa(m, e.target.value)}
                        style={{ backgroundColor: '#261610', color: '#fff', border: '1px solid #3a2219', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        <option value="">Sin Asignar</option>
                        {usuarios.map((u) => (
                          <option key={u.idUsuario} value={u.idUsuario}>
                            {u.nombre}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <button onClick={() => handleEdit(m)} style={{ backgroundColor: '#1976d2', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', marginRight: '8px', cursor: 'pointer' }}>
                        Editar
                      </button>
                      <button onClick={() => handleDelete(m.idMesa)} style={{ backgroundColor: '#c62828', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Mesas;