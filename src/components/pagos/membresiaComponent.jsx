import React, { useState, useEffect } from 'react';
import api from '../../api/http';
import {
  Box,
  TextField,
  Container,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import NuevoMembresia from './MembresiaComponents/NuevoMembresia';
import MembresiaModal from './MembresiaComponents/MembresiaModal';
import MembresiaTable from './MembresiaComponents/MembresiaTable';

const Membresia = () => {
  const [membresias, setMembresias] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [membresiaSeleccionada, setMembresiaSeleccionada] = useState(null);
  const [formData, setFormData] = useState({
    id_cliente: '',
    id_plan: '',
    fecha_inicio: '',
    fecha_vencimiento: '',
    estado: 'Activa',
    monto_pagado: '',
    descuento_aplicado: '',
    notas: ''
  });
  const [error, setError] = useState('');

  // Estados para paginación y búsqueda
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarMembresias();
    cargarClientes();
    cargarPlanes();
  }, []);

  const cargarMembresias = async () => {
    try {
      const response = await api.get('/api/pagos/membresias/listar');
      setMembresias(response.data);
      console.log('Membresías cargadas:', response.data);
    } catch (error) {
      console.error('Error al cargar membresías:', error);
      setError('Error al cargar membresías');
    }
  };

  const cargarClientes = async () => {
    try {
      const response = await api.get('/api/usuario/listar');
      // Filtrar solo usuarios que tienen información de cliente
      const clientesData = response.data
        .filter(user => user.Cliente)
        .map(user => ({
          ...user.Cliente,
          usuario: user
        }));
      setClientes(clientesData);
      console.log('Clientes cargados:', clientesData);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      setError('Error al cargar clientes');
    }
  };

  const cargarPlanes = async () => {
    try {
      const response = await api.get('/api/pagos/planes/listar');
      setPlanes(response.data);
    } catch (error) {
      console.error('Error al cargar planes:', error);
      setError('Error al cargar planes');
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
      if (membresiaSeleccionada) {
        await api.put(`/api/pagos/membresias/editar?id=${membresiaSeleccionada.id}`, formData);
      } else {
        await api.post('/api/pagos/membresias/guardar', formData);
      }
      
      cargarMembresias();
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar membresía:', error);
      if (error.response?.data?.errores) {
        const erroresFormateados = error.response.data.errores.map(e => e.msg).join('\n');
        setError(erroresFormateados);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Error al guardar membresía');
      }
    }
  };

  const editarMembresia = (membresia) => {
    setMembresiaSeleccionada(membresia);
    setFormData({
      id_cliente: membresia.id_cliente || '',
      id_plan: membresia.id_plan || '',
      fecha_inicio: membresia.fecha_inicio ? membresia.fecha_inicio.split('T')[0] : '',
      fecha_vencimiento: membresia.fecha_vencimiento ? membresia.fecha_vencimiento.split('T')[0] : '',
      estado: membresia.estado || 'Activa',
      monto_pagado: membresia.monto_pagado || '',
      descuento_aplicado: membresia.descuento_aplicado || '',
      notas: membresia.notas || ''
    });
    setMostrarModal(true);
  };

  const eliminarMembresia = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta membresía?')) {
      try {
        await api.delete(`/api/pagos/membresias/eliminar?id=${id}`);
        cargarMembresias();
      } catch (error) {
        console.error('Error al eliminar membresía:', error);
        setError('Error al eliminar membresía');
      }
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setMembresiaSeleccionada(null);
    setFormData({
      id_cliente: '',
      id_plan: '',
      fecha_inicio: '',
      fecha_vencimiento: '',
      estado: 'Activa',
      monto_pagado: '',
      descuento_aplicado: '',
      notas: ''
    });
    setError('');
  };

  const getEstadoColor = (estado) => {
    const colores = {
      'Activa': 'success',
      'Vencida': 'error',
      'suspendida': 'warning',
      'Cancelada': 'default'
    };
    return colores[estado] || 'default';
  };

  // Función para filtrar membresías según la búsqueda
  const membresiasFiltradas = membresias.filter((membresia) => {
    const terminoBusqueda = busqueda.toLowerCase();
    const clienteNombre = `${membresia.cliente?.nombre || ''} ${membresia.cliente?.apellido || ''}`.toLowerCase();
    const planNombre = membresia.plan?.nombre_plan?.toLowerCase() || '';
    
    return (
      clienteNombre.includes(terminoBusqueda) ||
      planNombre.includes(terminoBusqueda) ||
      membresia.estado?.toLowerCase().includes(terminoBusqueda) ||
      membresia.cliente?.id_cliente?.toString().includes(terminoBusqueda)
    );
  });

  // Calcular las membresías a mostrar en la página actual
  const membresiasPaginadas = membresiasFiltradas.slice(
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

      <NuevoMembresia 
        onOpen={() => setMostrarModal(true)} 
        size="large" 
        error={error} 
        onClearError={() => setError('')} 
      />

      {/* Campo de búsqueda */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por cliente, plan, estado o ID de cliente..."
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

      <MembresiaTable
        data={membresiasPaginadas}
        onEdit={editarMembresia}
        onDelete={eliminarMembresia}
        getEstadoColor={getEstadoColor}
        busqueda={busqueda}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={membresiasFiltradas.length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <MembresiaModal
        open={mostrarModal}
        onClose={cerrarModal}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        error={error}
        clientes={clientes}
        planes={planes}
        membresiaSeleccionada={membresiaSeleccionada}
      />
    </Container>
  );
};

export default Membresia;
