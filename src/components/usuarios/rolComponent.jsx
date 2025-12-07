import React, { useState, useEffect } from 'react';
import api from '../../api/http';
import { Container } from '@mui/material';
import NuevoRol from './RolComponents/NuevoRol';
import RolTable from './RolComponents/RolTable';
import RolModal from './RolComponents/RolModal';

const Rol = () => {
  const [roles, setRoles] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    cargarRoles();
  }, []);

  const cargarRoles = async () => {
    try {
      const response = await api.get('/api/rol/listar');
      setRoles(response.data);
    } catch (error) {
      console.error('Error al cargar roles:', error);
      setError('Error al cargar roles');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (rolSeleccionado) {
        await api.put(`/api/rol/actualizar?id=${rolSeleccionado.id_rol}`, formData);
      } else {
        await api.post('/api/rol/guardar', formData);
      }
      
      cargarRoles();
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar rol:', error);
      if (error.response?.data?.errores) {
        const erroresFormateados = error.response.data.errores.map(e => e.msg).join('\n');
        setError(erroresFormateados);
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Error al guardar rol');
      }
    }
  };

  const editarRol = (rol) => {
    setRolSeleccionado(rol);
    setFormData({
      nombre: rol.nombre || '',
      descripcion: rol.descripcion || ''
    });
    setMostrarModal(true);
  };

  const eliminarRol = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este rol?')) {
      try {
        await api.delete(`/api/rol/eliminar?id=${id}`);
        cargarRoles();
      } catch (error) {
        console.error('Error al eliminar rol:', error);
        setError('Error al eliminar rol');
      }
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setRolSeleccionado(null);
    setFormData({
      nombre: '',
      descripcion: ''
    });
    setError('');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <NuevoRol
        onOpen={() => setMostrarModal(true)}
        error={error}
        onClearError={() => setError('')}
      />

      <RolTable
        data={roles}
        onEdit={editarRol}
        onDelete={eliminarRol}
      />

      <RolModal
        open={mostrarModal}
        onClose={cerrarModal}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        error={error}
        rolSeleccionado={rolSeleccionado}
      />
    </Container>
  );
};

export default Rol;