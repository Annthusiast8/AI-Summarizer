import { db } from "$lib/server/db";
import { user, projects, tasks, teams, teamMembers } from "$lib/server/db/schema";
import { json, type RequestEvent } from "@sveltejs/kit";
import { eq } from "drizzle-orm";


export const GET = async () => {
    const data = await db.select().from(teams);
    return json({ data });
};

export const POST = async (event: RequestEvent) => {
    const body = await event.request.json();
    
    if (!body.name || !body.description || !body.created_by_name) {
      return json({ error: "Missing required fields" }, { status: 400 });
    }
  
    const [userRecord] = await db
      .select()
      .from(user)
      .where(eq(user.name, body.created_by_name));
  
    if (!userRecord) {
      return json({ error: "User not found" }, { status: 400 });
    }
  
    const [team] = await db.insert(teams).values({
      name: body.name,
      description: body.description,
      createdBy: userRecord.name
    }).returning();
  
    return json({ team });
  };


  export const PATCH = async (event: RequestEvent) => {
    const { id, ...rawUpdates } = await event.request.json();
  
    // Remove undefined values
    const updates = Object.fromEntries(
      Object.entries(rawUpdates).filter(([_, v]) => v !== undefined)
    );
    await db.update(teams).set(updates).where(eq(teams.id, id));
    return json({ success: true });
  };
  

export const DELETE = async (event: RequestEvent) => {
    const { name } = await event.request.json();
    await db.delete(teams).where(eq(teams.name, name));
    return json({ success: true });
};