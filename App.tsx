
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Ministries from './pages/Ministries';
import AIGuidance from './pages/AIGuidance';
import Sermons from './pages/Sermons';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Give from './pages/Give';
import Contact from './pages/Contact';
import LiveStream from './pages/LiveStream';
import Preaching from './pages/Preaching';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  // Safe route management
  const [currentPath, setCurrentPath] = useState(() => {
    const hash = window.location.hash;
    return (hash && hash.startsWith('#/')) ? hash : '#/';
  });

  useEffect(() => {
    const handleHashChange = () => {
      let hash = window.location.hash;
      if (!hash || hash === '#' || hash === '') {
        hash = '#/';
      }
      setCurrentPath(hash);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (currentPath) {
      case '#/': return <Home />;
      case '#/about': return <About />;
      case '#/ministries': return <Ministries />;
      case '#/ai-guidance': return <AIGuidance />;
      case '#/sermons': return <Sermons />;
      case '#/events': return <Events />;
      case '#/gallery': return <Gallery />;
      case '#/give': return <Give />;
      case '#/contact': return <Contact />;
      case '#/watch-live': return <LiveStream />;
      case '#/preaching': return <Preaching />;
      case '#/admin': return <AdminDashboard />;
      default: return <Home />;
    }
  };

  const isAdmin = currentPath === '#/admin';

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-amber-100 selection:text-amber-900">
      {!isAdmin && <Navbar />}
      <main className="flex-grow">
        {renderPage()}
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
};

export default App;
