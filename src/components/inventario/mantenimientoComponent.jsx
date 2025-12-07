import React, { useState, useEffect } from 'react';
import api from '../../api/http';
import {
  Box,
  TextField,
  Container,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import NuevoMantenimiento from './MantenimientoComponents/NuevoMantenimiento';
import MantenimientoTable from './MantenimientoComponents/MantenimientoTable';
import MantenimientoModal from './MantenimientoComponents/MantenimientoModal';

const Mantenimiento = () => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mantenimientoSeleccionado, setMantenimientoSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    tipo_mantenimiento: 'preventivo',
    fecha_programada: '',
    fecha_realizada: '',
    descripcion_trabajo: '',
    tecnico_responsable: '',
    costo: '',
    estado: 'Pendiente',
    proximo_mantenimiento: '',
    notas: '',
    id_equipo: ''
  });
  const [error, setError] = useState('');

  // Estados para paginación y búsqueda
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarMantenimientos();
    cargarEquipos();
  }, []);

  const cargarMantenimientos = async () => {
    try {
      const response = await api.get('/api/inventario/mantenimiento/listar');
      setMantenimientos(response.data);
    } catch (error) {
      console.error('Error al cargar mantenimientos:', error);
      setError('Error al cargar mantenimientos');
    }
  };

  const cargarEquipos = async () => {
    try {
      const response = await api.get('/api/inventario/equipo/listar');
      setEquipos(response.data);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
      setError('Error al cargar equipos');
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
      if (mantenimientoSeleccionado) {
        await api.put(`/api/inventario/mantenimiento/editar?id=${mantenimientoSeleccionado.id}`, formData);
      } else {
        await api.post('/api/inventario/mantenimiento/guardar', formData);
      }
      
      cargarMantenimientos();
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar mantenimiento:', error);
      if (error.response?.data?.errores) {
        const erroresFormateados = error.response.data.errores.map(e => e.msg).join('\n');
        setError(erroresFormateados);
      } else {
        setError('Error al guardar mantenimiento');
      }
    }
  };

  const editarMantenimiento = (mantenimiento) => {
    setMantenimientoSeleccionado(mantenimiento);
    setFormData({
      tipo_mantenimiento: mantenimiento.tipo_mantenimiento || 'preventivo',
      fecha_programada: mantenimiento.fecha_programada ? mantenimiento.fecha_programada.split('T')[0] : '',
      fecha_realizada: mantenimiento.fecha_realizada ? mantenimiento.fecha_realizada.split('T')[0] : '',
      descripcion_trabajo: mantenimiento.descripcion_trabajo || '',
      tecnico_responsable: mantenimiento.tecnico_responsable || '',
      costo: mantenimiento.costo || '',
      estado: mantenimiento.estado || 'Pendiente',
      proximo_mantenimiento: mantenimiento.proximo_mantenimiento ? mantenimiento.proximo_mantenimiento.split('T')[0] : '',
      notas: mantenimiento.notas || '',
      id_equipo: mantenimiento.id_equipo || ''
    });
    setMostrarModal(true);
  };

  const eliminarMantenimiento = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este mantenimiento?')) {
      try {
        await api.delete(`/api/inventario/mantenimiento/eliminar?id=${id}`);
        cargarMantenimientos();
      } catch (error) {
        console.error('Error al eliminar mantenimiento:', error);
        setError('Error al eliminar mantenimiento');
      }
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setMantenimientoSeleccionado(null);
    setFormData({
      tipo_mantenimiento: 'preventivo',
      fecha_programada: '',
      fecha_realizada: '',
      descripcion_trabajo: '',
      tecnico_responsable: '',
      costo: '',
      estado: 'Pendiente',
      proximo_mantenimiento: '',
      notas: '',
      id_equipo: ''
    });
    setError('');
  };

  const getEstadoColor = (estado) => {
    const colores = {
      'Pendiente': 'warning',
      'En progreso': 'info',
      'Completado': 'success',
      'Cancelado': 'error'
    };
    return colores[estado] || 'default';
  };

  const getTipoColor = (tipo) => {
    return tipo === 'preventivo' ? 'primary' : 'secondary';
  };

  // Función para filtrar mantenimientos según la búsqueda
  const mantenimientosFiltrados = mantenimientos.filter((mantenimiento) => {
    const terminoBusqueda = busqueda.toLowerCase();
    
    return (
      mantenimiento.equipo?.nombre_equipo?.toLowerCase().includes(terminoBusqueda) ||
      mantenimiento.equipo?.numero_serie?.toLowerCase().includes(terminoBusqueda) ||
      mantenimiento.tipo_mantenimiento?.toLowerCase().includes(terminoBusqueda) ||
      mantenimiento.tecnico_responsable?.toLowerCase().includes(terminoBusqueda) ||
      mantenimiento.estado?.toLowerCase().includes(terminoBusqueda)
    );
  });

  // Calcular los mantenimientos a mostrar en la página actual
  const mantenimientosPaginados = mantenimientosFiltrados.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Manejar cambio de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Manejar cambio de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Manejar cambio en el campo de búsqueda
  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
    setPage(0);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <NuevoMantenimiento
        onOpen={() => setMostrarModal(true)}
        error={error}
        onClearError={() => setError('')}
      />

      {/* Campo de búsqueda */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por equipo, número de serie, tipo, técnico o estado..."
          value={busqueda}
          onChange={handleBusquedaChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <MantenimientoTable
        data={mantenimientosPaginados}
        onEdit={editarMantenimiento}
        onDelete={eliminarMantenimiento}
        getEstadoColor={getEstadoColor}
        getTipoColor={getTipoColor}
        busqueda={busqueda}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={mantenimientosFiltrados.length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <MantenimientoModal
        open={mostrarModal}
        onClose={cerrarModal}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        error={error}
        equipos={equipos}
        mantenimientoSeleccionado={mantenimientoSeleccionado}
      />
    </Container>
  );
};

export default Mantenimiento;
