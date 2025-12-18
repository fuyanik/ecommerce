'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { 
  generateVisitorId, 
  registerVisitor, 
  updateVisitorActivity, 
  removeVisitor,
  cleanupStaleVisitors
} from '@/lib/visitorService';

const VISITOR_ID_KEY = 'cizgi_visitor_id';
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

export default function VisitorTracker() {
  const pathname = usePathname();
  const visitorIdRef = useRef(null);
  const isRegisteredRef = useRef(false);
  const heartbeatRef = useRef(null);

  // Register or re-register visitor
  const ensureRegistered = useCallback(async () => {
    if (pathname?.startsWith('/admin')) return;
    
    let visitorId = sessionStorage.getItem(VISITOR_ID_KEY);
    
    if (!visitorId) {
      visitorId = generateVisitorId();
      sessionStorage.setItem(VISITOR_ID_KEY, visitorId);
    }
    
    visitorIdRef.current = visitorId;
    
    // Always register/re-register to ensure we're in the active list
    await registerVisitor(visitorId);
    isRegisteredRef.current = true;
  }, [pathname]);

  useEffect(() => {
    // Skip tracking for admin pages
    if (pathname?.startsWith('/admin')) return;

    ensureRegistered();

    // Handle page unload - try multiple methods
    const handleBeforeUnload = () => {
      if (visitorIdRef.current) {
        // Use sendBeacon for reliable data sending on page close
        const data = JSON.stringify({ visitorId: visitorIdRef.current });
        navigator.sendBeacon('/api/visitor-exit', data);
      }
    };

    // Handle page hide (more reliable on mobile)
    const handlePageHide = (event) => {
      if (visitorIdRef.current) {
        const data = JSON.stringify({ visitorId: visitorIdRef.current });
        navigator.sendBeacon('/api/visitor-exit', data);
      }
    };

    // Handle visibility change (tab switch, minimize)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && visitorIdRef.current) {
        // Send exit signal when tab is hidden
        const data = JSON.stringify({ visitorId: visitorIdRef.current });
        navigator.sendBeacon('/api/visitor-exit', data);
      } else if (document.visibilityState === 'visible') {
        // Re-register when tab becomes visible again
        ensureRegistered();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname, ensureRegistered]);

  // Update activity on page change
  useEffect(() => {
    if (visitorIdRef.current && isRegisteredRef.current && !pathname?.startsWith('/admin')) {
      updateVisitorActivity(visitorIdRef.current, pathname).then(result => {
        // If update failed (doc was deleted), re-register
        if (result === null) {
          ensureRegistered();
        }
      });
    }
  }, [pathname, ensureRegistered]);

  // Heartbeat to keep visitor active - more frequent for reliability
  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;

    // Clear any existing heartbeat
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
    }

    heartbeatRef.current = setInterval(async () => {
      if (visitorIdRef.current && isRegisteredRef.current) {
        const result = await updateVisitorActivity(visitorIdRef.current, pathname);
        // If update failed, re-register
        if (result === null) {
          await ensureRegistered();
        }
      }
    }, HEARTBEAT_INTERVAL);

    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
    };
  }, [pathname, ensureRegistered]);

  // Cleanup stale visitors periodically (every 2 minutes)
  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;

    const cleanupInterval = setInterval(() => {
      cleanupStaleVisitors();
    }, 120000); // 2 minutes

    return () => clearInterval(cleanupInterval);
  }, [pathname]);

  return null; // This component doesn't render anything
}
