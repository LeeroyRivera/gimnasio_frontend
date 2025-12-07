import React from 'react';
import { Box, Stack, Typography, Button, Alert } from '@mui/material';
import { AccountCircle as UserIcon, Add as AddIcon } from '@mui/icons-material';

const NuevoUsuario = ({ onOpen, disabled, size = 'large', error, onClearError }) => (
  <>
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography 
          variant="h4" 
          component="h1" 
          fontWeight="bold" 
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <UserIcon sx={{ mr: 2, fontSize: 40 }} color="primary" />
          Gestión de Usuarios
        </Typography>

        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />} 
          onClick={onOpen} 
          size={size} 
          disabled={disabled}
        >
          Nuevo Usuario
        </Button>
      </Stack>
    </Box>

    {error && (
      <Alert severity="error" sx={{ mb: 3 }} onClose={onClearError}>
        {error}
      </Alert>
    )}
  </>
);

export default NuevoUsuario;
