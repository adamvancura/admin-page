import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, Stack, Typography, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function RespoTabulka({ rezervace, handleDelete }) {
  
  const isMobile = window.innerWidth < 600;

  if (isMobile) {
    return (
      <Stack spacing={2} sx={{ mt: 2 }}>
        {rezervace.map(r => (
          <Paper key={r.id} elevation={2} sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {r.jmeno} {r.prijmeni}
            </Typography>
            <Typography variant="body2">{r.email}</Typography>
            <Typography variant="body2">{r.sluzba} – {r.datum}, {r.cas}</Typography>
            <Button
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDelete(r.id)}
              sx={{ mt: 1 }}
            >
              Smazat
            </Button>
          </Paper>
        ))}
        {rezervace.length === 0 && (
          <Typography align="center" color="text.secondary">Žádné rezervace.</Typography>
        )}
      </Stack>
    );
  }

  // Na Desktopu – tabulka
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
            <TableCell>Smazat</TableCell>
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
              <TableCell>
                <IconButton color="error" onClick={() => handleDelete(r.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {rezervace.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center">Žádné rezervace.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}