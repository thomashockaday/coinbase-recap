import { Footer } from '@/components/template/footer';
import Home from '@/home/index';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Header } from './components/template/header';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Header />
    <Home />
    <Footer />
  </StrictMode>
);
