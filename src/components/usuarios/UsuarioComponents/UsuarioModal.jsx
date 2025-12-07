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
  MenuItem,
  Divider
} from '@mui/material';
import { 
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

const UsuarioModal = ({ 
  open, 
  onClose, 
  formData, 
  onChange, 
  onClienteChange,
  onSubmit,
  error,
  roles,
  usuarioSeleccionado
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
            {usuarioSeleccionado ? 'Editar Usuario' : 'Nuevo Usuario'}
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
        
        <Box component="form" id="usuario-form" onSubmit={handleFormSubmit}>
          {/* Datos de Usuario */}
          <Typography variant="h6" sx={{ mb: 2, mt: 1 }}>
            Información de la Cuenta
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Nombre de Usuario"
                name="username"
                value={formData?.username || ''}
                onChange={onChange}
                disabled={usuarioSeleccionado !== null}
                helperText={usuarioSeleccionado ? "No se puede modificar" : ""}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required={!usuarioSeleccionado}
                type="password"
                label="Contraseña"
                name="password"
                value={formData?.password || ''}
                onChange={onChange}
                helperText={usuarioSeleccionado ? "Dejar vacío para no cambiar" : "Mínimo 8 caracteres"}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email"
                name="email"
                value={formData?.email || ''}
                onChange={onChange}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                value={formData?.telefono || ''}
                onChange={onChange}
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha de Nacimiento"
                name="fecha_nacimiento"
                value={formData?.fecha_nacimiento || ''}
                onChange={onChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Género"
                name="genero"
                value={formData?.genero || ''}
                onChange={onChange}
              >
                <MenuItem value="">Seleccione</MenuItem>
                <MenuItem value="M">Masculino</MenuItem>
                <MenuItem value="F">Femenino</MenuItem>
                <MenuItem value="Otros">Otros</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                required
                label="Rol"
                name="id_rol"
                value={formData?.id_rol || ''}
                onChange={onChange}
              >
                <MenuItem value="">Seleccione un rol</MenuItem>
                {roles.map(rol => (
                  <MenuItem key={rol.id_rol} value={rol.id_rol}>
                    {rol.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Estado"
                name="estado"
                value={formData?.estado || 'activo'}
                onChange={onChange}
              >
                <MenuItem value="activo">Activo</MenuItem>
                <MenuItem value="inactivo">Inactivo</MenuItem>
                <MenuItem value="suspendido">Suspendido</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {!usuarioSeleccionado && (
            <>
              <Divider sx={{ my: 3 }} />

              {/* Datos de Cliente */}
              <Typography variant="h6" sx={{ mb: 2 }}>
                Información del Cliente
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Nombre"
                    name="nombre"
                    value={formData?.cliente?.nombre || ''}
                    onChange={onClienteChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Apellido"
                    name="apellido"
                    value={formData?.cliente?.apellido || ''}
                    onChange={onClienteChange}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Tipo de Sangre"
                    name="tipo_sangre"
                    value={formData?.cliente?.tipo_sangre || ''}
                    onChange={onClienteChange}
                    placeholder="A+, O-, etc."
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Peso (kg)"
                    name="peso_actual"
                    value={formData?.cliente?.peso_actual || ''}
                    onChange={onClienteChange}
                    inputProps={{ step: "0.01" }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Altura (m)"
                    name="altura"
                    value={formData?.cliente?.altura || ''}
                    onChange={onClienteChange}
                    inputProps={{ step: "0.01" }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Condiciones Médicas"
                    name="condiciones_medicas"
                    value={formData?.cliente?.condiciones_medicas || ''}
                    onChange={onClienteChange}
                    placeholder="Alergias, enfermedades, lesiones, etc."
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Contacto de Emergencia"
                    name="contacto_emergencia"
                    value={formData?.cliente?.contacto_emergencia || ''}
                    onChange={onClienteChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Teléfono de Emergencia"
                    name="telefono_emergencia"
                    value={formData?.cliente?.telefono_emergencia || ''}
                    onChange={onClienteChange}
                  />
                </Grid>
              </Grid>
            </>
          )}
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
          form="usuario-form"
          variant="contained"
          color="primary"
        >
          {usuarioSeleccionado ? 'Actualizar' : 'Registrar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsuarioModal;
