import { Outlet, ScrollRestoration } from 'react-router-dom';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '../components/SideBarGroup/SideBarContent';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import Search from '@/components/Search/Search';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function RootLayout() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <SidebarProvider defaultOpen>
      <ScrollRestoration />
      <AppSidebar />
      <SidebarInset>
        <motion.header
          className="bg-background sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b p-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : -20 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="text-primary flex flex-wrap items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <SidebarTrigger />
            </motion.div>
            <Search />
          </div>
          <motion.div
            whileHover={{ rotate: 10 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <Button className="p-0">
              <ModeToggle />
            </Button>
          </motion.div>
        </motion.header>
        <motion.main
          className="flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Outlet />
        </motion.main>
      </SidebarInset>
    </SidebarProvider>
  );
}
