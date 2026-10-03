import React, { useEffect, useState } from 'react';
import { getUsuarios, createUsuario } from '../services/usuarioServices';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [correo, setCorreo] = useState('');
  const [idPerfil, setIdPerfil] = useState(1);

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
    try {
      await createUsuario({
        nombre,
        usuario,
        contrasena,
        correo,
        idPerfil: parseInt(idPerfil),
        estado: true,
      });
      setNombre('');
      setUsuario('');
      setContrasena('');
      setCorreo('');
      cargarUsuarios();
    } catch (err) {
      console.error('Error al crear usuario:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestión de Usuarios</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input type="text" placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <input type="text" placeholder="Nombre de usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
        <input type="email" placeholder="Correo electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        <button type="submit">Guardar Usuario</button>
      </form>

      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Correo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.idUsuario}>
              <td>{u.idUsuario}</td>
              <td>{u.nombre}</td>
              <td>{u.usuario}</td>
              <td>{u.correo}</td>
              <td>{u.estado ? 'Activo' : 'Inactivo'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;