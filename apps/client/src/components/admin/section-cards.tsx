import { config } from "@repo/config"
import { MetricCard, MetricCardSkeleton, resolveMetricCard } from "@/components/admin/dashboard/metric-card"

export async function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {config.admin.dashboard.metrics.map(async (metric, i) => {
        const cardData = await resolveMetricCard(metric.type);
        if (!cardData) return null;
        return (
          <MetricCard
            key={cardData.id}
            id={cardData.id}
            label={cardData.label}
            value={cardData.value}
            badge={cardData.badge}
            footer={cardData.footer}
          />
        )
      })}
    </div>
  )
}
