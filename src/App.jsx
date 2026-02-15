import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Missions from './pages/Missions';
import Medias from './pages/Medias';
import Videos from './pages/Videos';
import Instagram from './pages/Instagram';
import Contact from './pages/Contact';
import Arte from './pages/Arte';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="missions" element={<Missions />} />
          <Route path="medias" element={<Medias />} />
          <Route path="videos" element={<Videos />} />
          <Route path="instagram" element={<Instagram />} />
          <Route path="arte" element={<Arte />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
