import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';


// Users Table
export const user = sqliteTable('user', {
	id: integer('id').primaryKey(),
	name: text ('name').notNull().unique(),
	email: text('email').notNull(),
});

// Teams table
export const teams = sqliteTable('teams', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	createdBy: text('created_by').references(() => user.name).notNull(),
  });

  // Team members table (junction table for users and teams)
export const teamMembers = sqliteTable('team_members', {
	teamId: integer('team_id').references(() => teams.id).notNull(),
	userId: integer('user_id').references(() => user.id).notNull(),
	role: text('role').notNull(), // 'admin' | 'member'
  }, (table) => ({
	pk: primaryKey(table.teamId, table.userId),
  }));

  // Projects table
export const projects = sqliteTable('projects', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	deadline: integer('deadline', { mode: 'timestamp' }).notNull(), // Unix timestamp
	status: text('status').notNull(), // 'not_started' | 'in_progress' | 'completed'
	createdBy: text('created_by').references(() => user.name).notNull(),
	teamId: integer('team_id').references(() => teams.id).notNull(),
  });

  // Tasks table
export const tasks = sqliteTable('tasks', {
	id: integer('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description').notNull(),
	projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
	assignedTo: text('assigned_to').references(() => user.name).notNull(),
	status: text('status').notNull(), // 'todo' | 'in_progress' | 'done'
	deadline: integer('deadline', { mode: 'timestamp' }).notNull(), // Unix timestamp
	createdBy: text('created_by').references(() => user.name).notNull(),
  });