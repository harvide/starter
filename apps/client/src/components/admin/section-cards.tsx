import { config } from "@repo/config"
import { MetricCard, resolveMetricCard } from "@/components/admin/dashboard/metric-card"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {config.admin.dashboard.metrics.map(async (metric) => {
        const metricData = await resolveMetricCard(metric.type);
        return (
          <MetricCard
            key={metricData.id}
            id={metricData.id}
            label={metricData.label}
            value={metricData.value}
            badge={metricData.badge}
            footer={metricData.footer}
          />
        )
      })}
    </div>
  )
}
