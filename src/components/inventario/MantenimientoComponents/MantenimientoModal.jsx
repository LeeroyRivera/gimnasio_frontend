import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Grid, 
  TextField,
  Box,
  Stack,
  IconButton,
  Typography,
  Alert,
  MenuItem
} from '@mui/material';
import { 
  Close as CloseIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

const MantenimientoModal = ({ 
  open, 
  onClose, 
  formData, 
  onChange, 
  onSubmit,
  error,
  equipos,
  mantenimientoSeleccionado
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
            {mantenimientoSeleccionado ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'}
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
        
        <Box component="form" id="mantenimiento-form" onSubmit={handleFormSubmit}>
          <Typography variant="h6" sx={{ mb: 2, mt: 1 }}>
            Información del Mantenimiento
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                required
                label="Equipo"
                name="id_equipo"
                value={formData?.id_equipo || ''}
                onChange={onChange}
              >
                <MenuItem value="">Seleccione un equipo</MenuItem>
                {equipos.map(equipo => (
                  <MenuItem key={equipo.id} value={equipo.id}>
                    {equipo.nombre_equipo} - {equipo.numero_serie}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                required
                label="Tipo de Mantenimiento"
                name="tipo_mantenimiento"
                value={formData?.tipo_mantenimiento || 'preventivo'}
                onChange={onChange}
              >
                <MenuItem value="preventivo">Preventivo</MenuItem>
                <MenuItem value="correctivo">Correctivo</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Estado"
                name="estado"
                value={formData?.estado || 'Pendiente'}
                onChange={onChange}
              >
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="En progreso">En progreso</MenuItem>
                <MenuItem value="Completado">Completado</MenuItem>
                <MenuItem value="Cancelado">Cancelado</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Programada"
                name="fecha_programada"
                value={formData?.fecha_programada || ''}
                onChange={onChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha Realizada"
                name="fecha_realizada"
                value={formData?.fecha_realizada || ''}
                onChange={onChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Próximo Mantenimiento"
                name="proximo_mantenimiento"
                value={formData?.proximo_mantenimiento || ''}
                onChange={onChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <CalendarIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Costo"
                name="costo"
                value={formData?.costo || ''}
                onChange={onChange}
                inputProps={{ step: "0.01" }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Técnico Responsable"
                name="tecnico_responsable"
                value={formData?.tecnico_responsable || ''}
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={3}
                label="Descripción del Trabajo"
                name="descripcion_trabajo"
                value={formData?.descripcion_trabajo || ''}
                onChange={onChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Notas Adicionales"
                name="notas"
                value={formData?.notas || ''}
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
          form="mantenimiento-form"
          variant="contained"
          color="primary"
        >
          {mantenimientoSeleccionado ? 'Actualizar' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MantenimientoModal;
