import React from 'react';
import { Box, Stack, Typography, Button, Alert } from '@mui/material';
import { Security as SecurityIcon, Add as AddIcon } from '@mui/icons-material';

const NuevoRol = ({ onOpen, disabled, size = 'large', error, onClearError }) => (
  <>
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography 
          variant="h4" 
          component="h1" 
          fontWeight="bold" 
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <SecurityIcon sx={{ mr: 2, fontSize: 40 }} color="primary" />
          Gestión de Roles
        </Typography>

        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />} 
          onClick={onOpen} 
          size={size} 
          disabled={disabled}
        >
          Nuevo Rol
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

export default NuevoRol;
