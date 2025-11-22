'use client'

import React, { useEffect } from 'react';
import { initDavidAI } from 'david-ai';

export default function DavidInit() {
  useEffect(() => {
    initDavidAI(); // Initialize David AI when the app mounts
  }, []);

  // This component doesn't render anything — it just runs the init on mount.
  return null;
}
