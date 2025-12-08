import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Navbar from "../../components/Navbar";
import api from "../../api/http";

const ScanResult = () => {
  const [form, setForm] = useState({ id_usuario: "", codigo_qr: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Cargar automáticamente el QR activo más reciente para evitar escribirlo a mano
  useEffect(() => {
    const fetchUltimoQr = async () => {
      try {
        setQrLoading(true);
        const resp = await api.get("/api/control-acceso/codigo-qr/listar");
        const codigos = resp.data || [];

        const ahora = new Date();
        const activoVigente = codigos.find((c) => {
          if (!c.estado || !c.fecha_Expiracion) return false;
          const exp = new Date(c.fecha_Expiracion);
          return exp > ahora;
        });

        if (activoVigente) {
          setForm((prev) => ({
            ...prev,
            codigo_qr: activoVigente.codigo_qr || "",
          }));
        }
      } catch (err) {
        console.error("Error al obtener último QR activo", err);
      } finally {
        setQrLoading(false);
      }
    };

    fetchUltimoQr();
  }, []);

  // Búsqueda de usuarios para autocompletar
  useEffect(() => {
    const term = searchTerm.trim();
    if (term.length < 2) {
      setUsuarios([]);
      return;
    }

    let cancel = false;
    const fetchUsuarios = async () => {
      try {
        setSearchLoading(true);
        const resp = await api.get("/api/usuario/buscar", {
          params: { term },
        });
        if (!cancel) {
          setUsuarios(resp.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancel) setSearchLoading(false);
      }
    };

    const timeout = setTimeout(fetchUsuarios, 300); // debounce ligero
    return () => {
      cancel = true;
      clearTimeout(timeout);
    };
  }, [searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResultado(null);

    if (!form.id_usuario || !form.codigo_qr.trim()) {
      setError("Debe seleccionar un usuario y escribir el código QR.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/control-acceso/asistencia/qr", {
        id_usuario: Number(form.id_usuario),
        codigo_qr: form.codigo_qr.trim(),
        origen: "admin-manual",
      });

      // 201 = entrada registrada, 200 = salida registrada
      setResultado({
        tipo: "success",
        mensaje:
          response.data?.mensaje ||
          (response.status === 201
            ? "Entrada registrada correctamente"
            : "Salida registrada correctamente"),
      });
    } catch (err) {
      console.error(err);
      const status = err.response?.status;
      let mensaje =
        err.response?.data?.error ||
        "Error al procesar el acceso. Intente nuevamente.";

      if (status === 400) {
        mensaje =
          err.response?.data?.error ||
          "Datos inválidos. Verifique el ID de usuario y el código QR.";
      } else if (status === 403) {
        mensaje = err.response?.data?.error || "Código QR expirado o inválido.";
      } else if (status === 404) {
        mensaje =
          err.response?.data?.error || "Usuario o código QR no encontrado.";
      }

      setResultado({ tipo: "error", mensaje });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight={700}>
            Validación de acceso por QR
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Busque al usuario por nombre o username. El campo de código QR se
            completa automáticamente con el último QR activo generado, pero
            puede modificarlo si es necesario.
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Autocomplete
              options={usuarios}
              loading={searchLoading}
              getOptionLabel={(option) => {
                const nombreCompleto = option.Cliente
                  ? `${option.Cliente.nombre || ""} ${
                      option.Cliente.apellido || ""
                    }`.trim()
                  : "";
                return nombreCompleto
                  ? `${nombreCompleto} (${option.username})`
                  : option.username || "";
              }}
              onChange={(_, value) => {
                setForm((prev) => ({
                  ...prev,
                  id_usuario: value ? value.id_usuario : "",
                }));
              }}
              onInputChange={(_, value) => {
                setSearchTerm(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Usuario (nombre o username)"
                  size="small"
                />
              )}
            />
            <TextField
              label="Código QR escaneado"
              name="codigo_qr"
              value={form.codigo_qr}
              onChange={handleChange}
              size="small"
              required
              helperText={
                qrLoading
                  ? "Cargando último código QR activo..."
                  : "Por defecto se usa el último QR activo"
              }
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Validando..." : "Validar acceso"}
            </Button>
          </Box>

          {resultado && (
            <Box sx={{ mt: 3 }}>
              <Alert severity={resultado.tipo}>{resultado.mensaje}</Alert>
            </Box>
          )}

          {error && !resultado && (
            <Box sx={{ mt: 3 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default ScanResult;
