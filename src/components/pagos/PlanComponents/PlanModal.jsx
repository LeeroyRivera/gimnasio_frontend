import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Grid,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Stack,
  FormControlLabel,
  Switch,
  Button,
  Alert
} from '@mui/material';
import { Close as CloseIcon, FitnessCenter as GymIcon, PersonOutline as TrainerIcon, AccessTime as TimeIcon } from '@mui/icons-material';

const PlanModal = ({ open, onClose, formData, onChange, onSubmit, error, planSeleccionado, loading }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{planSeleccionado ? 'Editar Plan' : 'Nuevo Plan'}</Typography>
          <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>{error}</Typography>
          </Alert>
        )}

        <Box component="form" onSubmit={onSubmit}>
          <Typography variant="h6" sx={{ mb: 2, mt: 1 }}>Información del Plan</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth required label="Nombre del Plan" name="nombre_plan" value={formData.nombre_plan} onChange={onChange} inputProps={{ maxLength: 50 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Descripción" name="descripcion" value={formData.descripcion} onChange={onChange} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth required type="number" label="Duración (días)" name="duracion_dias" value={formData.duracion_dias} onChange={onChange} inputProps={{ min: 1 }} InputProps={{ startAdornment: <TimeIcon sx={{ mr: 1, color: 'action.active' }} /> }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Estado" name="estado" value={formData.estado} onChange={onChange}>
                <MenuItem value="Activa">Activa</MenuItem>
                <MenuItem value="Inactiva">Inactiva</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Beneficios del Plan</Typography>
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={<Switch checked={formData.acceso_gimnasio} onChange={onChange} name="acceso_gimnasio" color="success" />}
                      label={<Box sx={{ display: 'flex', alignItems: 'center' }}><GymIcon sx={{ mr: 1 }} color={formData.acceso_gimnasio ? 'success' : 'disabled'} /> <Typography>Acceso al Gimnasio</Typography></Box>}
                    />

                    <FormControlLabel
                      control={<Switch checked={formData.acceso_entrenador} onChange={onChange} name="acceso_entrenador" color="primary" />}
                      label={<Box sx={{ display: 'flex', alignItems: 'center' }}><TrainerIcon sx={{ mr: 1 }} color={formData.acceso_entrenador ? 'primary' : 'disabled'} /> <Typography>Entrenador Personal</Typography></Box>}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">Cancelar</Button>
        <Button onClick={onSubmit} variant="contained" color="primary">{planSeleccionado ? 'Actualizar' : 'Guardar'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlanModal;
