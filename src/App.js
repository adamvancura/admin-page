import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import {
  Container, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, IconButton, Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function App() {
  const [session, setSession] = useState(null);
  const [rezervace, setRezervace] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchRezervace();
  }, [session]);

  const fetchRezervace = async () => {
    const { data, error } = await supabase
      .from('Rezervace')
      .select('*')
      .order('datum', { ascending: false });
    if (!error) setRezervace(data || []);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Opravdu smazat tuto rezervaci?')) return;
    await supabase.from('Rezervace').delete().eq('id', id);
    fetchRezervace();
  };

  // Pokud není přihlášený uživatel, zobrazí login formulář
  if (!session) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Přihlášení do administrace</Typography>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]} 
            localization={{
              variables: {
                sign_in: { email_label: 'E-mail', password_label: 'Heslo', button_label: 'Přihlásit se' },
                sign_up: { email_label: 'E-mail', password_label: 'Heslo', button_label: 'Registrovat' }
              }
            }}
          />
        </Paper>
      </Container>
    );
  }

  // Pokud je přihlášený, zobrazí admin rozhraní
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Admin – Rezervace</Typography>
      <Button
        variant="outlined"
        color="secondary"
        sx={{ mb: 2 }}
        onClick={() => supabase.auth.signOut()}
      >
        Odhlásit se
      </Button>
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




