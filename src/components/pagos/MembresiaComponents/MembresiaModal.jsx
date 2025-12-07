import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Stack,
  Typography,
  IconButton,
  Alert,
  Box,
  MenuItem
} from '@mui/material';
import { Close as CloseIcon, AttachMoney as MoneyIcon } from '@mui/icons-material';

const MembresiaModal = ({
  open,
  onClose,
  formData,
  onChange,
  onSubmit,
  error,
  clientes,
  planes,
  membresiaSeleccionada
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
    <DialogTitle>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">
          {membresiaSeleccionada ? 'Editar Membresía' : 'Nueva Membresía'}
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

      <Box component="form" onSubmit={onSubmit} id="membresia-form">
        <Typography variant="h6" sx={{ mb: 2, mt: 1 }}>
          Información de la Membresía
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              required
              label="Cliente"
              name="id_cliente"
              value={formData.id_cliente}
              onChange={onChange}
            >
              <MenuItem value="">Seleccione un cliente</MenuItem>
              {clientes.map((cliente) => (
                <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
                  {cliente.nombre} {cliente.apellido}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              required
              label="Plan de Membresía"
              name="id_plan"
              value={formData.id_plan}
              onChange={onChange}
            >
              <MenuItem value="">Seleccione un plan</MenuItem>
              {planes.map((plan) => (
                <MenuItem key={plan.id} value={plan.id}>
                  {plan.nombre_plan} - {plan.duracion_dias} días
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Fecha de Inicio"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="Fecha de Vencimiento"
              name="fecha_vencimiento"
              value={formData.fecha_vencimiento}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Monto Pagado"
              name="monto_pagado"
              value={formData.monto_pagado}
              onChange={onChange}
              inputProps={{ step: '0.01' }}
              InputProps={{
                startAdornment: <MoneyIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Descuento Aplicado (%)"
              name="descuento_aplicado"
              value={formData.descuento_aplicado}
              onChange={onChange}
              inputProps={{ min: 0, max: 100, step: '0.01' }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Monto Final (Informativo)"
              value={(() => {
                const monto = Number(formData.monto_pagado) || 0;
                const descuento = Number(formData.descuento_aplicado) || 0;
                const montoFinal = descuento > 0 ? monto - (monto * descuento) / 100 : monto;
                return `L ${montoFinal.toLocaleString('es-ES', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`;
              })()}
              InputProps={{
                readOnly: true,
                startAdornment: <MoneyIcon sx={{ mr: 1, color: 'success.main' }} />,
              }}
              sx={{
                '& .MuiInputBase-input': {
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: 'success.main',
                },
              }}
              helperText="Este es el monto que se aplicará en el pago"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Estado"
              name="estado"
              value={formData.estado}
              onChange={onChange}
            >
              <MenuItem value="Activa">Activa</MenuItem>
              <MenuItem value="Vencida">Vencida</MenuItem>
              <MenuItem value="suspendida">Suspendida</MenuItem>
              <MenuItem value="Cancelada">Cancelada</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notas Adicionales"
              name="notas"
              value={formData.notas}
              onChange={onChange}
            />
          </Grid>
        </Grid>
      </Box>
    </DialogContent>

    <DialogActions sx={{ p: 2 }}>
      <Button onClick={onClose} variant="outlined">
        Cancelar
      </Button>
      <Button type="submit" form="membresia-form" variant="contained" color="primary">
        {membresiaSeleccionada ? 'Actualizar' : 'Guardar'}
      </Button>
    </DialogActions>
  </Dialog>
);

export default MembresiaModal;
