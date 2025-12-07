import React, { useState, useEffect } from 'react';
import api from '../../api/http';
import VistaEquiposComponent from './equiposComponents/vistaEquiposComponent';
import NuevoEquipo from './equiposComponents/NuevoEquipo';
import EquipoModal from './equiposComponents/EquipoModal';
import EquipoTable from './equiposComponents/EquipoTable';
import {
  Box,
  Container,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon
} from '@mui/icons-material';

const Equipo = () => {
  const [equipos, setEquipos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [formData, setFormData] = useState({
    nombre_equipo: '',
    marca: '',
    modelo: '',
    numero_serie: '',
    descripcion: '',
    fecha_compra: '',
    costo: '',
    ubicacion: '',
    estado: 'Excelente',
    id_categoria: null
  });
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para paginación y búsqueda
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarEquipos();
    cargarCategorias();
  }, []);

  const cargarEquipos = async () => {
    try {
      const response = await api.get('/api/inventario/equipo/listar');
      console.log('Equipos cargados:', response.data);
      setEquipos(response.data);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
      setError('Error al cargar equipos');
    }
  };

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
    // Convertir id_categoria a número
    if (name === 'id_categoria') {
      setFormData({ ...formData, [name]: value ? parseInt(value, 10) : null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImagenChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImagenFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Por favor selecciona un archivo de imagen válido');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImagenChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImagenChange(e.target.files[0]);
    }
  };

  const eliminarImagenPreview = () => {
    setImagenFile(null);
    setImagenPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Validar que la categoría esté seleccionada
      if (!formData.id_categoria) {
        setError('Debe seleccionar una categoría');
        return;
      }

      const formDataToSend = new FormData();
      
      // Agregar campos del equipo (solo los que tienen valor válido)
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        // Solo agregar si el valor no es vacío, null o undefined
        if (value !== '' && value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      // Agregar imagen si existe
      if (imagenFile) {
        formDataToSend.append('imagen', imagenFile);
      }

      // Debug: ver qué se está enviando
      console.log('FormData a enviar:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, ':', value);
      }

      if (equipoSeleccionado) {
        // Editar equipo - enviar solo los datos sin imagen
        await api.put(`/api/inventario/equipo/editar?id=${equipoSeleccionado.id}`, formData);
        
        // Si hay nueva imagen, subirla por separado
        if (imagenFile) {
          const formDataImagen = new FormData();
          formDataImagen.append('imagen', imagenFile);
          await api.post(`/api/inventario/equipo/imagen?id=${equipoSeleccionado.id}`, formDataImagen, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      } else {
        // Crear nuevo equipo con imagen incluida
        await api.post('/api/inventario/equipo/guardar', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      cargarEquipos();
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar equipo:', error);
      if (error.response?.data?.errores) {
        const erroresFormateados = error.response.data.errores.map(e => e.msg).join('\n');
        setError(erroresFormateados);
      } else {
        setError('Error al guardar equipo');
      }
    }
  };

  const editarEquipo = (equipo) => {
    setEquipoSeleccionado(equipo);
    setFormData({
      nombre_equipo: equipo.nombre_equipo || '',
      marca: equipo.marca || '',
      modelo: equipo.modelo || '',
      numero_serie: equipo.numero_serie || '',
      descripcion: equipo.descripcion || '',
      fecha_compra: equipo.fecha_compra ? equipo.fecha_compra.split('T')[0] : '',
      costo: equipo.costo || '',
      ubicacion: equipo.ubicacion || '',
      estado: equipo.estado || 'Excelente',
      id_categoria: equipo.id_categoria || ''
    });
    
    if (equipo.foto) {
      setImagenPreview(`http://localhost:3000/${equipo.foto}`);
    } else {
      setImagenPreview(null);
    }
    setImagenFile(null);
    
    setMostrarModal(true);
  };

  const eliminarEquipo = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este equipo?')) {
      try {
        await api.delete(`/api/inventario/equipo/eliminar?id=${id}`);
        cargarEquipos();
      } catch (error) {
        console.error('Error al eliminar equipo:', error);
        setError('Error al eliminar equipo');
      }
    }
  };


  const verDetallesEquipo = (equipo) => {
    setEquipoSeleccionado(equipo);
    setMostrarDetalles(true);
  };


  const cerrarModal = () => {
    setMostrarModal(false);
    setEquipoSeleccionado(null);
    setFormData({
      nombre_equipo: '',
      marca: '',
      modelo: '',
      numero_serie: '',
      descripcion: '',
      fecha_compra: '',
      costo: '',
      ubicacion: '',
      estado: 'Excelente',
      id_categoria: ''
    });
    setImagenFile(null);
    setImagenPreview(null);
    setDragActive(false);
    setError('');
  };

  const getEstadoColor = (estado) => {
    const colores = {
      'Excelente': 'success',
      'Bueno': 'info',
      'Regular': 'warning',
      'En mantenimiento': 'secondary',
      'Fuera de servicio': 'error'
    };
    return colores[estado] || 'default';
  };

  // Función para filtrar equipos según la búsqueda
  const equiposFiltrados = equipos.filter((equipo) => {
    const terminoBusqueda = busqueda.toLowerCase();
    return (
      equipo.nombre_equipo?.toLowerCase().includes(terminoBusqueda) ||
      equipo.marca?.toLowerCase().includes(terminoBusqueda) ||
      equipo.modelo?.toLowerCase().includes(terminoBusqueda) ||
      equipo.numero_serie?.toLowerCase().includes(terminoBusqueda) ||
      equipo.categoria_equipo?.nombre_categoria?.toLowerCase().includes(terminoBusqueda) ||
      equipo.ubicacion?.toLowerCase().includes(terminoBusqueda) ||
      equipo.estado?.toLowerCase().includes(terminoBusqueda)
    );
  });

  // Calcular los equipos a mostrar en la página actual
  const equiposPaginados = equiposFiltrados.slice(
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
    setPage(0); // Resetear a la primera página al buscar
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <NuevoEquipo
        onOpen={() => setMostrarModal(true)}
        error={error}
        onClearError={() => setError('')}
      />

      {/* Campo de búsqueda */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por nombre, marca, modelo, serie, categoría, ubicación o estado..."
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

      <EquipoTable
        data={equiposPaginados}
        onEdit={editarEquipo}
        onDelete={eliminarEquipo}
        onViewDetails={verDetallesEquipo}
        getEstadoColor={getEstadoColor}
        busqueda={busqueda}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={equiposFiltrados.length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <EquipoModal
        open={mostrarModal}
        onClose={cerrarModal}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        error={error}
        categorias={categorias}
        equipoSeleccionado={equipoSeleccionado}
        imagenPreview={imagenPreview}
        dragActive={dragActive}
        handleDrag={handleDrag}
        handleDrop={handleDrop}
        handleFileInputChange={handleFileInputChange}
        eliminarImagenPreview={eliminarImagenPreview}
      />

      {/* Modal de Vista de Detalles del Equipo */}
      <VistaEquiposComponent 
        open={mostrarDetalles}
        onClose={() => setMostrarDetalles(false)}
        equipoDetalle={equipoSeleccionado}
      />
    </Container>
  );
};

export default Equipo;
