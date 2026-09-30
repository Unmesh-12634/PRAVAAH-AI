"use client";

import React from "react";
import { KpiMetric } from "@/types/disaster";
import { MOCK_KPIS } from "@/data/mockDisasterData";
import KpiCard from "@/components/ui/KpiCard";

interface TopMetricsProps {
  selectedKpiId?: string | null;
  onSelectKpi?: (kpi: KpiMetric) => void;
}

export default function TopMetrics({
  selectedKpiId = null,
  onSelectKpi,
}: TopMetricsProps) {
  return (
    <section
      aria-label="High-Density Disaster Intelligence KPIs"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5"
    >
      {MOCK_KPIS.map((metric) => (
        <KpiCard
          key={metric.id}
          metric={metric}
          isSelected={selectedKpiId === metric.id}
          onSelect={onSelectKpi}
        />
      ))}
    </section>
  );
}
