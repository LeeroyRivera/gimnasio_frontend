import React, { useState, useEffect } from 'react';
import api from '../../api/http';
import { Box, Container } from '@mui/material';
import NuevoCategoriaEquipo from './CategoriaEquipoComponents/NuevoCategoriaEquipo';
import CategoriaEquipoTable from './CategoriaEquipoComponents/CategoriaEquipoTable';
import CategoriaEquipoModal from './CategoriaEquipoComponents/CategoriaEquipoModal';

const CategoriaEquipo = () => {
  const [categorias, setCategorias] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [formData, setFormData] = useState({
    nombre_categoria: '',
    descripcion: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const response = await api.get('/api/inventario/categoria/listar');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setError('Error al cargar categorías');
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
      if (categoriaSeleccionada) {
        await api.put(`/api/inventario/categoria/editar?id=${categoriaSeleccionada.id}`, formData);
      } else {
        await api.post('/api/inventario/categoria/guardar', formData);
      }
      
      cargarCategorias();
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      if (error.response?.data?.errores) {
        const erroresFormateados = error.response.data.errores.map(e => e.msg).join('\n');
        setError(erroresFormateados);
      } else {
        setError('Error al guardar categoría');
      }
    }
  };

  const editarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setFormData({
      nombre_categoria: categoria.nombre_categoria || '',
      descripcion: categoria.descripcion || ''
    });
    setMostrarModal(true);
  };

  const eliminarCategoria = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        await api.delete(`/api/inventario/categoria/eliminar?id=${id}`);
        cargarCategorias();
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
        setError('Error al eliminar categoría');
      }
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setCategoriaSeleccionada(null);
    setFormData({
      nombre_categoria: '',
      descripcion: ''
    });
    setError('');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <NuevoCategoriaEquipo
        onOpen={() => setMostrarModal(true)}
        error={error}
        onClearError={() => setError('')}
      />

      <CategoriaEquipoTable
        data={categorias}
        onEdit={editarCategoria}
        onDelete={eliminarCategoria}
      />

      <CategoriaEquipoModal
        open={mostrarModal}
        onClose={cerrarModal}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        error={error}
        categoriaSeleccionada={categoriaSeleccionada}
      />
    </Container>
  );
};

export default CategoriaEquipo;
