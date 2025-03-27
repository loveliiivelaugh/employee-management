import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { AppRouter } from '@custom/routes/Router'
import SupabaseDefaultAuth from '@components/Auth/SupabaseDefault';
import './index.css'
import { Container } from '@mui/material';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Container maxWidth="md" sx={{ width: "100vw", height: "100vh" }}>
      <SupabaseDefaultAuth />
    </Container>
  </StrictMode>,
)
