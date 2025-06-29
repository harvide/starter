import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardAction,
    CardFooter,
} from "@repo/ui/components/card"
import { Badge } from "@repo/ui/components/badge"
import { FaUser } from "react-icons/fa"
import { Skeleton } from "@repo/ui/components/skeleton";
import { auth } from "@repo/auth";
// import { showToast } from "@repo/ui/lib/toast";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

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
                <div className="line-clamp-1 flex gap-2 font-medium items-center" >
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
    | "active_sessions_now"
    | "new_users_month"
    | "total_revenue"
    | "revenue_month"
    | "mrr"
    | "arpu"
    | "new_customers"
    | "active_subscribers"
    | "growth_rate"

export async function resolveMetricCard(type: MetricType): Promise<MetricCardData> {
    const ctx = await auth.$context;

    switch (type) {
        case "total_users": {
            let total = 0;
            try {
                total = await ctx.adapter.count({
                    model: "user"
                })
            } catch (error) {
                console.error("Error fetching total users:", error);
                // todo fix
                // showToast.error("Failed to fetch total users. Please try again later.");
            }

            return {
                id: "total_users",
                label: "Total Users",
                value: total,
                badge: {
                    value: "",
                    icon: <FaUser className="size-4" />,
                    positive: true,
                },
                footer: {
                    title: "Total registered users",
                    subtitle: "All time",
                    icon: <FaUser />,
                },
            }
        }
        case "new_users_month": {
            const now = new Date()
            const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

            let total = 0
            let previous = 0

            try {
                // This month
                total = await ctx.adapter.count({
                    model: "user",
                    where: [
                        {
                            field: "createdAt",
                            operator: "gte",
                            value: startOfThisMonth,
                        },
                    ],
                })

                // Last month
                previous = await ctx.adapter.count({
                    model: "user",
                    where: [
                        {
                            field: "createdAt",
                            operator: "gte",
                            value: startOfLastMonth,
                        },
                        {
                            field: "createdAt",
                            operator: "lt",
                            value: startOfThisMonth,
                        },
                    ],
                })
            } catch (error) {
                console.error("Error fetching new users monthly comparison:", error)
            }

            const deltaRaw = total - previous
            const deltaPercent = previous === 0 ? (deltaRaw / 0.01) : (deltaRaw / previous) * 100
            const isPositive = deltaPercent === null || deltaPercent >= 0

            return {
                id: "new_users_month",
                label: "Users This Month",
                value: total,
                badge: {
                    value: deltaPercent === null ? "N/A" : `${deltaPercent > 0 ? "+" : ""}${deltaPercent.toFixed(1)}%`,
                    icon: isPositive ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />,
                    positive: isPositive,
                },
                footer: {
                    title:
                        deltaPercent === null
                            ? "No previous data"
                            : isPositive
                                ? "Growth from last month"
                                : "Drop from last month",
                    subtitle: `${previous.toLocaleString()} in previous month`,
                    icon: isPositive ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />,
                },
            }
        }

        case "active_users_month": {
            const now = new Date()
            const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

            const getAllSessions = async (start: Date, end?: Date) => {
                const limit = 1000
                let offset = 0
                let allSessions: any[] = []

                while (true) {
                    const whereClause = [
                        { field: "createdAt", operator: "gte" as const, value: start },
                        ...(end ? [{ field: "createdAt", operator: "lte" as const, value: end }] : []),
                    ]

                    const page = await ctx.adapter.findMany({
                        model: "session",
                        where: whereClause,
                        limit,
                        offset,
                    })

                    allSessions.push(...page)
                    if (page.length < limit) break
                    offset += limit
                }

                return allSessions
            }

            let thisMonthSessions: any[] = []
            let lastMonthSessions: any[] = []

            try {
                thisMonthSessions = await getAllSessions(startOfThisMonth)
                lastMonthSessions = await getAllSessions(startOfLastMonth, endOfLastMonth)
            } catch (error) {
                console.error("Error fetching session data:", error)
            }

            const current = new Set(thisMonthSessions.map((s) => s.userId))
            const previous = new Set(lastMonthSessions.map((s) => s.userId))

            const currentCount = current.size
            const previousCount = previous.size
            const deltaRaw = currentCount - previousCount
            const deltaPercent = previousCount === 0 ? (deltaRaw / 0.01) : (deltaRaw / previousCount) * 100
            const isPositive = deltaPercent >= 0

            return {
                id: "active_users_month",
                label: "Active This Month",
                value: currentCount,
                badge: {
                    value: deltaPercent === null ? "N/A" : `${deltaPercent > 0 ? "+" : ""}${deltaPercent.toFixed(1)}%`,
                    icon: isPositive ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />,
                    positive: isPositive,
                },
                footer: {
                    title: deltaPercent === null
                        ? "No previous data"
                        : isPositive
                            ? "Growth from last month"
                            : "Drop from last month",
                    subtitle: `${previousCount.toLocaleString()} in previous month`,
                    icon: isPositive ? <IconTrendingUp /> : <IconTrendingDown />,
                },
            }
        }

        case "active_sessions_now": {
            const now = new Date()

            let total = 0

            try {
                total = await ctx.adapter.count({
                    model: "session",
                    where: [
                        {
                            field: "expiresAt",
                            operator: "gte",
                            value: now,
                        },
                    ],
                })
            } catch (error) {
                console.error("Error fetching active sessions:", error)
            }

            return {
                id: "active_sessions_now",
                label: "Active Sessions Now",
                value: total,
                badge: {
                    value: total.toLocaleString(),
                    icon: <FaUser className="size-4" />,
                    positive: true,
                },
                footer: {
                    title: "Sessions not expired",
                    subtitle: "",
                    icon: <FaUser />,
                },
            }
        }

        case "total_revenue":
        case "revenue_month":
        case "mrr":
        case "arpu":
        case "new_customers":
        case "active_subscribers":
        case "growth_rate":
            return {
                id: type,
                label: type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
                value: "N/A",
                badge: {
                    value: "not connected",
                    icon: <FaUser className="size-4" />,
                    positive: false,
                },
                footer: {
                    title: "Unavailable",
                    subtitle: "Requires billing integration",
                    icon: <FaUser />,
                },
            }

        default:
            throw new Error(`Unsupported metric type: ${type}`)
    }
}


export function MetricCardSkeleton() {
    return (
        <Card className="@container/card">
            <CardHeader>
                <CardDescription>
                    <Skeleton className="h-4 w-24" />
                </CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    <Skeleton className="h-8 w-32" />
                </CardTitle>
                <CardAction>
                    <Skeleton className="h-5 w-20 rounded-full" />
                </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="flex gap-2 font-medium items-center">
                    <Skeleton className="h-4 w-28" />
                </div>
                <div className="text-muted-foreground">
                    <Skeleton className="h-3 w-36" />
                </div>
            </CardFooter>
        </Card>
    )
}