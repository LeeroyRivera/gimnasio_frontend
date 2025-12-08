import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Avatar,
  TablePagination,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  FitnessCenter as FitnessCenterIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const EquipoTable = ({
  data,
  onEdit,
  onDelete,
  onViewDetails,
  getEstadoColor,
  busqueda,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
}) => {
  return (
    <TableContainer component={Paper} elevation={3}>
      <Table>
        <TableHead sx={{ bgcolor: "primary.main" }}>
          <TableRow>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Imagen
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Nombre
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Marca/Modelo
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Serie
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Categoría
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Ubicación
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Costo
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
              Estado
            </TableCell>
            <TableCell
              sx={{ color: "white", fontWeight: "bold" }}
              align="center"
            >
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((equipo) => (
              <TableRow
                key={equipo.id}
                sx={{ "&:hover": { bgcolor: "action.hover" } }}
              >
                <TableCell>
                  {equipo.foto ? (
                    <Avatar
                      src={`${API_BASE}/${equipo.foto}`}
                      alt={equipo.nombre_equipo}
                      variant="rounded"
                      sx={{ width: 56, height: 56 }}
                    />
                  ) : (
                    <Avatar variant="rounded" sx={{ width: 56, height: 56 }}>
                      <FitnessCenterIcon />
                    </Avatar>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="500">
                    {equipo.nombre_equipo}
                  </Typography>
                </TableCell>
                <TableCell>
                  {equipo.marca} / {equipo.modelo}
                </TableCell>
                <TableCell>{equipo.numero_serie}</TableCell>
                <TableCell>
                  {equipo.categoria_equipo?.nombre_categoria || "N/A"}
                </TableCell>
                <TableCell>{equipo.ubicacion}</TableCell>
                <TableCell>
                  L{" "}
                  {equipo.costo?.toLocaleString("es-HN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell>
                  <Chip
                    label={equipo.estado}
                    color={getEstadoColor(equipo.estado)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="info"
                    onClick={() => onViewDetails(equipo)}
                    size="small"
                    title="Ver Detalles"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => onEdit(equipo)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => onDelete(equipo.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  {busqueda
                    ? "No se encontraron equipos que coincidan con la búsqueda"
                    : "No hay equipos registrados"}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 15, 25]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
      />
    </TableContainer>
  );
};

export default EquipoTable;
