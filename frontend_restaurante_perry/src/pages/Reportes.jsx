import React from 'react';

const Reportes = () => {

  const descargarArchivo = (tipo, endpoint, nombreArchivo) => {
    // Apunta siempre al backend en el puerto 8080
    const BASE_URL = import.meta.env.VITE_API_URL || 'https://proyecto-restaurante-perry.onrender.com';
    const url = `${BASE_URL}/api/reportes/${endpoint}/${tipo}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al generar el reporte ${tipo.toUpperCase()}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const mimeType = tipo === 'excel' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
          : 'application/pdf';
        
        const extension = tipo === 'excel' ? 'xlsx' : 'pdf';
        
        const downloadUrl = window.URL.createObjectURL(new Blob([blob], { type: mimeType }));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `${nombreArchivo}.${extension}`);
        document.body.appendChild(link);
        link.click();
        
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      })
      .catch((error) => console.error(`Error al descargar el ${tipo.toUpperCase()}:`, error));
  };

  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#261610', padding: '30px', borderRadius: '10px', width: '100%', maxWidth: '700px', border: '1px solid #3a2219', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', textAlign: 'center' }}>
        
        <h1 style={{ color: '#ff5722', marginBottom: '10px', letterSpacing: '1px' }}>MÓDULO DE REPORTES</h1>
        <hr style={{ borderColor: '#ff5722', marginBottom: '30px', width: '100%' }} />

        <p style={{ color: '#ccc', marginBottom: '25px' }}>Seleccione el tipo de reporte y formato de descarga:</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* Reporte Mesas */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => descargarArchivo('pdf', 'mesas', 'Reporte_Mesas')}
              style={{ flex: 1, backgroundColor: '#ff5722', color: '#fff', border: 'none', padding: '12px', fontSize: '15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Reporte Mesas (PDF)
            </button>
            <button 
              onClick={() => descargarArchivo('excel', 'mesas', 'Reporte_Mesas')}
              style={{ flex: 1, backgroundColor: '#2e7d32', color: '#fff', border: 'none', padding: '12px', fontSize: '15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Reporte Mesas (Excel)
            </button>
          </div>

          {/* Reporte Productos */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => descargarArchivo('pdf', 'productos', 'Reporte_Productos')}
              style={{ flex: 1, backgroundColor: '#ff5722', color: '#fff', border: 'none', padding: '12px', fontSize: '15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Reporte Productos (PDF)
            </button>
            <button 
              onClick={() => descargarArchivo('excel', 'productos', 'Reporte_Productos')}
              style={{ flex: 1, backgroundColor: '#2e7d32', color: '#fff', border: 'none', padding: '12px', fontSize: '15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Reporte Productos (Excel)
            </button>
          </div>

          {/* Reporte Usuarios */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => descargarArchivo('pdf', 'usuarios', 'Reporte_Usuarios')}
              style={{ flex: 1, backgroundColor: '#ff5722', color: '#fff', border: 'none', padding: '12px', fontSize: '15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Reporte Usuarios (PDF)
            </button>
            <button 
              onClick={() => descargarArchivo('excel', 'usuarios', 'Reporte_Usuarios')}
              style={{ flex: 1, backgroundColor: '#2e7d32', color: '#fff', border: 'none', padding: '12px', fontSize: '15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Reporte Usuarios (Excel)
            </button>
          </div>

          {/* Reporte Pedidos */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => descargarArchivo('pdf', 'pedidos', 'Reporte_Pedidos')}
              style={{ flex: 1, backgroundColor: '#ff5722', color: '#fff', border: 'none', padding: '12px', fontSize: '15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Reporte Pedidos (PDF)
            </button>
            <button 
              onClick={() => descargarArchivo('excel', 'pedidos', 'Reporte_Pedidos')}
              style={{ flex: 1, backgroundColor: '#2e7d32', color: '#fff', border: 'none', padding: '12px', fontSize: '15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Reporte Pedidos (Excel)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Reportes;