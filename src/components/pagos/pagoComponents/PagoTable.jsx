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
  Avatar,
  TablePagination
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const PagoTable = ({
  data,
  onEdit,
  onDelete,
  onViewDetails,
  getMetodoPagoColor,
  busqueda,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange
}) => {
  return (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead sx={{ bgcolor: 'primary.main' }}>
          <TableRow>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Comprobante</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Referencia</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cliente</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Membresía</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Monto</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Método</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Procesado Por</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((pago) => (
              <TableRow 
                key={pago.id}
                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
              >
                <TableCell>
                  {pago.comprobante ? (
                    <Avatar 
                      src={`http://localhost:3000/${pago.comprobante}`}
                      alt="Comprobante"
                      variant="rounded"
                      sx={{ width: 56, height: 56 }}
                    />
                  ) : (
                    <Avatar variant="rounded" sx={{ width: 56, height: 56 }}>
                      <ReceiptIcon />
                    </Avatar>
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<ReceiptIcon />}
                    label={pago.referencia}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="500">
                    {pago.membresia?.cliente?.nombre} {pago.membresia?.cliente?.apellido}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {pago.membresia?.plan?.nombre_plan}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={`L ${pago.monto?.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    color="primary"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={pago.metodo_pago}
                    color={getMetodoPagoColor(pago.metodo_pago)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {pago.fecha_pago ? new Date(pago.fecha_pago).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>{pago.procesadoPor?.username || 'Sistema'}</TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="info"
                    onClick={() => onViewDetails(pago)}
                    size="small"
                    title="Ver Detalles"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton 
                    color="primary"
                    onClick={() => onEdit(pago)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => onDelete(pago.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  {busqueda ? 'No se encontraron pagos que coincidan con la búsqueda' : 'No hay pagos registrados'}
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
};

export default PagoTable;
