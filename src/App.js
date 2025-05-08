import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import RespoTabulkaRezervaci from './RespoTabulkaRezervaci';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Box, Container, Typography, Paper, Button } from '@mui/material';

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

      <RespoTabulkaRezervaci rezervace={rezervace} handleDelete={handleDelete} />

      <Button
        variant="outlined"
        color="secondary"
        sx={{ mt: 5, fontWeight: 600, display: 'block', mx: 'auto' }}
        onClick={() => supabase.auth.signOut()}
      >
        Odhlásit se
      </Button>
      {/*RespoTabulka*/}
      
    </Container>
  );
}