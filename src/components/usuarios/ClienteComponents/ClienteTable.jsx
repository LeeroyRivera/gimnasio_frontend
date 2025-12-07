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
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocalHospital as MedicalIcon,
  FitnessCenter as FitnessIcon
} from '@mui/icons-material';

const ClienteTable = ({ 
  data = [], 
  onEdit,
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
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cliente</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Usuario</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Teléfono</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo Sangre</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Peso/Altura</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((cliente) => (
              <TableRow 
                key={cliente.id_cliente}
                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="600">
                        {cliente.nombre} {cliente.apellido}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {cliente.id_cliente}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {cliente.usuario?.username}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {cliente.usuario?.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<PhoneIcon />}
                    label={cliente.usuario?.telefono || 'N/A'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<MedicalIcon />}
                    label={cliente.tipo_sangre || 'N/A'}
                    size="small"
                    color="error"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    <Chip 
                      icon={<FitnessIcon />}
                      label={cliente.peso_actual ? `${cliente.peso_actual} kg` : 'N/A'}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                    <Chip 
                      label={cliente.altura ? `${cliente.altura} m` : 'N/A'}
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={cliente.usuario?.estado || 'activo'}
                    color={cliente.usuario?.estado === 'activo' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="primary"
                    onClick={() => onEdit(cliente)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  {busqueda 
                    ? 'No se encontraron clientes que coincidan con la búsqueda' 
                    : 'No hay clientes registrados'}
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

export default ClienteTable;
