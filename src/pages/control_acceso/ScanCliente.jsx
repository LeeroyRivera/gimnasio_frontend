import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import api from "../../api/http";
import { useAuth } from "../../context/AuthContext";
import { Html5Qrcode } from "html5-qrcode";

// Página para que el cliente registre su propia entrada/salida usando el QR vigente
const ScanCliente = () => {
  const { user } = useAuth();
  const idUsuarioLocal = localStorage.getItem("id_usuario");
  const idUsuario = Number(user?.id_usuario ?? idUsuarioLocal);
  const [codigoQr, setCodigoQr] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const html5QrCodeRef = useRef(null);

  // Ya no se carga automáticamente el listado de QRs, el cliente
  // solo usa el código que escanea o escribe manualmente.

  // Detener el escáner al desmontar
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
        html5QrCodeRef.current.clear().catch(() => {});
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResultado(null);

    if (!idUsuario || Number.isNaN(idUsuario)) {
      setError("No se pudo identificar al usuario autenticado.");
      return;
    }

    if (!codigoQr.trim()) {
      setError("No hay un código QR válido para escanear.");
      return;
    }

    try {
      setLoading(true);
      const resp = await api.post("/api/control-acceso/asistencia/qr", {
        id_usuario: idUsuario,
        codigo_qr: codigoQr.trim(),
      });

      setResultado({
        tipo: "success",
        mensaje:
          resp.data?.mensaje ||
          (resp.status === 201
            ? "Tu entrada fue registrada correctamente. ¡Bienvenido!"
            : "Tu salida fue registrada correctamente. ¡Hasta pronto!"),
      });
    } catch (err) {
      console.error(err);
      const status = err.response?.status;
      let mensaje =
        err.response?.data?.error ||
        "No se pudo procesar tu acceso. Intenta nuevamente.";

      if (status === 400) {
        mensaje =
          err.response?.data?.error ||
          "Datos inválidos. Comunícate con recepción para más ayuda.";
      } else if (status === 403) {
        mensaje =
          err.response?.data?.error ||
          "El código QR está expirado o no es válido en este momento.";
      } else if (status === 404) {
        mensaje =
          err.response?.data?.error ||
          "No se encontró tu usuario o el código QR. Comunícate con recepción.";
      }

      setResultado({ tipo: "error", mensaje });
    } finally {
      setLoading(false);
    }
  };

  const iniciarEscaneo = async () => {
    // limpiar mensajes previos
    setError(null);
    setResultado(null);

    try {
      // primero marcar escaneo activo para que se renderice el contenedor
      setScanning(true);

      // esperar al siguiente ciclo de render para asegurar que el div exista
      await new Promise((resolve) => setTimeout(resolve, 0));

      const elementId = "qr-reader-cliente";
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(elementId);
      }

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          // Cuando se lee un QR, detener y enviar
          try {
            await html5QrCodeRef.current.stop();
            await html5QrCodeRef.current.clear();
          } catch {
            // ignorar errores de parada
          }
          setScanning(false);
          setCodigoQr(decodedText);

          // Enviar automáticamente con el código leído
          try {
            setLoading(true);
            const resp = await api.post("/api/control-acceso/asistencia/qr", {
              id_usuario: idUsuario,
              codigo_qr: decodedText,
            });

            setResultado({
              tipo: "success",
              mensaje:
                resp.data?.mensaje ||
                (resp.status === 201
                  ? "Tu entrada fue registrada correctamente. ¡Bienvenido!"
                  : "Tu salida fue registrada correctamente. ¡Hasta pronto!"),
            });
          } catch (err) {
            console.error(err);
            const status = err.response?.status;
            let mensaje =
              err.response?.data?.error ||
              "No se pudo procesar tu acceso. Intenta nuevamente.";

            if (status === 400) {
              mensaje =
                err.response?.data?.error ||
                "Datos inválidos. Comunícate con recepción para más ayuda.";
            } else if (status === 403) {
              mensaje =
                err.response?.data?.error ||
                "El código QR está expirado o no es válido en este momento.";
            } else if (status === 404) {
              mensaje =
                err.response?.data?.error ||
                "No se encontró tu usuario o el código QR. Comunícate con recepción.";
            }

            setResultado({ tipo: "error", mensaje });
          } finally {
            setLoading(false);
          }
        },
        () => {
          // errores de escaneo continuos se pueden ignorar
        }
      );
    } catch (err) {
      console.error("Error al iniciar escaneo", err);
      setError(
        "No se pudo acceder a la cámara o iniciar el escaneo. Revisa permisos del navegador."
      );
      setScanning(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight={700}>
            Registrar acceso con QR
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Usa esta pantalla al entrar o salir del gimnasio. El sistema usa el
            código QR vigente del día para registrar tu entrada o salida.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Código QR en uso"
              value={codigoQr}
              onChange={(e) => setCodigoQr(e.target.value)}
              size="small"
              required
              helperText={"Escanea el código o escríbelo manualmente."}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrar entrada / salida"}
            </Button>

            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={iniciarEscaneo}
              disabled={scanning || loading}
            >
              {scanning ? "Escaneando..." : "Escanear con cámara"}
            </Button>
          </Box>

          {scanning && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Apunta la cámara al código QR.
              </Typography>
              <div
                id="qr-reader-cliente"
                style={{ width: "100%", maxWidth: 320, margin: "0 auto" }}
              />
            </Box>
          )}

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

export default ScanCliente;
