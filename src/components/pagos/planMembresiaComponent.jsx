import React, { useState, useEffect } from 'react';
import api from '../../api/http';
import {
  Container
} from '@mui/material';
import { LocalOffer as PlanIcon } from '@mui/icons-material';
import PlanTable from './PlanComponents/PlanTable';
import PlanModal from './PlanComponents/PlanModal';
import NuevoPlan from './PlanComponents/NuevoPlan';

const PlanMembresia = () => {
  const [planes, setPlanes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    nombre_plan: '',
    descripcion: '',
    duracion_dias: '',
    acceso_gimnasio: true,
    acceso_entrenador: false,
    estado: 'Activa'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    cargarPlanes();
  }, []);

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
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (planSeleccionado) {
        await api.put(`/api/pagos/planes/editar?id=${planSeleccionado.id}`, formData);
      } else {
        await api.post('/api/pagos/planes/guardar', formData);
      }
      
      cargarPlanes();
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar plan:', error);
      if (error.response?.data?.errores) {
        const erroresFormateados = error.response.data.errores.map(e => e.msg).join('\n');
        setError(erroresFormateados);
      } else {
        setError('Error al guardar plan');
      }
    }
  };

  const editarPlan = (plan) => {
    setPlanSeleccionado(plan);
    setFormData({
      nombre_plan: plan.nombre_plan || '',
      descripcion: plan.descripcion || '',
      duracion_dias: plan.duracion_dias || '',
      acceso_gimnasio: plan.acceso_gimnasio || false,
      acceso_entrenador: plan.acceso_entrenador || false,
      estado: plan.estado || 'Activa'
    });
    setMostrarModal(true);
  };

  const eliminarPlan = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este plan?')) {
      try {
        await api.delete(`/api/pagos/planes/eliminar?id=${id}`);
        cargarPlanes();
      } catch (error) {
        console.error('Error al eliminar plan:', error);
        setError('Error al eliminar plan');
      }
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setPlanSeleccionado(null);
    setFormData({
      nombre_plan: '',
      descripcion: '',
      duracion_dias: '',
      acceso_gimnasio: true,
      acceso_entrenador: false,
      estado: 'Activa'
    });
    setError('');
  };

  // getEstadoColor moved to PlanTable component

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>

      <NuevoPlan 
      onOpen={() => setMostrarModal(true)} 
      size="large" 
      error={error} 
      onClearError={() => setError('')} 
      />

      <PlanTable 
      planes={planes}
      onEdit={editarPlan}
      onDelete={eliminarPlan} 
      />

      <PlanModal
        open={mostrarModal}
        onClose={cerrarModal}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        error={error}
        planSeleccionado={planSeleccionado}
      />
      
    </Container>
  );
};

export default PlanMembresia;
