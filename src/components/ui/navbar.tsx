
import { Link } from "react-router-dom";
import { Search, Calendar, Bell, User, Menu } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40 transition-all">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-primary" />
            <span className="text-xl font-semibold text-gradient">Slate</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/events" className="text-foreground/80 hover:text-foreground transition-colors">
              Browse
            </Link>
            <Link to="/calendar" className="text-foreground/80 hover:text-foreground transition-colors">
              Calendar
            </Link>
            <Link to="/categories" className="text-foreground/80 hover:text-foreground transition-colors">
              Categories
            </Link>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events..."
              className="apple-input pl-9 w-[200px] h-9 text-sm"
            />
          </div>

          <button className="p-2 rounded-full hover:bg-secondary/50 transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          
          <Link to="/profile">
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
          </Link>
        </div>
        
        <button 
          className="md:hidden p-2 rounded-full hover:bg-secondary/50 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-4 py-2 space-y-3 bg-secondary/50 glass-morphism">
            <Link 
              to="/events" 
              className="block px-3 py-2 rounded-md hover:bg-secondary/80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse
            </Link>
            <Link 
              to="/calendar" 
              className="block px-3 py-2 rounded-md hover:bg-secondary/80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Calendar
            </Link>
            <Link 
              to="/categories" 
              className="block px-3 py-2 rounded-md hover:bg-secondary/80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events..."
                className="apple-input pl-9 w-full h-9 text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
