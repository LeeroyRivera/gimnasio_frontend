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
  Box,
  Avatar,
  Typography,
  Chip,
  TablePagination
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  AccountCircle as UserIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

const UsuarioTable = ({ 
  data = [], 
  onEdit, 
  onDelete,
  roles,
  getEstadoColor,
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
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Usuario</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cliente</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Teléfono</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rol</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha Registro</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((usuario) => (
              <TableRow 
                key={usuario.id_usuario}
                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      <UserIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="600">
                        {usuario.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {usuario.id_usuario}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {usuario.Cliente ? (
                    <Typography variant="body2">
                      {usuario.Cliente.nombre} {usuario.Cliente.apellido}
                    </Typography>
                  ) : (
                    <Chip label="Sin cliente" size="small" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<EmailIcon />}
                    label={usuario.email}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<PhoneIcon />}
                    label={usuario.telefono || 'N/A'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={roles.find(r => r.id_rol === usuario.id_rol)?.nombre || 'N/A'}
                    size="small"
                    color="info"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={usuario.estado}
                    color={getEstadoColor(usuario.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {usuario.fecha_registro ? new Date(usuario.fecha_registro).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="primary"
                    onClick={() => onEdit(usuario)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => onDelete(usuario.id_usuario)}
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
                    ? 'No se encontraron usuarios que coincidan con la búsqueda' 
                    : 'No hay usuarios registrados'}
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

export default UsuarioTable;
