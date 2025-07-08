import { pgTable, serial, text, uuid, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  userid: uuid('userid'),
  password: text('password'),
  email: text('email'),
});

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  userID: text('userID'), // <-- exakt wie in Neon, also 'userID'
  completed: boolean('completed'),
  deadline: text('deadline'),
  niveau: integer('niveau'),
  importance: integer('importance'),
  bereichsID: integer('bereichsID'),
  title: text('title'),
});

export const sections = pgTable('sections', {
  id: serial('id').notNull(),
  name: text('name'),
});