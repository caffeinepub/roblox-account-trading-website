import { Link, useRouter } from '@tanstack/react-router';
import { Zap, PlusCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neon/20 bg-surface/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/assets/generated/brainrot-icon.dim_128x128.png"
            alt="Brainrot Trade Hub"
            className="w-10 h-10 rounded-lg object-cover"
          />
          <span className="font-black text-xl tracking-tight text-foreground group-hover:text-neon transition-colors">
            BRAINROT <span className="text-neon">TRADE HUB</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-2">
          <Link to="/">
            <Button
              variant={currentPath === '/' ? 'default' : 'ghost'}
              size="sm"
              className="font-bold gap-2"
            >
              <Home size={16} />
              <span className="hidden sm:inline">Listings</span>
            </Button>
          </Link>
          <Link to="/post-trade">
            <Button
              variant={currentPath === '/post-trade' ? 'default' : 'outline'}
              size="sm"
              className="font-bold gap-2 border-neon text-neon hover:bg-neon hover:text-black"
            >
              <PlusCircle size={16} />
              <span className="hidden sm:inline">Post Trade</span>
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
