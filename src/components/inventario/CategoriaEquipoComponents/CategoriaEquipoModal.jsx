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

const CategoriaEquipoModal = ({ 
  open, 
  onClose, 
  formData, 
  onChange, 
  onSubmit, 
  error,
  categoriaSeleccionada 
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
            {categoriaSeleccionada ? 'Editar Categoría' : 'Nueva Categoría'}
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
        
        <Box component="form" id="categoria-form" onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Nombre de Categoría"
                name="nombre_categoria"
                value={formData?.nombre_categoria || ''}
                onChange={onChange}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Descripción"
                name="descripcion"
                value={formData?.descripcion || ''}
                onChange={onChange}
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
          form="categoria-form"
          variant="contained"
          color="primary"
        >
          {categoriaSeleccionada ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoriaEquipoModal;
