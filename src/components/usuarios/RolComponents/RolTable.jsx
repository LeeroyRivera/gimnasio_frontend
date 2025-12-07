import React from 'react';
import { 
  TableContainer, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Paper, 
  IconButton,
  Chip,
  Typography
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

const RolTable = ({ data = [], onEdit, onDelete }) => (
  <TableContainer component={Paper} elevation={3}>
    <Table>
      <TableHead sx={{ bgcolor: 'primary.main' }}>
        <TableRow>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Creación</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.length > 0 ? (
          data.map((rol) => (
            <TableRow 
              key={rol.id_rol}
              sx={{ '&:hover': { bgcolor: 'action.hover' } }}
            >
              <TableCell>
                <Chip 
                  icon={<AdminIcon />}
                  label={rol.id_rol}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body1" fontWeight="600">
                  {rol.nombre}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {rol.descripcion || 'Sin descripción'}
                </Typography>
              </TableCell>
              <TableCell>
                {rol.fecha_creacion ? new Date(rol.fecha_creacion).toLocaleDateString() : 'N/A'}
              </TableCell>
              <TableCell align="center">
                <IconButton 
                  color="primary"
                  onClick={() => onEdit(rol)}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  color="error"
                  onClick={() => onDelete(rol.id_rol)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
              <Typography variant="body1" color="text.secondary">
                No hay roles registrados
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default RolTable;
