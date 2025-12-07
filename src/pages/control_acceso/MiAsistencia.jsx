import React, { useEffect, useState } from "react";
import api from "../../api/http";
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
} from "@mui/material";
import Navbar from "../../components/Navbar";

const MiAsistencia = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAsistencias = async () => {
      try {
        const res = await api.get(
          "/api/control-acceso/asistencia/mi-asistencia"
        );
        setAsistencias(res.data);
      } catch (err) {
        console.error("Error al cargar asistencia:", err);
        setError("No se pudo cargar el historial de asistencia.");
      } finally {
        setLoading(false);
      }
    };

    fetchAsistencias();
  }, []);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Mi asistencia
        </Typography>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && !loading && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <Paper sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Hora de entrada</TableCell>
                  <TableCell>Hora de salida</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {asistencias.map((a) => (
                  <TableRow key={a.id_asistencia || a.id}>
                    <TableCell>
                      {a.fecha
                        ? new Date(a.fecha).toLocaleDateString()
                        : a.fecha_entrada
                        ? new Date(a.fecha_entrada).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {a.fecha_entrada
                        ? new Date(a.fecha_entrada).toLocaleTimeString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {a.fecha_salida
                        ? new Date(a.fecha_salida).toLocaleTimeString()
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
                {asistencias.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No tienes asistencias registradas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Container>
    </>
  );
};

export default MiAsistencia;
