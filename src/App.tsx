import { Footer } from '@/components/template/footer';
import { ThemeProvider } from '@/components/theme-provider';
import Home from '@/home/index';
import { Header } from './components/template/header';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />
      <Home />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
