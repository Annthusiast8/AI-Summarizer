import { db } from "$lib/server/db";
import { user, projects, tasks, teams, teamMembers } from "$lib/server/db/schema";
import { json, type RequestEvent } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const GET = async () => {
    const data = await db.select().from(tasks);
    return json({ data });
};

export const POST = async (event: RequestEvent) => {
    const body = await event.request.json();
    const [task] = await db.insert(tasks).values({
        title: body.title,
        description: body.description,
        projectId: body.projectId,
        assignedTo: body.assigned_to_name,
        status: body.status,
        deadline: new Date(body.deadline),
        createdBy: body.created_by_name,
      }).returning();
    return json({ task });
};

export const PATCH = async (event: RequestEvent) => {
    const body = await event.request.json();
  
    const { id, deadline, ...rest } = body;
  
    if (!id) {
      return json({ error: "Missing task ID." }, { status: 400 });
    }
  
    const updates: Record<string, any> = { ...rest };
  
    if (deadline !== undefined) {
      try {
        updates.deadline = new Date(deadline);
      } catch (error) {
        return json({ error: "Invalid deadline format." }, { status: 400 });
      }
    }
  
    await db.update(tasks).set(updates).where(eq(tasks.id, id));
    return json({ success: true });
  };

  export const DELETE = async (event: RequestEvent) => {
    try {
      const { id } = await event.request.json();
  
      if (!id) {
        return json({ error: "Task ID is required." }, { status: 400 });
      }
  
      await db.delete(tasks).where(eq(tasks.id, id));
      return json({ success: true });
    } catch (error) {
      console.error("DELETE task error:", error);
      return json({ error: "Failed to delete task." }, { status: 500 });
    }
  };