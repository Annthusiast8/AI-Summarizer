import { db } from "$lib/server/db";
import { projects, tasks, teams, teamMembers } from "$lib/server/db/schema";
import { json, type RequestEvent } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const GET = async () => {
    const data = await db.select().from(projects);
    return json({ data });
};

export const POST = async (event: RequestEvent) => {
    const body = await event.request.json();
    const [project] = await db.insert(projects).values({
        name: body.name,
        description: body.description,
        deadline: new Date(body.deadline),
        status: body.status,
        createdBy: body.created_by_name, 
        teamId: body.teamId,
      }).returning();

      return json({ project });
  };

  export const PATCH = async (event: RequestEvent) => {
    try {
      const body = await event.request.json();
      const { id, deadline, ...rest } = body;
  
      if (!id) {
        return json({ error: "Missing project ID." }, { status: 400 });
      }
  
      const updates: Record<string, any> = {
        ...rest,
      };
  
      if (deadline !== undefined && deadline !== null) {
        updates.deadline = new Date(deadline);
      }
  
      // Remove undefineds
      Object.keys(updates).forEach((key) => {
        if (updates[key] === undefined) {
          delete updates[key];
        }
      });
  
      await db.update(projects).set(updates).where(eq(projects.id, id));
      return json({ success: true });
    } catch (error) {
      console.error("PATCH error (projects):", error);
      return json({ error: "Failed to update project." }, { status: 500 });
    }
  };
  
  export const DELETE = async (event: RequestEvent) => {
    const { id } = await event.request.json();
    await db.delete(projects).where(eq(projects.id, id));
    return json({ success: true });
};
