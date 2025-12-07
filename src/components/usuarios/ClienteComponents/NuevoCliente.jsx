import React from 'react';
import { Box, Stack, Typography, Alert } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

const NuevoCliente = ({ error, onClearError }) => (
  <>
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography 
          variant="h4" 
          component="h1" 
          fontWeight="bold" 
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <PersonIcon sx={{ mr: 2, fontSize: 40 }} color="primary" />
          Gestión de Clientes
        </Typography>
      </Stack>
    </Box>

    {error && (
      <Alert severity="error" sx={{ mb: 3 }} onClose={onClearError}>
        {error}
      </Alert>
    )}
  </>
);

export default NuevoCliente;
