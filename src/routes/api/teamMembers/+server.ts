import { db } from "$lib/server/db";
import { user, projects, tasks, teams, teamMembers } from "$lib/server/db/schema";
import { json, type RequestEvent } from "@sveltejs/kit";
import { eq, and } from "drizzle-orm";

export const GET = async () => {
    const data = await db.select().from(teamMembers);
    return json({ data });
};

export const POST = async (event: RequestEvent) => {
    const body = await event.request.json();
    const [member] = await db.insert(teamMembers).values(body).returning();
    return json({ member });
};

export const PATCH = async (event: RequestEvent) => {
    const { team_id, user_id, ...updates } = await event.request.json();
    await db.update(teamMembers)
        .set(updates)
        .where(and(eq(teamMembers.teamId, team_id), eq(teamMembers.userId, user_id)));
    return json({ success: true });
};

export const DELETE = async (event: RequestEvent) => {
    const { team_id, user_id } = await event.request.json();
    await db.delete(teamMembers)
        .where(and(eq(teamMembers.teamId, team_id), eq(teamMembers.userId, user_id)));
    return json({ success: true });
};