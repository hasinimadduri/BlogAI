import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { PenLine, LogOut, LayoutDashboard, Globe } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary transition-transform group-hover:scale-105">
            <PenLine className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Blog<span className="text-primary">AI</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button
            variant={location.pathname === '/' ? 'secondary' : 'ghost'}
            size="sm"
            asChild
            className="text-sm font-medium"
          >
            <Link to="/"><Globe className="mr-1.5 h-4 w-4" /> Explore</Link>
          </Button>
          {user ? (
            <>
              <Button
                variant={location.pathname.startsWith('/dashboard') ? 'secondary' : 'ghost'}
                size="sm"
                asChild
                className="text-sm font-medium"
              >
                <Link to="/dashboard"><LayoutDashboard className="mr-1.5 h-4 w-4" /> Dashboard</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut} className="text-muted-foreground hover:text-foreground">
                <LogOut className="mr-1.5 h-4 w-4" /> Sign Out
              </Button>
            </>
          ) : (
            <Button size="sm" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
