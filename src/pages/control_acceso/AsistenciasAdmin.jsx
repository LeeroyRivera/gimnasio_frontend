import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import api from "../../api/http";

const AsistenciasAdmin = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    id_usuario: "",
    desde: "",
    hasta: "",
  });

  const cargarAsistencias = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (filtros.id_usuario) params.id_usuario = filtros.id_usuario;
      if (filtros.desde) params.desde = filtros.desde;
      if (filtros.hasta) params.hasta = filtros.hasta;

      const response = await api.get("/api/control-acceso/asistencia", {
        params,
      });

      setAsistencias(response.data.asistencias || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Error al cargar las asistencias. Intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAsistencias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    cargarAsistencias();
  };

  const handleLimpiar = () => {
    setFiltros({ id_usuario: "", desde: "", hasta: "" });
    cargarAsistencias();
  };

  const formatDateTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    return date.toLocaleString();
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={700}>
          Asistencias (Administración)
        </Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <form onSubmit={handleBuscar}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                alignItems: "center",
              }}
            >
              <TextField
                label="ID Usuario"
                name="id_usuario"
                type="number"
                size="small"
                value={filtros.id_usuario}
                onChange={handleChange}
              />
              <TextField
                label="Desde"
                name="desde"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={filtros.desde}
                onChange={handleChange}
              />
              <TextField
                label="Hasta"
                name="hasta"
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={filtros.hasta}
                onChange={handleChange}
              />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Buscando..." : "Buscar"}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleLimpiar}
                  disabled={loading}
                >
                  Limpiar
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Paper sx={{ p: 2 }}>
          {asistencias.length === 0 ? (
            <Typography align="center">
              No se encontraron asistencias con los filtros actuales.
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Fecha Entrada</TableCell>
                  <TableCell>Fecha Salida</TableCell>
                  <TableCell>Duración (min)</TableCell>
                  <TableCell>Tipo Acceso</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Código QR</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {asistencias.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.id}</TableCell>
                    <TableCell>
                      {a.Usuario
                        ? `${a.Usuario.username} (${a.Usuario.email})`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {a.Usuario?.Cliente
                        ? `${a.Usuario.Cliente.nombre} ${a.Usuario.Cliente.apellido}`
                        : "-"}
                    </TableCell>
                    <TableCell>{formatDateTime(a.fecha_entrada)}</TableCell>
                    <TableCell>{formatDateTime(a.fecha_salida)}</TableCell>
                    <TableCell>{a.duracion_minutos ?? "-"}</TableCell>
                    <TableCell>{a.tipo_acceso}</TableCell>
                    <TableCell>{a.estado_acceso}</TableCell>
                    <TableCell>
                      {a.CodigoQrAcceso
                        ? `${a.CodigoQrAcceso.codigo_qr} (${a.CodigoQrAcceso.tipo_codigo})`
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default AsistenciasAdmin;
