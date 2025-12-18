'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { 
  generateVisitorId, 
  registerVisitor, 
  updateVisitorActivity, 
  removeVisitor 
} from '@/lib/visitorService';

const VISITOR_ID_KEY = 'cizgi_visitor_id';

export default function VisitorTracker() {
  const pathname = usePathname();
  const visitorIdRef = useRef(null);
  const isRegisteredRef = useRef(false);

  useEffect(() => {
    // Skip tracking for admin pages
    if (pathname?.startsWith('/admin')) return;

    const initVisitor = async () => {
      // Check if visitor already has an ID in session
      let visitorId = sessionStorage.getItem(VISITOR_ID_KEY);
      
      if (!visitorId) {
        visitorId = generateVisitorId();
        sessionStorage.setItem(VISITOR_ID_KEY, visitorId);
      }
      
      visitorIdRef.current = visitorId;
      
      // Register visitor if not already registered in this session
      if (!isRegisteredRef.current) {
        await registerVisitor(visitorId);
        isRegisteredRef.current = true;
      }
    };

    initVisitor();

    // Handle page unload
    const handleBeforeUnload = () => {
      if (visitorIdRef.current) {
        // Use sendBeacon for reliable data sending on page close
        const data = JSON.stringify({ visitorId: visitorIdRef.current });
        navigator.sendBeacon('/api/visitor-exit', data);
      }
    };

    // Handle visibility change (tab switch, minimize)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && visitorIdRef.current) {
        // Update last activity when user leaves tab
        updateVisitorActivity(visitorIdRef.current, pathname);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Update activity on page change
  useEffect(() => {
    if (visitorIdRef.current && isRegisteredRef.current && !pathname?.startsWith('/admin')) {
      updateVisitorActivity(visitorIdRef.current, pathname);
    }
  }, [pathname]);

  // Heartbeat to keep visitor active
  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;

    const heartbeat = setInterval(() => {
      if (visitorIdRef.current && isRegisteredRef.current) {
        updateVisitorActivity(visitorIdRef.current, pathname);
      }
    }, 60000); // Every minute

    return () => clearInterval(heartbeat);
  }, [pathname]);

  return null; // This component doesn't render anything
}

