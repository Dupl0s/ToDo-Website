import { pgTable, serial, text, uuid, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  userId: uuid('userid').unique(),
  username: text('name').notNull(),
  email: text('email'),
/*   id: serial('id').primaryKey(),
 */  password: text('password'),
});

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  userid: uuid('userid'),
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