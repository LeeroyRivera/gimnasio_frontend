import React, { useState, useEffect } from 'react';
import api from '../../api/http';
import {
  Box,
  TextField,
  Container,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import NuevoUsuario from './UsuarioComponents/NuevoUsuario';
import UsuarioTable from './UsuarioComponents/UsuarioTable';
import UsuarioModal from './UsuarioComponents/UsuarioModal';

const Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    // Datos de usuario
    id_rol: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    genero: '',
    username: '',
    password: '',
    estado: 'activo',
    // Datos de cliente
    cliente: {
      nombre: '',
      apellido: '',
      tipo_sangre: '',
      peso_actual: '',
      altura: '',
      condiciones_medicas: '',
      contacto_emergencia: '',
      telefono_emergencia: ''
    }
  });
  const [error, setError] = useState('');

  // Estados para paginación y búsqueda
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await api.get('/api/usuario/listar');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar usuarios');
    }
  };

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

  const handleClienteChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      cliente: {
        ...formData.cliente,
        [name]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (usuarioSeleccionado) {
        // Actualizar usuario (sin datos de cliente en esta request)
        const { cliente, password, ...datosUsuario } = formData;
        // Solo enviar password si fue modificado
        const dataToSend = password ? { ...datosUsuario, password } : datosUsuario;
        await api.put(`/api/usuario/actualizar?id=${usuarioSeleccionado.id_usuario}`, dataToSend);
      } else {
        // Crear nuevo usuario con cliente
        await api.post('/api/usuario/registro', formData);
      }
      
      cargarUsuarios();
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      if (error.response?.data?.errores) {
        const erroresFormateados = error.response.data.errores.map(e => e.msg).join('\n');
        setError(erroresFormateados);
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Error al guardar usuario');
      }
    }
  };

  const editarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setFormData({
      id_rol: usuario.id_rol || '',
      email: usuario.email || '',
      telefono: usuario.telefono || '',
      fecha_nacimiento: usuario.fecha_nacimiento ? usuario.fecha_nacimiento.split('T')[0] : '',
      genero: usuario.genero || '',
      username: usuario.username || '',
      password: '', // No prellenar password por seguridad
      estado: usuario.estado || 'activo',
      cliente: {
        nombre: usuario.Cliente?.nombre || '',
        apellido: usuario.Cliente?.apellido || '',
        tipo_sangre: usuario.Cliente?.tipo_sangre || '',
        peso_actual: usuario.Cliente?.peso_actual || '',
        altura: usuario.Cliente?.altura || '',
        condiciones_medicas: usuario.Cliente?.condiciones_medicas || '',
        contacto_emergencia: usuario.Cliente?.contacto_emergencia || '',
        telefono_emergencia: usuario.Cliente?.telefono_emergencia || ''
      }
    });
    setMostrarModal(true);
  };

  const eliminarUsuario = async (id) => {
    if (window.confirm('¿Estás seguro de desactivar este usuario?')) {
      try {
        await api.delete(`/api/usuario/eliminar?id=${id}`);
        cargarUsuarios();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        setError('Error al eliminar usuario');
      }
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setUsuarioSeleccionado(null);
    setFormData({
      id_rol: '',
      email: '',
      telefono: '',
      fecha_nacimiento: '',
      genero: '',
      username: '',
      password: '',
      estado: 'activo',
      cliente: {
        nombre: '',
        apellido: '',
        tipo_sangre: '',
        peso_actual: '',
        altura: '',
        condiciones_medicas: '',
        contacto_emergencia: '',
        telefono_emergencia: ''
      }
    });
    setError('');
  };

  const getEstadoColor = (estado) => {
    const colores = {
      'activo': 'success',
      'inactivo': 'error',
      'suspendido': 'warning'
    };
    return colores[estado] || 'default';
  };

  // Función para filtrar usuarios según la búsqueda
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const terminoBusqueda = busqueda.toLowerCase();
    const clienteNombre = usuario.Cliente 
      ? `${usuario.Cliente.nombre || ''} ${usuario.Cliente.apellido || ''}`.toLowerCase()
      : '';
    const rolNombre = roles.find(r => r.id_rol === usuario.id_rol)?.nombre?.toLowerCase() || '';
    
    return (
      usuario.username?.toLowerCase().includes(terminoBusqueda) ||
      clienteNombre.includes(terminoBusqueda) ||
      usuario.email?.toLowerCase().includes(terminoBusqueda) ||
      usuario.telefono?.includes(terminoBusqueda) ||
      rolNombre.includes(terminoBusqueda) ||
      usuario.estado?.toLowerCase().includes(terminoBusqueda) ||
      usuario.id_usuario?.toString().includes(terminoBusqueda)
    );
  });

  // Calcular los usuarios a mostrar en la página actual
  const usuariosPaginados = usuariosFiltrados.slice(
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
      <NuevoUsuario
        onOpen={() => setMostrarModal(true)}
        error={error}
        onClearError={() => setError('')}
      />

      {/* Campo de búsqueda */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por usuario, cliente, email, teléfono, rol, estado o ID..."
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

      <UsuarioTable
        data={usuariosPaginados}
        onEdit={editarUsuario}
        onDelete={eliminarUsuario}
        roles={roles}
        getEstadoColor={getEstadoColor}
        busqueda={busqueda}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={usuariosFiltrados.length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <UsuarioModal
        open={mostrarModal}
        onClose={cerrarModal}
        formData={formData}
        onChange={handleInputChange}
        onClienteChange={handleClienteChange}
        onSubmit={handleSubmit}
        error={error}
        roles={roles}
        usuarioSeleccionado={usuarioSeleccionado}
      />
    </Container>
  );
};

export default Usuario;
