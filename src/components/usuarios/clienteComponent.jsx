import React, { useState, useEffect } from 'react';
import api from '../../api/http';
import {
  Box,
  TextField,
  Container,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import NuevoCliente from './ClienteComponents/NuevoCliente';
import ClienteTable from './ClienteComponents/ClienteTable';
import ClienteModal from './ClienteComponents/ClienteModal';

const Cliente = () => {
  const [clientes, setClientes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipo_sangre: '',
    peso_actual: '',
    altura: '',
    condiciones_medicas: '',
    contacto_emergencia: '',
    telefono_emergencia: ''
  });
  const [error, setError] = useState('');

  // Estados para paginación y búsqueda
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const response = await api.get('/api/usuario/listar');
      // Filtrar solo los usuarios que tienen información de cliente
      const clientesData = response.data
        .filter(user => user.Cliente)
        .map(user => ({
          ...user.Cliente,
          usuario: user
        }));
      setClientes(clientesData);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      setError('Error al cargar clientes');
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
      await api.put(`/api/cliente/actualizar?id=${clienteSeleccionado.id_cliente}`, formData);
      cargarClientes();
      cerrarModal();
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      if (error.response?.data?.errores) {
        const erroresFormateados = error.response.data.errores.map(e => e.msg).join('\n');
        setError(erroresFormateados);
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Error al actualizar cliente');
      }
    }
  };

  const editarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setFormData({
      nombre: cliente.nombre || '',
      apellido: cliente.apellido || '',
      tipo_sangre: cliente.tipo_sangre || '',
      peso_actual: cliente.peso_actual || '',
      altura: cliente.altura || '',
      condiciones_medicas: cliente.condiciones_medicas || '',
      contacto_emergencia: cliente.contacto_emergencia || '',
      telefono_emergencia: cliente.telefono_emergencia || ''
    });
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setClienteSeleccionado(null);
    setFormData({
      nombre: '',
      apellido: '',
      tipo_sangre: '',
      peso_actual: '',
      altura: '',
      condiciones_medicas: '',
      contacto_emergencia: '',
      telefono_emergencia: ''
    });
    setError('');
  };

  // Función para filtrar clientes según la búsqueda
  const clientesFiltrados = clientes.filter((cliente) => {
    const terminoBusqueda = busqueda.toLowerCase();
    const nombreCompleto = `${cliente.nombre || ''} ${cliente.apellido || ''}`.toLowerCase();
    
    return (
      nombreCompleto.includes(terminoBusqueda) ||
      cliente.usuario?.username?.toLowerCase().includes(terminoBusqueda) ||
      cliente.usuario?.email?.toLowerCase().includes(terminoBusqueda) ||
      cliente.usuario?.telefono?.includes(terminoBusqueda) ||
      cliente.tipo_sangre?.toLowerCase().includes(terminoBusqueda) ||
      cliente.id_cliente?.toString().includes(terminoBusqueda)
    );
  });

  // Calcular los clientes a mostrar en la página actual
  const clientesPaginados = clientesFiltrados.slice(
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
      <NuevoCliente
        error={error}
        onClearError={() => setError('')}
      />

      {/* Campo de búsqueda */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por nombre, usuario, email, teléfono, tipo de sangre o ID..."
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

      <ClienteTable
        data={clientesPaginados}
        onEdit={editarCliente}
        busqueda={busqueda}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={clientesFiltrados.length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <ClienteModal
        open={mostrarModal}
        onClose={cerrarModal}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        error={error}
        clienteSeleccionado={clienteSeleccionado}
      />
    </Container>
  );
};

export default Cliente;