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
  Typography,
  Avatar,
  Box,
  TablePagination
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Person as PersonIcon } from '@mui/icons-material';

const MembresiaTable = ({
  data = [],
  onEdit,
  onDelete,
  getEstadoColor,
  busqueda = '',
  // Paginación
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange
}) => (
  <TableContainer component={Paper} elevation={3}>
    <Table>
      <TableHead sx={{ bgcolor: 'primary.main' }}>
        <TableRow>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cliente</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Plan</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Inicio</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Vencimiento</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Monto</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descuento</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Monto Final</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
          <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
            Acciones
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.length > 0 ? (
          data.map((membresia) => (
            <TableRow key={membresia.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    <PersonIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="500">
                      {membresia.cliente?.nombre} {membresia.cliente?.apellido}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {membresia.cliente?.id_cliente}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body1" fontWeight="500">
                  {membresia.plan?.nombre_plan}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {membresia.plan?.duracion_dias} días
                </Typography>
              </TableCell>
              <TableCell>
                {membresia.fecha_inicio
                  ? new Date(membresia.fecha_inicio).toLocaleDateString()
                  : 'N/A'}
              </TableCell>
              <TableCell>
                {membresia.fecha_vencimiento
                  ? new Date(membresia.fecha_vencimiento).toLocaleDateString()
                  : 'N/A'}
              </TableCell>
              <TableCell>
                <Chip
                  label={`L ${membresia.monto_pagado?.toLocaleString('es-HN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                  color="success"
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell>
                {membresia.descuento_aplicado
                  ? `${membresia.descuento_aplicado}%`
                  : 'Sin descuento'}
              </TableCell>
              <TableCell>
                {(() => {
                  const monto = Number(membresia.monto_pagado) || 0;
                  const descuento = Number(membresia.descuento_aplicado) || 0;
                  const montoFinal =
                    descuento > 0 ? monto - (monto * descuento) / 100 : monto;
                  return (
                    <Chip
                      label={`L ${montoFinal.toLocaleString('es-HN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                      color="primary"
                      size="small"
                    />
                  );
                })()}
              </TableCell>
              <TableCell>
                <Chip
                  label={membresia.estado}
                  color={getEstadoColor(membresia.estado)}
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                <IconButton color="primary" onClick={() => onEdit(membresia)} size="small">
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(membresia.id)} size="small">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
              <Typography variant="body1" color="text.secondary">
                {busqueda
                  ? 'No se encontraron membresías que coincidan con la búsqueda'
                  : 'No hay membresías registradas'}
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
    <TablePagination
      component="div"
      count={totalCount}
      page={page}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={[5, 10, 15, 25]}
      labelRowsPerPage="Filas por página:"
      labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
    />
  </TableContainer>
);

export default MembresiaTable;
