import { db } from "$lib/server/db";
import { user,projects, tasks, teams, teamMembers } from "$lib/server/db/schema";
import { json, type RequestEvent } from "@sveltejs/kit";
import { eq } from "drizzle-orm";


export const GET = async () => {
    const data = await db.select().from(user);
    return json({ data });
};

export const POST = async (event: RequestEvent) => {
    const body = await event.request.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
        return json({ error: "Invalid email format" }, { status: 400 });
    }

    const existing = await db.select().from(user).where(eq(user.email, body.email));
    if (existing.length > 0) {
        return json({ error: "Email already exists" }, { status: 409 });
    }

    const [newUser] = await db.insert(user).values(body).returning();
    return json({ newUser });
};

export const PATCH = async (event: RequestEvent) => {
    const { id, ...updates } = await event.request.json();
    await db.update(user).set(updates).where(eq(user.id, id));
    return json({ success: true });
};

export const DELETE = async (event: RequestEvent) => {
    const { id } = await event.request.json();
    await db.delete(user).where(eq(user.id, id));
    return json({ success: true });
};