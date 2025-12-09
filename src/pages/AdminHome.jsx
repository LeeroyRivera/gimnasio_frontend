import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  People as PeopleIcon,
  AccessTime as AccessTimeIcon,
  FitnessCenter as FitnessIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/http";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const AdminHome = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const resp = await api.get("/api/dashboard/admin/hoy");
        setData(resp.data);
      } catch (err) {
        console.error("Error al cargar dashboard admin:", err);
        setError("No se pudo cargar el dashboard de hoy");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const hoy = new Date();
  const fechaLarga = hoy.toLocaleDateString("es-HN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb", py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Panel de Administrador
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Bienvenido{user ? `, ${user.username}` : ""}. Hoy es {fechaLarga}.
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
                >
                  <FitnessIcon color="primary" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Asistencias totales de hoy
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {loading || !data ? "-" : data.asistenciasTotalesHoy}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
                >
                  <PeopleIcon color="success" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Asistencias activas ahora
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {loading || !data ? "-" : data.asistenciasActivasAhora}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
                >
                  <AccessTimeIcon color="warning" />
                  <Typography variant="subtitle2" color="text.secondary">
                    Promedio de tiempo (minutos)
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {loading || !data
                    ? "-"
                    : data.promedioDuracionMinutosHoy || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <BarChartIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Asistencias de hoy por tipo de membresía
            </Typography>
            {data && (
              <Chip
                label={`Total: ${data.asistenciasTotalesHoy || 0}`}
                size="small"
                sx={{ ml: "auto" }}
              />
            )}
          </Box>

          <Box sx={{ width: "100%", height: 320 }}>
            {loading || !data ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", mt: 10 }}
              >
                Cargando datos...
              </Typography>
            ) : data.porMembresiaHoy?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.porMembresiaHoy}
                  margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="plan"
                    angle={-20}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#1976d2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", mt: 10 }}
              >
                No hay asistencias registradas hoy.
              </Typography>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminHome;
