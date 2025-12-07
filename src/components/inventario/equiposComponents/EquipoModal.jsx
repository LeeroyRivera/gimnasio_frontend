import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  IconButton,
  Alert,
  Box,
  MenuItem,
  Card,
  Divider,
  Avatar,
  Stack
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';

const EquipoModal = ({
  open,
  onClose,
  formData,
  onChange,
  onSubmit,
  error,
  categorias,
  equipoSeleccionado,
  imagenPreview,
  dragActive,
  handleDrag,
  handleDrop,
  handleFileInputChange,
  eliminarImagenPreview
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
            {equipoSeleccionado ? 'Editar Equipo' : 'Nuevo Equipo'}
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
        
        <Box component="form" onSubmit={handleFormSubmit} id="equipo-form">
          <Typography variant="h6" sx={{ mb: 2, mt: 1 }}>
            Información del Equipo
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Nombre del Equipo"
                name="nombre_equipo"
                value={formData.nombre_equipo}
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Marca"
                name="marca"
                value={formData.marca}
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Modelo"
                name="modelo"
                value={formData.modelo}
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Número de Serie"
                name="numero_serie"
                value={formData.numero_serie}
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha de Compra"
                name="fecha_compra"
                value={formData.fecha_compra}
                onChange={onChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Costo"
                name="costo"
                value={formData.costo}
                onChange={onChange}
                inputProps={{ step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Ubicación"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Estado"
                name="estado"
                value={formData.estado}
                onChange={onChange}
              >
                <MenuItem value="Excelente">Excelente</MenuItem>
                <MenuItem value="Bueno">Bueno</MenuItem>
                <MenuItem value="Regular">Regular</MenuItem>
                <MenuItem value="En mantenimiento">En mantenimiento</MenuItem>
                <MenuItem value="Fuera de servicio">Fuera de servicio</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                required
                label="Categoría"
                name="id_categoria"
                value={formData.id_categoria || ''}
                onChange={onChange}
              >
                <MenuItem value="">Seleccione una categoría</MenuItem>
                {categorias.map(categoria => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.nombre_categoria}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" sx={{ mb: 2 }}>
            Imagen del Equipo
          </Typography>
          
          <Card 
            variant="outlined"
            sx={{
              p: 2,
              mb: 3,
              border: dragActive ? '2px dashed #1976d2' : '2px dashed #ccc',
              bgcolor: dragActive ? 'action.hover' : 'background.paper',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover'
              }
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInputEquipo').click()}
          >
            <input
              id="fileInputEquipo"
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
            
            {imagenPreview ? (
              <Box sx={{ textAlign: 'center' }}>
                <Avatar 
                  src={imagenPreview} 
                  alt="Preview" 
                  variant="rounded"
                  sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CloseIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    eliminarImagenPreview();
                  }}
                >
                  Eliminar imagen
                </Button>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  Arrastra la imagen aquí
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  o haz clic para seleccionar un archivo
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  PNG, JPG o JPEG
                </Typography>
              </Box>
            )}
          </Card>
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
          form="equipo-form"
          variant="contained"
          color="primary"
        >
          {equipoSeleccionado ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EquipoModal;
