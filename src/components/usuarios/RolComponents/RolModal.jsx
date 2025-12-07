import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  Box,
  Grid,
  Stack,
  IconButton,
  Typography,
  Alert
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const RolModal = ({ 
  open, 
  onClose, 
  formData, 
  onChange, 
  onSubmit,
  error,
  rolSeleccionado
}) => {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">
            {rolSeleccionado ? 'Editar Rol' : 'Nuevo Rol'}
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
        
        <Box component="form" id="rol-form" onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Nombre del Rol"
                name="nombre"
                value={formData?.nombre || ''}
                onChange={onChange}
                inputProps={{ maxLength: 50 }}
                helperText={`${(formData?.nombre || '').length}/50 caracteres`}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descripción"
                name="descripcion"
                value={formData?.descripcion || ''}
                onChange={onChange}
                placeholder="Describe las responsabilidades y permisos de este rol"
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
          form="rol-form"
          variant="contained"
          color="primary"
        >
          {rolSeleccionado ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RolModal;
