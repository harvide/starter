import { config } from '@repo/config';
import {
  MetricCard,
  resolveMetricCard,
} from '@/components/admin/dashboard/metric-card';

export async function SectionCards() {
  return (
    <div className="grid @5xl/main:grid-cols-4 @xl/main:grid-cols-2 grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 dark:*:data-[slot=card]:bg-card">
      {config.admin.dashboard.metrics.map(async (metric, _i) => {
        const cardData = await resolveMetricCard(metric.type);
        if (!cardData) {
          return null;
        }
        return (
          <MetricCard
            badge={cardData.badge}
            footer={cardData.footer}
            id={cardData.id}
            key={cardData.id}
            label={cardData.label}
            value={cardData.value}
          />
        );
      })}
    </div>
  );
}
