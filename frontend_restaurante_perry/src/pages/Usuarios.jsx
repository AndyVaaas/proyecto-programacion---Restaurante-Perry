import React, { useEffect, useState } from 'react';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../services/usuarioService';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [correo, setCorreo] = useState('');
  const [rol, setRol] = useState('Mesero');
  const [editandoId, setEditandoId] = useState(null);

  const cargarUsuarios = async () => {
    try {
      const res = await getUsuarios();
      setUsuarios(res.data);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userActual = usuarios.find((u) => u.idUsuario === editandoId);

    // DTO limpio con valores por defecto si alguno es nulo
    const dtoPayload = {
      idUsuario: editandoId,
      nombre,
      usuario,
      correo,
      rol,
      estado: userActual?.estado ?? true,
      contrasena: contrasena !== '' ? contrasena : userActual?.contrasena
    };

    if (editandoId) {
      // Actualizar visualmente al instante
      setUsuarios((prev) =>
        prev.map((u) => (u.idUsuario === editandoId ? { ...u, ...dtoPayload } : u))
      );

      try {
        await updateUsuario(editandoId, dtoPayload);
      } catch (err) {
        console.error('Error HTTP 500 al actualizar backend:', err);
      }
    } else {
      try {
        await createUsuario({
          ...dtoPayload,
          contrasena,
          estado: true
        });
        cargarUsuarios();
      } catch (err) {
        console.error('Error al crear usuario:', err);
      }
    }

    limpiarFormulario();
  };

  const handleToggleEstado = async (u) => {
    const nuevoEstado = !u.estado;

    setUsuarios((prev) =>
      prev.map((item) => (item.idUsuario === u.idUsuario ? { ...item, estado: nuevoEstado } : item))
    );

    try {
      await updateUsuario(u.idUsuario, {
        ...u,
        estado: nuevoEstado
      });
    } catch (err) {
      console.error('Error al cambiar estado:', err);
    }
  };

  const handleEdit = (u) => {
    setEditandoId(u.idUsuario);
    setNombre(u.nombre || '');
    setUsuario(u.usuario || '');
    setCorreo(u.correo || '');
    setRol(u.rol || 'Mesero');
    setContrasena('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Desea anular/eliminar este usuario?')) {
      try {
        await deleteUsuario(id);
        cargarUsuarios();
      } catch (err) {
        console.error('Error al anular usuario:', err);
      }
    }
  };

  const limpiarFormulario = () => {
    setEditandoId(null);
    setNombre('');
    setUsuario('');
    setContrasena('');
    setCorreo('');
    setRol('Mesero');
  };

  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#261610', padding: '30px', borderRadius: '10px', width: '100%', maxWidth: '1000px', border: '1px solid #3a2219' }}>
        <h1 style={{ textAlign: 'center', color: '#ff5722', marginBottom: '20px' }}>GESTIÓN DE USUARIOS</h1>
        <hr style={{ borderColor: '#ff5722', marginBottom: '25px' }} />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', marginBottom: '30px' }}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ padding: '10px', backgroundColor: '#1a0e0a', border: '1px solid #3a2219', color: '#fff', borderRadius: '4px' }}
          />
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
            style={{ padding: '10px', backgroundColor: '#1a0e0a', border: '1px solid #3a2219', color: '#fff', borderRadius: '4px' }}
          />
          <input
            type="password"
            placeholder={editandoId ? "Nueva contraseña (opcional)" : "Contraseña"}
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required={!editandoId}
            style={{ padding: '10px', backgroundColor: '#1a0e0a', border: '1px solid #3a2219', color: '#fff', borderRadius: '4px' }}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            style={{ padding: '10px', backgroundColor: '#1a0e0a', border: '1px solid #3a2219', color: '#fff', borderRadius: '4px' }}
          />

          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            style={{ padding: '10px', backgroundColor: '#1a0e0a', border: '1px solid #3a2219', color: '#fff', borderRadius: '4px' }}
          >
            <option value="Mesero">Mesero</option>
            <option value="Cajero">Cajero</option>
            <option value="Chef">Chef</option>
            <option value="Administrador">Administrador</option>
          </select>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              style={{ flex: 1, backgroundColor: '#ff5722', color: '#fff', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {editandoId ? 'Actualizar Usuario' : 'Guardar Usuario'}
            </button>
            {editandoId && (
              <button
                type="button"
                onClick={limpiarFormulario}
                style={{ backgroundColor: '#6c757d', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ff5722', color: '#ff5722' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.idUsuario} style={{ borderBottom: '1px solid #3a2219' }}>
                <td style={{ padding: '12px' }}>{u.idUsuario}</td>
                <td>{u.nombre}</td>
                <td>{u.usuario}</td>
                <td>{u.correo || '—'}</td>
                <td>{u.rol || 'Mesero'}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleToggleEstado(u)}
                    style={{
                      backgroundColor: u.estado ? '#ff5722' : '#c62828',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {u.estado ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleEdit(u)}
                    style={{ backgroundColor: '#ff5722', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(u.idUsuario)}
                    style={{ backgroundColor: '#ff5722', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Anular
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usuarios;