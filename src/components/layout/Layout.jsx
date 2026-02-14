import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-ocean-pattern">
      {/* Fixed overlay gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-abyss via-abyss-blue/50 to-abyss opacity-90" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 10% 0%, rgba(0, 255, 190, 0.15), transparent 50%),
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
