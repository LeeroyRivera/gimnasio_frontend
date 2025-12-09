import React, { useState } from "react";
import api from "../../api/http";
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Grid,
  Chip,
} from "@mui/material";

const SesionesPage = () => {
  const [idUsuario, setIdUsuario] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [sesiones, setSesiones] = useState([]);
  const [resumen, setResumen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBuscarSesiones = async () => {
    if (!idUsuario) {
      setError("Debe ingresar un ID de usuario");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const resp = await api.get(`/api/usuarios/sesion/sesiones`, {
        params: { id_usuario: idUsuario },
      });
      setSesiones(resp.data || []);
    } catch (err) {
      console.error("Error al cargar sesiones:", err);
      setError("Error al cargar sesiones del usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleBuscarResumen = async () => {
    setError("");
    setLoading(true);
    try {
      const params = {};
      if (desde) params.desde = desde;
      if (hasta) params.hasta = hasta;
      const resp = await api.get(`/api/usuarios/sesion/sesiones-por-dia`, {
        params,
      });
      setResumen(resp.data || []);
    } catch (err) {
      console.error("Error al cargar resumen de sesiones:", err);
      setError("Error al cargar resumen de sesiones");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa", py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Sesiones de Usuarios
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Módulo solo para administradores. Permite consultar sesiones activas y
          el historial agrupado por día.
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }} elevation={3}>
              <Typography variant="h6" gutterBottom>
                Sesiones por usuario
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  label="ID Usuario"
                  type="number"
                  size="small"
                  value={idUsuario}
                  onChange={(e) => setIdUsuario(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={handleBuscarSesiones}
                  disabled={loading}
                >
                  Buscar
                </Button>
              </Box>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID Sesión</TableCell>
                      <TableCell>Fecha Inicio</TableCell>
                      <TableCell>Fecha Expiración</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>IP</TableCell>
                      <TableCell>Dispositivo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sesiones.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No hay sesiones para mostrar
                        </TableCell>
                      </TableRow>
                    ) : (
                      sesiones.map((s) => (
                        <TableRow key={s.id_sesion}>
                          <TableCell>{s.id_sesion}</TableCell>
                          <TableCell>
                            {s.fecha_inicio
                              ? new Date(s.fecha_inicio).toLocaleString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {s.fecha_expiracion
                              ? new Date(s.fecha_expiracion).toLocaleString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={s.estado}
                              size="small"
                              color={
                                s.estado === "activa"
                                  ? "success"
                                  : s.estado === "cerrada"
                                  ? "default"
                                  : "warning"
                              }
                            />
                          </TableCell>
                          <TableCell>{s.ip}</TableCell>
                          <TableCell>{s.dispositivo}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }} elevation={3}>
              <Typography variant="h6" gutterBottom>
                Resumen de sesiones por día
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                <TextField
                  label="Desde"
                  type="date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                />
                <TextField
                  label="Hasta"
                  type="date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={handleBuscarResumen}
                  disabled={loading}
                >
                  Filtrar
                </Button>
              </Box>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Día</TableCell>
                      <TableCell align="right">Total sesiones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {resumen.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} align="center">
                          No hay datos para el rango seleccionado
                        </TableCell>
                      </TableRow>
                    ) : (
                      resumen.map((r, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{r.dia}</TableCell>
                          <TableCell align="right">{r.total}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SesionesPage;
