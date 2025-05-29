'use client';

import { useEffect } from 'react';
import { apiService } from '@/lib/api';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Initialize FingerprintJS
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const fingerprint = result.visitorId;

        // Track the visit
        await apiService.trackVisit(fingerprint);
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };

    trackVisit();
  }, []); // Run only once when component mounts

  return null; // This component doesn't render anything
} 