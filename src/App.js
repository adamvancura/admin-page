import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import {
  Container, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


export default function App() {
  const [rezervace, setRezervace] = useState([]);

  // Načtení rezervací
  useEffect(() => {
    fetchRezervace();
  }, []);

  const fetchRezervace = async () => {
    const { data, error } = await supabase
      .from('Rezervace')
      .select('*')
      .order('datum', { ascending: false });
    if (!error) setRezervace(data || []);
  };

  // Mazání rezervace
  const handleDelete = async (id) => {
    if (!window.confirm('Opravdu smazat tuto rezervaci?')) return;
    await supabase.from('Rezervace').delete().eq('id', id);
    fetchRezervace(); // znovu načti data
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Admin – Rezervace</Typography>
      <Paper elevation={3}>
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
            {rezervace.map((r) => (
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
    </Container>
  );
}