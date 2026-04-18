import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Editor from './pages/Editor';
import Dashboard from './pages/Dashboard';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Theme state: default to 'dark' to retain previous appearance
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} theme={theme} toggleTheme={toggleTheme} />
      <main className="container mx-auto px-6 py-8">

        <Routes>
          <Route path="/" element={<Home searchTerm={searchTerm} />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/create" element={<Editor />} />
          <Route path="/edit/:id" element={<Editor />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
