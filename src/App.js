import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import RespoTabulkaRezervaci from './RespoTabulkaRezervaci';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Box, Container, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField  } from '@mui/material';

export default function App() {
  const [session, setSession] = useState(null);
  const [rezervace, setRezervace] = useState([]);
  const [editRezervace, setEditRezervace] = useState(null);

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

  const handleEdit = async () => {
    try {
      const { error } = await supabase
        .from('Rezervace')
        .update(editRezervace)
        .eq('id', editRezervace.id);

      if (error) throw error;
      
      fetchRezervace();
      setEditRezervace(null);
    } catch (error) {
      alert('Chyba při úpravě: ' + error.message);
    }
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
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: "'Montserrat', Arial, sans-serif",
                fontWeight: 700,
                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                textAlign: 'center',
                letterSpacing: '0.5px',
                mb: 2
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
                    button_label: 'Přihlásit se',
                    email_input_placeholder: 'Zadejte e-mail',
                    password_input_placeholder: 'Zadejte heslo'
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
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontFamily: "'Montserrat', Arial, sans-serif",
          fontWeight: 700,
          fontSize: { xs: '1.6rem', sm: '1.8rem', md: '2rem' },
          textAlign: 'center',
          letterSpacing: '0.5px',
          mb: 3
        }}
      >
        Admin – Rezervace
      </Typography>

      
      <RespoTabulkaRezervaci 
        rezervace={rezervace} 
        handleDelete={handleDelete}
        onEdit={setEditRezervace}
      />

      
      <Dialog open={!!editRezervace} onClose={() => setEditRezervace(null)}>
        <DialogTitle>Upravit rezervaci</DialogTitle>
        <DialogContent>
          <TextField
            label="Jméno"
            value={editRezervace?.jmeno || ''}
            onChange={(e) => setEditRezervace({ ...editRezervace, jmeno: e.target.value })}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Příjmení"
            value={editRezervace?.prijmeni || ''}
            onChange={(e) => setEditRezervace({ ...editRezervace, prijmeni: e.target.value })}
            fullWidth
            margin="normal"
          />

          <TextField
            label="E-mail"
            value={editRezervace?.email || ''}
            onChange={(e) => setEditRezervace({ ...editRezervace, email: e.target.value })}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Telefon"
            value={editRezervace?.telefon || ''}
            onChange={(e) => setEditRezervace({ ...editRezervace, telefon: e.target.value })}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Služba"
            value={editRezervace?.sluzba || ''}
            onChange={(e) => setEditRezervace({ ...editRezervace, sluzba: e.target.value })}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Datum"
            type="date"
            value={editRezervace?.datum || ''}
            onChange={(e) => setEditRezervace({ ...editRezervace, datum: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Čas"
            type="time"
            value={editRezervace?.cas || ''}
            onChange={(e) => setEditRezervace({ ...editRezervace, cas: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditRezervace(null)}>Zrušit</Button>
          <Button 
            onClick={handleEdit}
            color="primary" 
            variant="contained"
          >
            Uložit
          </Button>
        </DialogActions>
      </Dialog>

      <Button
        variant="outlined"
        color="secondary"
        sx={{ mt: 5, fontWeight: 600, display: 'block', mx: 'auto' }}
        onClick={() => supabase.auth.signOut()}
      >
        Odhlásit se
      </Button>
    </Container>
  );
}