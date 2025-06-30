import { auth } from '@repo/auth';
import { Badge } from '@repo/ui/components/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Skeleton } from '@repo/ui/components/skeleton';
// import { showToast } from "@repo/ui/lib/toast";
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import { FaUser } from 'react-icons/fa';

export type MetricCardData = {
  id: string;
  label: string;
  value: string | number;
  badge?: {
    value: string;
    icon: React.ReactNode;
    positive?: boolean;
  };
  footer: {
    title: string;
    subtitle: string;
    icon?: React.ReactNode;
  };
};

export function MetricCard({ label, value, badge, footer }: MetricCardData) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{label} </CardDescription>
        <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
          {value}
        </CardTitle>
        {badge && (
          <CardAction>
            <Badge variant="outline">
              {badge.icon}
              {badge.value}
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex items-center gap-2 font-medium">
          {footer.title}
          {footer.icon}
        </div>
        <div className="text-muted-foreground">{footer.subtitle}</div>
      </CardFooter>
    </Card>
  );
}

export type MetricType =
  | 'total_users'
  | 'active_users_month'
  | 'active_sessions_now'
  | 'new_users_month'
  | 'total_revenue'
  | 'revenue_month'
  | 'mrr'
  | 'arpu'
  | 'new_customers'
  | 'active_subscribers'
  | 'growth_rate';

export async function resolveMetricCard(
  type: MetricType
): Promise<MetricCardData> {
  const ctx = await auth.$context;

  switch (type) {
    case 'total_users': {
      let total = 0;
      try {
        total = await ctx.adapter.count({
          model: 'user',
        });
      } catch (_error) {
        // todo fix
        // showToast.error("Failed to fetch total users. Please try again later.");
      }

      return {
        id: 'total_users',
        label: 'Total Users',
        value: total,
        badge: {
          value: '',
          icon: <FaUser className="size-4" />,
          positive: true,
        },
        footer: {
          title: 'Total registered users',
          subtitle: 'All time',
          icon: <FaUser />,
        },
      };
    }
    case 'new_users_month': {
      const now = new Date();
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

      let total = 0;
      let previous = 0;

      try {
        // This month
        total = await ctx.adapter.count({
          model: 'user',
          where: [
            {
              field: 'createdAt',
              operator: 'gte',
              value: startOfThisMonth,
            },
          ],
        });

        // Last month
        previous = await ctx.adapter.count({
          model: 'user',
          where: [
            {
              field: 'createdAt',
              operator: 'gte',
              value: startOfLastMonth,
            },
            {
              field: 'createdAt',
              operator: 'lt',
              value: startOfThisMonth,
            },
          ],
        });
      } catch (_error) {
        console.error('Failed to fetch new users:', _error);
      }

      const deltaRaw = total - previous;
      const deltaPercent =
        previous === 0 ? deltaRaw / 0.01 : (deltaRaw / previous) * 100;
      const isPositive = deltaPercent === null || deltaPercent >= 0;

      let title: string;
      if (deltaPercent === null) {
        title = 'No previous data';
      } else if (isPositive) {
        title = 'Growth from last month';
      } else {
        title = 'Drop from last month';
      }

      return {
        id: 'new_users_month',
        label: 'Users This Month',
        value: total,
        badge: {
          value:
            deltaPercent === null
              ? 'N/A'
              : `${deltaPercent > 0 ? '+' : ''}${deltaPercent.toFixed(1)}%`,
          icon: isPositive ? (
            <IconTrendingUp className="size-4" />
          ) : (
            <IconTrendingDown className="size-4" />
          ),
          positive: isPositive,
        },
        footer: {
          title,
          subtitle: `${previous.toLocaleString()} in previous month`,
          icon: isPositive ? (
            <IconTrendingUp className="size-4" />
          ) : (
            <IconTrendingDown className="size-4" />
          ),
        },
      };
    }

    case 'active_users_month': {
      const now = new Date();
      const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      const getAllSessions = async (start: Date, end?: Date) => {
        const limit = 1000;
        const whereClause = [
          { field: 'createdAt', operator: 'gte' as const, value: start },
          ...(end
            ? [{ field: 'createdAt', operator: 'lte' as const, value: end }]
            : []),
        ];

        // First call to determine total count
        const total = await ctx.adapter.count({
          model: 'session',
          where: whereClause,
        });

        const pageCount = Math.ceil(total / limit);
        const fetches = Array.from({ length: pageCount }, (_, i) => {
          return ctx.adapter.findMany({
            model: 'session',
            where: whereClause,
            limit,
            offset: i * limit,
          });
        });

        const pages = await Promise.all(fetches);
        return pages.flat();
      };

      let thisMonthSessions: any[] = [];
      let lastMonthSessions: any[] = [];

      try {
        thisMonthSessions = await getAllSessions(startOfThisMonth);
        lastMonthSessions = await getAllSessions(
          startOfLastMonth,
          endOfLastMonth
        );
      } catch (_error) {
        console.error('Failed to fetch sessions:', _error);
        // showToast.error("Failed to fetch active users. Please try again later.");
      }

      const current = new Set(thisMonthSessions.map((s) => s.userId));
      const previous = new Set(lastMonthSessions.map((s) => s.userId));

      const currentCount = current.size;
      const previousCount = previous.size;
      const deltaRaw = currentCount - previousCount;
      const deltaPercent =
        previousCount === 0
          ? deltaRaw / 0.01
          : (deltaRaw / previousCount) * 100;
      const isPositive = deltaPercent >= 0;

      let title: string;

      if (deltaPercent === null) {
        title = 'No previous data';
      } else if (isPositive) {
        title = 'Growth from last month';
      } else {
        title = 'Drop from last month';
      }

      return {
        id: 'active_users_month',
        label: 'Active This Month',
        value: currentCount,
        badge: {
          value:
            deltaPercent === null
              ? 'N/A'
              : `${deltaPercent > 0 ? '+' : ''}${deltaPercent.toFixed(1)}%`,
          icon: isPositive ? (
            <IconTrendingUp className="size-4" />
          ) : (
            <IconTrendingDown className="size-4" />
          ),
          positive: isPositive,
        },
        footer: {
          title: title,
          subtitle: `${previousCount.toLocaleString()} in previous month`,
          icon: isPositive ? <IconTrendingUp /> : <IconTrendingDown />,
        },
      };
    }

    case 'active_sessions_now': {
      const now = new Date();

      let total = 0;

      try {
        total = await ctx.adapter.count({
          model: 'session',
          where: [
            {
              field: 'expiresAt',
              operator: 'gte',
              value: now,
            },
          ],
        });
      } catch (_error) {
        console.error('Failed to fetch active sessions:', _error);
        // showToast.error("Failed to fetch active sessions. Please try again later.");
      }

      return {
        id: 'active_sessions_now',
        label: 'Active Sessions Now',
        value: total,
        badge: {
          value: total.toLocaleString(),
          icon: <FaUser className="size-4" />,
          positive: true,
        },
        footer: {
          title: 'Sessions not expired',
          subtitle: '',
          icon: <FaUser />,
        },
      };
    }

    case 'total_revenue':
    case 'revenue_month':
    case 'mrr':
    case 'arpu':
    case 'new_customers':
    case 'active_subscribers':
    case 'growth_rate':
      return {
        id: type,
        label: type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        value: 'N/A',
        badge: {
          value: 'not connected',
          icon: <FaUser className="size-4" />,
          positive: false,
        },
        footer: {
          title: 'Unavailable',
          subtitle: 'Requires billing integration',
          icon: <FaUser />,
        },
      };

    default:
      throw new Error(`Unsupported metric type: ${type}`);
  }
}

export function MetricCardSkeleton() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>
          <Skeleton className="h-4 w-24" />
        </CardDescription>
        <CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
          <Skeleton className="h-8 w-32" />
        </CardTitle>
        <CardAction>
          <Skeleton className="h-5 w-20 rounded-full" />
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="flex items-center gap-2 font-medium">
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="text-muted-foreground">
          <Skeleton className="h-3 w-36" />
        </div>
      </CardFooter>
    </Card>
  );
}
