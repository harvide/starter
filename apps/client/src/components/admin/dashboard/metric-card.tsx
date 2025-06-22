import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardAction,
    CardFooter,
} from "@repo/ui/components/card"
import { Badge } from "@repo/ui/components/badge"
import { authClient } from "@/lib/auth"

export type MetricCardData = {
    id: string
    label: string
    value: string | number
    badge?: {
        value: string
        icon: React.ReactNode
        positive?: boolean
    }
    footer: {
        title: string
        subtitle: string
        icon?: React.ReactNode
    }
}

export function MetricCard({
    label,
    value,
    badge,
    footer,
}: MetricCardData) {
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>{label} </CardDescription>
                < CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl" >
                    {value}
                </CardTitle>
                {
                    badge && (
                        <CardAction>
                            <Badge variant="outline" >
                                {badge.icon}
                                {badge.value}
                            </Badge>
                        </CardAction>
                    )
                }
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm" >
                <div className="line-clamp-1 flex gap-2 font-medium" >
                    {footer.title}
                    {footer.icon}
                </div>
                <div className="text-muted-foreground">{footer.subtitle}</div>
            </CardFooter>
        </Card>
    )
}

export type MetricType =
    | "total_users"
    | "active_users_month"
    | "new_users_month"
    | "total_revenue"
    | "revenue_month"
    | "mrr"
    | "arpu"
    | "new_customers"
    | "active_accounts"
    | "growth_rate"

export async function resolveMetricCard(type: MetricType): Promise<MetricCardData> {
    switch (type) {
        case "total_users": {
            const totalUsers = await authClient.admin.listUsers({
                query: { filterField: "banned", filterValue: "false" },
            });
            console.log(totalUsers)
            return {
                id: "total_users",
                label: "Total Users",
                value: totalUsers.data?.total || 0,
                badge: {
                    value: totalUsers.data?.total?.toLocaleString() || "0",
                    icon: <i className="icon-users" />,
                    positive: true,
                },
                footer: {
                    title: "Total registered users",
                    subtitle: "All time",
                    icon: <i className="icon-info" />,
                }
            }
        }
        default:
            throw new Error(`Unsupported metric type: ${type}`)
    }
}