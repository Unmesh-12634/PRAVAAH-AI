import React, { useState, useEffect } from 'react';
import { DashboardMock } from './components/DashboardMock';
import { DisasterSimulationPage } from './components/DisasterSimulationPage';

export function App() {
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const isEmbedCompact = urlParams?.get('mode') === 'compact' || urlParams?.get('embed') === 'compact';
  const isDirectSimulation = urlParams?.get('mode') === 'full' || urlParams?.get('view') === 'simulation' || (typeof window !== 'undefined' && window.location.hash === '#simulation');

  // Support direct URL query or hash navigation (?view=simulation or #simulation)
  const [inSimulation, setInSimulation] = useState<boolean>(() => {
    return isEmbedCompact || isDirectSimulation;
  });

  const enterSimulation = () => {
    setInSimulation(true);
    window.location.hash = '#simulation';
  };

  const exitSimulation = () => {
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'PRAVAAH_EXIT_3D_MAP' }, '*');
    }
    setInSimulation(false);
    window.location.hash = '';
  };

  useEffect(() => {
    const handleHashChange = () => {
      setInSimulation(window.location.hash === '#simulation' || isEmbedCompact || isDirectSimulation);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isEmbedCompact, isDirectSimulation]);

  if (isEmbedCompact) {
    return (
      <div className="w-full h-full bg-[#020617] overflow-hidden select-none relative">
        <DisasterSimulationPage onExit={exitSimulation} compactMode={true} />
      </div>
    );
  }

  if (inSimulation) {
    return <DisasterSimulationPage onExit={exitSimulation} compactMode={false} />;
  }

  return <DashboardMock onOpenSimulation={enterSimulation} />;
}

export default App;
