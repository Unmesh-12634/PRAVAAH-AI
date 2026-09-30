import React, { useState, useRef } from 'react';
import { useSimulationEngine } from '../simulation/simulationEngine';
import { DisasterMap } from './DisasterMap';
import { TopBar } from './hud/TopBar';
import { Timeline } from './hud/Timeline';
import { LayerControls } from './hud/LayerControls';
import { InfoPanel } from './hud/InfoPanel';

interface DisasterSimulationPageProps {
  onExit: () => void;
  compactMode?: boolean;
}

export const DisasterSimulationPage: React.FC<DisasterSimulationPageProps> = ({ onExit, compactMode = false }) => {
  const engine = useSimulationEngine();
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(false);
  const [google3DStatus, setGoogle3DStatus] = useState<'idle' | 'active' | 'satellite'>('satellite');
  const [importedKmlName, setImportedKmlName] = useState<string | null>(null);
  const focusCycloneRef = useRef<(() => void) | null>(null);

  if (compactMode) {
    return (
      <div className="w-full h-full bg-[#060a11] overflow-hidden select-none relative">
        <DisasterMap
          engine={engine}
          onRegisterFocusCyclone={(fn) => {
            focusCycloneRef.current = fn;
          }}
          onStatusChange={(status, kmlName) => {
            setGoogle3DStatus(status);
            setImportedKmlName(kmlName);
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#060a11] overflow-hidden select-none z-50">
      {/* 1. Primary 3D Geospatial Map Canvas (Base Layer) */}
      <DisasterMap
        engine={engine}
        onRegisterFocusCyclone={(fn) => {
          focusCycloneRef.current = fn;
        }}
        onStatusChange={(status, kmlName) => {
          setGoogle3DStatus(status);
          setImportedKmlName(kmlName);
        }}
      />

      {/* 2. Top HUD Bar: Mission Title, Cyclone Telemetry, Controls & Exit */}
      <TopBar
        engine={engine}
        isLayerPanelOpen={isLayerPanelOpen}
        onToggleLayerPanel={() => setIsLayerPanelOpen((p) => !p)}
        onExit={onExit}
        google3DStatus={google3DStatus}
        importedKmlName={importedKmlName}
      />

      {/* 3. Floating Layer Controls Drawer */}
      <LayerControls
        isOpen={isLayerPanelOpen}
        onClose={() => setIsLayerPanelOpen(false)}
        layers={engine.layers}
        cameraState={engine.cameraState}
        onToggleLayer={engine.toggleLayer}
        onToggleCameraFollow={engine.toggleCameraFollow}
      />

      {/* 4. Floating Critical Infrastructure Telemetry Popup */}
      <InfoPanel
        infrastructure={engine.selectedInfrastructure}
        onClose={() => engine.setSelectedInfrastructure(null)}
      />

      {/* 5. Bottom Simulation Timeline & Scrubber Dock */}
      <Timeline
        engine={engine}
        onFocusCyclone={() => focusCycloneRef.current?.()}
      />
    </div>
  );
};
