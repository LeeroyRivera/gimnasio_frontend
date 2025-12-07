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
  Typography,
  Chip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const CategoriaEquipoTable = ({ data = [], onEdit, onDelete }) => (
  <TableContainer component={Paper} elevation={3}>
    <Table>
      <TableHead sx={{ bgcolor: 'primary.main' }}>
        <TableRow>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nombre Categoría</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descripción</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.length > 0 ? (
          data.map((categoria) => (
            <TableRow 
              key={categoria.id}
              sx={{ '&:hover': { bgcolor: 'action.hover' } }}
            >
              <TableCell>
                <Chip label={categoria.id} color="primary" size="small" />
              </TableCell>
              <TableCell>
                <Typography variant="body1" fontWeight="500">
                  {categoria.nombre_categoria}
                </Typography>
              </TableCell>
              <TableCell>{categoria.descripcion || 'Sin descripción'}</TableCell>
              <TableCell align="center">
                <IconButton 
                  color="primary"
                  onClick={() => onEdit(categoria)}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  color="error"
                  onClick={() => onDelete(categoria.id)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
              <Typography variant="body1" color="text.secondary">
                No hay categorías registradas
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

export default CategoriaEquipoTable;
