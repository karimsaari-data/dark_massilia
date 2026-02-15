import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed background image - Calanques de Marseille */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Background image with parallax effect */}
        <div className="absolute inset-0 bg-hero-ocean" />

        {/* Overlay sombre pour lisibilité du contenu */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-abyss/95" />

        {/* Gradient radial pour effet de profondeur */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 10% 0%, rgba(33, 196, 123, 0.15), transparent 50%),
              radial-gradient(circle at 90% 100%, rgba(0, 145, 255, 0.15), transparent 50%)
            `,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16 md:pt-20">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
