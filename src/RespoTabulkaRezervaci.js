import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, Stack, Typography, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function RespoTabulkaRezervaci({ rezervace, handleDelete, onEdit }) { 
  const isMobile = window.innerWidth < 600;

  if (isMobile) {
    return (
      <Stack spacing={2} sx={{ mt: 2 }}>
        {rezervace.map(r => (
          <Paper key={r.id} elevation={2} sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {r.jmeno} {r.prijmeni}
            </Typography>
            <Typography variant="body2">Tel: {r.telefon}</Typography>
            <Typography variant="body2">Email: {r.email}</Typography>
            <Typography variant="body2">Služba: {r.sluzba}</Typography>
            <Typography variant="body2">Datum: {r.datum}, {r.cas}</Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              <IconButton color="primary" onClick={() => onEdit(r)}>
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={() => handleDelete(r.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))}
        {rezervace.length === 0 && (
          <Typography align="center" color="text.secondary">Žádné rezervace.</Typography>
        )}
      </Stack>
    );
  }

  return (
    <Paper elevation={3} sx={{ overflowX: 'auto' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Jméno</TableCell>
            <TableCell>Telefon</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Služba</TableCell>
            <TableCell>Datum</TableCell>
            <TableCell>Čas</TableCell>
            <TableCell align="center">Upravit</TableCell>
            <TableCell align="center">Smazat</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          
          {rezervace.map(r => (
            <TableRow key={r.id}>
              <TableCell>{r.jmeno} {r.prijmeni}</TableCell>
              <TableCell>{r.telefon}</TableCell>
              <TableCell>{r.email}</TableCell>
              <TableCell>{r.sluzba}</TableCell>
              <TableCell>{r.datum}</TableCell>
              <TableCell>{r.cas}</TableCell>
              <TableCell align="center">
                <IconButton color="primary" onClick={() => onEdit(r)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell align="center">
                <IconButton color="error" onClick={() => handleDelete(r.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}

          {rezervace.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center">Žádné rezervace.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}