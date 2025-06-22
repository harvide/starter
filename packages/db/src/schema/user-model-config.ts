import { getTableColumns } from "drizzle-orm";
import { user } from "./auth";

type FieldType = "string" | "boolean" | "number" | "date";

type FieldAttribute = {
    type: FieldType;
    nullable?: boolean;
};

// map drizzle type to better-auth type
function mapDrizzleTypeToAuthType(column: any): FieldAttribute {
    const t = column.dataType as string;

    if (["text", "varchar"].includes(t)) return { type: "string", nullable: !column.notNull };
    if (["boolean"].includes(t)) return { type: "boolean", nullable: !column.notNull };
    if (["timestamp", "date"].includes(t)) return { type: "date", nullable: !column.notNull };
    if (["integer", "numeric"].includes(t)) return { type: "number", nullable: !column.notNull };

    return { type: "string", nullable: !column.notNull };
}

const columns = getTableColumns(user);

const reserved = new Set(["id", "name", "email", "emailVerified", "image", "createdAt", "updatedAt"]);

const fields = {
    name: "name",
    email: "email",
    emailVerified: "emailVerified",
    image: "image",
    createdAt: "createdAt",
    updatedAt: "updatedAt",
};

const additionalFields: Record<string, FieldAttribute> = Object.entries(columns)
    .filter(([name]) => !reserved.has(name))
    .reduce((acc: Record<string, FieldAttribute>, [name, col]) => {
        acc[name] = mapDrizzleTypeToAuthType(col);
        return acc;
    }, {} as Record<string, FieldAttribute>);

export const userModel = {
    modelName: "user",
    fields,
    additionalFields,
};
// todo fix hard typing