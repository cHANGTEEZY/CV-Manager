import useLogout from '@/hooks/use-logout';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { framerWhite } from '@/assets/images';

export const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const signout = useLogout();

  const { user } = useAuth();
  useEffect(() => {
    if (user?.aud === 'authenticated') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  return (
    <header className="border-b border-[oklch(1_0_0/8%)] bg-transparent">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <span className="flex items-center gap-1 text-lg font-medium text-[oklch(0.9_0.01_270)]">
          <img src={framerWhite} alt="framer company logo" className="h-10" />
        </span>
        {isAuthenticated ? (
          <div>
            <Popover>
              <PopoverTrigger>
                <User className="cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent className="m-0 grid w-[100px] place-content-center gap-2 border-none bg-slate-900">
                <Button
                  variant={'outline'}
                  className="w-[100px] cursor-pointer"
                >
                  <Link to={'/dashboard'}>Dashboard</Link>
                </Button>

                <Button className="w-[100px] cursor-pointer" onClick={signout}>
                  Logout
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <div className="space-x-2">
            <Link to={'/auth/signin'}>
              <Button
                variant="ghost"
                className="cursor-pointer text-[oklch(0.9_0.01_270)] hover:bg-[oklch(0.25_0.01_270)] hover:text-[oklch(0.98_0.01_270)]"
              >
                Signin
              </Button>
            </Link>
            <Link to={'/auth/signup'}>
              <Button className="cursor-pointer bg-[oklch(0.65_0.23_25)] text-[oklch(0.98_0.01_25)] hover:bg-[oklch(0.65_0.23_25/90%)]">
                Signup
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};
