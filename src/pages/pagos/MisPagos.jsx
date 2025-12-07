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

const MisPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const res = await api.get("/api/pagos/pagos/mis-pagos");
        setPagos(res.data);
      } catch (err) {
        console.error("Error al cargar pagos:", err);
        setError("No se pudo cargar el historial de pagos.");
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, []);

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Mis pagos
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
                  <TableCell>Monto</TableCell>
                  <TableCell>Método</TableCell>
                  <TableCell>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pagos.map((pago) => (
                  <TableRow key={pago.id_pago || pago.id}>
                    <TableCell>
                      {pago.fecha_pago
                        ? new Date(pago.fecha_pago).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>{pago.monto}</TableCell>
                    <TableCell>{pago.metodo_pago || pago.metodo}</TableCell>
                    <TableCell>{pago.estado || "completado"}</TableCell>
                  </TableRow>
                ))}
                {pagos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No tienes pagos registrados.
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

export default MisPagos;
