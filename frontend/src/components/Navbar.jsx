import { Link, useNavigate } from 'react-router-dom';
import { Search, PlusCircle, Home as HomeIcon, BarChart3, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

const Navbar = ({ searchTerm, setSearchTerm, theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
              <span className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white text-lg shadow-md">B</span>
              <span className="hidden sm:inline text-slate-900 dark:text-white">BlogApp</span>
            </Link>
            
            {/* Desktop Links */}
            <div className="hidden md:flex gap-6">
              <Link to="/" className="nav-link">
                <HomeIcon size={18} /> Home
              </Link>
              <Link to="/dashboard" className="nav-link">
                <BarChart3 size={18} /> Dashboard
              </Link>
              <Link to="/create" className="nav-link">
                <PlusCircle size={18} /> Write
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 justify-end md:flex-initial">
            <div className="relative w-full max-w-[200px] sm:max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Search..."
                className="input-field pl-10 h-10 py-0"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  navigate('/');
                }}
              />
            </div>
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
                className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
            <div className="md:hidden pt-6 pb-2 border-t border-slate-200 dark:border-slate-800 mt-4 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
                <div className="relative w-full sm:hidden mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="input-field pl-10 h-10 py-0"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      navigate('/');
                    }}
                  />
                </div>
                <Link to="/" className="nav-link py-2" onClick={() => setMobileMenuOpen(false)}>
                    <HomeIcon size={18} /> Home
                </Link>
                <Link to="/dashboard" className="nav-link py-2" onClick={() => setMobileMenuOpen(false)}>
                    <BarChart3 size={18} /> Dashboard
                </Link>
                <Link to="/create" className="nav-link py-2" onClick={() => setMobileMenuOpen(false)}>
                    <PlusCircle size={18} /> Write
                </Link>
            </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
