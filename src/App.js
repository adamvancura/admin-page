import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Box } from '@mui/material';
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

  if (!session) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f6fa',
        }}
      >
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontFamily: '"Roboto", "Open Sans", Arial, sans-serif',
                fontWeight: 600,
                fontSize: { xs: '2rem', sm: '1.5rem', md: '2rem' },
                textAlign: 'center',
                letterSpacing: '0.3px',
                mb: 3
              }}
            >
              Přihlášení do administrace
            </Typography>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              showLinks={false}
              providers={[]}
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'E-mail',
                    password_label: 'Heslo',
                    button_label: 'Přihlásit se'
                  }
                }
              }}
            />
          </Paper>
        </Container>
      </Box>
    );
  }

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
