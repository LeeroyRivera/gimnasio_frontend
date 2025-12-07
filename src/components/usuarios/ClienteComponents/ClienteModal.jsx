import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Box,
  Grid,
  TextField,
  Stack,
  IconButton,
  Typography,
  Alert
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const ClienteModal = ({ 
  open, 
  onClose, 
  formData, 
  onChange, 
  onSubmit,
  error,
  clienteSeleccionado
}) => {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">
            Editar Cliente
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
              {error}
            </Typography>
          </Alert>
        )}
        
        <Box component="form" id="cliente-form" onSubmit={handleFormSubmit}>
          <Typography variant="h6" sx={{ mb: 2, mt: 1 }}>
            Información Personal
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Nombre"
                name="nombre"
                value={formData?.nombre || ''}
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Apellido"
                name="apellido"
                value={formData?.apellido || ''}
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Tipo de Sangre"
                name="tipo_sangre"
                value={formData?.tipo_sangre || ''}
                onChange={onChange}
                placeholder="A+, O-, etc."
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Peso (kg)"
                name="peso_actual"
                value={formData?.peso_actual || ''}
                onChange={onChange}
                inputProps={{ step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Altura (m)"
                name="altura"
                value={formData?.altura || ''}
                onChange={onChange}
                inputProps={{ step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Condiciones Médicas"
                name="condiciones_medicas"
                value={formData?.condiciones_medicas || ''}
                onChange={onChange}
                placeholder="Alergias, enfermedades crónicas, lesiones, etc."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contacto de Emergencia"
                name="contacto_emergencia"
                value={formData?.contacto_emergencia || ''}
                onChange={onChange}
                placeholder="Nombre del contacto"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono de Emergencia"
                name="telefono_emergencia"
                value={formData?.telefono_emergencia || ''}
                onChange={onChange}
                placeholder="Número de contacto"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          form="cliente-form"
          variant="contained"
          color="primary"
        >
          Actualizar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClienteModal;
