import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Stack
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  FitnessCenter as GymIcon,
  PersonOutline as TrainerIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';

const PlanTable = ({ planes, onEdit, onDelete }) => {
  const getEstadoColor = (estado) => (estado === 'Activa' ? 'success' : 'default');

  return (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead sx={{ bgcolor: 'primary.main' }}>
          <TableRow>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre del Plan</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Duración</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Beneficios</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {planes.map((plan) => (
            <TableRow key={plan.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
              <TableCell>
                <Typography variant="body1" fontWeight="600">{plan.nombre_plan}</Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body2" color="text.secondary">{plan.descripcion || 'Sin descripción'}</Typography>
              </TableCell>

              <TableCell>
                <Chip icon={<TimeIcon />} label={`${plan.duracion_dias} días`} color="info" size="small" />
              </TableCell>

              <TableCell>
                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {plan.acceso_gimnasio && (
                    <Chip icon={<GymIcon />} label="Gimnasio" color="success" size="small" sx={{ mb: 0.5 }} />
                  )}
                  {plan.acceso_entrenador && (
                    <Chip icon={<TrainerIcon />} label="Entrenador" color="primary" size="small" sx={{ mb: 0.5 }} />
                  )}
                </Stack>
              </TableCell>

              <TableCell>
                <Chip label={plan.estado} color={getEstadoColor(plan.estado)} size="small" />
              </TableCell>

              <TableCell align="center">
                <IconButton color="primary" onClick={() => onEdit(plan)} size="small">
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(plan.id)} size="small">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PlanTable;
