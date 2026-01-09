'use client';

import { useEffect } from 'react';
import axios from 'axios';

export default function Heartbeat() {
  useEffect(() => {
    const pingServer = async () => {
      try {
        const res = await axios.get(
          process.env.NEXT_PUBLIC_API_BASE_URL
        );
        console.log('💓 API alive:', res.data.message);
      } catch (err) {
        console.error('💔 API unreachable');
      }
    };

    // Initial ping
    pingServer();

    // Ping every 90 seconds
    const interval = setInterval(pingServer, 90_000);

    return () => clearInterval(interval);
  }, []);

  return null; // no UI
}
