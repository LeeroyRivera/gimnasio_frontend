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
  Chip,
  TablePagination
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const MantenimientoTable = ({ 
  data = [], 
  onEdit, 
  onDelete,
  getEstadoColor,
  getTipoColor,
  busqueda,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange
}) => (
  <>
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead sx={{ bgcolor: 'primary.main' }}>
          <TableRow>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Equipo</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Técnico</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Programada</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Realizada</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Costo</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((mantenimiento) => (
              <TableRow 
                key={mantenimiento.id}
                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
              >
                <TableCell>
                  <Typography variant="body1" fontWeight="500">
                    {mantenimiento.equipo?.nombre_equipo || 'N/A'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {mantenimiento.equipo?.numero_serie}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={mantenimiento.tipo_mantenimiento}
                    color={getTipoColor(mantenimiento.tipo_mantenimiento)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{mantenimiento.tecnico_responsable}</TableCell>
                <TableCell>
                  {mantenimiento.fecha_programada 
                    ? new Date(mantenimiento.fecha_programada).toLocaleDateString() 
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  {mantenimiento.fecha_realizada 
                    ? new Date(mantenimiento.fecha_realizada).toLocaleDateString() 
                    : 'Pendiente'}
                </TableCell>
                <TableCell>L {mantenimiento.costo?.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                <TableCell>
                  <Chip 
                    label={mantenimiento.estado}
                    color={getEstadoColor(mantenimiento.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="primary"
                    onClick={() => onEdit(mantenimiento)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => onDelete(mantenimiento.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  {busqueda 
                    ? 'No se encontraron mantenimientos que coincidan con la búsqueda' 
                    : 'No hay mantenimientos registrados'}
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
  </>
);

export default MantenimientoTable;
