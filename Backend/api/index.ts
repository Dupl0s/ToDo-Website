import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from '../src/db/index';
import { users, todos, sections } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import { uuid } from 'drizzle-orm/gel-core';
 
const app = express();
app.use(cors());
app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    res.json({ users: allUsers });
  } catch (error) {
    res.status(500).json({ message: "DB error", error: error.message });
  }
});
app.post("/users", async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const inserted = await db.insert(users).values({ name }).returning();
    res.status(201).json({ user: inserted[0] });
  } catch (error) {
    res.status(500).json({ message: "DB error", error: error.message });
  }
});

const Port = 3000;
app.listen(Port, () => {
  console.log(`Server started at http://localhost:${Port}`);
});

//todos

app.get("/todos/{userID}", async (req, res) => {
  try {
    const {userID} = req.query;
    const allTodos = await db.select().from(todos).where(
      userID ? eq(todos.userID, String(userID)) : undefined);
    res.json({ todos: allTodos });
  } catch (error) {
    res.status(500).json({ message: "DB error", error: error.message });
  }
});

app.get("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const todoInBereich = await db.select().from(todos).where(eq(todos.bereichsID, Number(id)));
    res.json({ todo: todoInBereich });
  } catch (error) {
    res.status(500).json({ message: "DB error", error: error.message });
  }
});

app.post("/todos", async (req: Request, res: Response) => {
  const { title, userID, bereichsID, deadline, importance, niveau, completed } = req.body;
  try {
    const inserted = await db.insert(todos).values({
      title,
      userID,       
      bereichsID,
      deadline,
      importance,
      niveau,
      completed
    }).returning();
    res.status(201).json({ todo: inserted[0] });
  } catch (error) {
    res.status(500).json({ message: "DB error", error: error.message });
  }
});

app.delete("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try{
    const deleted = await db.delete(todos).where(eq(todos.id, Number(id))).returning();
    res.status(200).json({ message: "Todo deleted", todo: deleted[0] });
  }
  catch (error) {
    res.status(500).json({ message: "DB error", error: error.message });
  }
});

app.put("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedTodo = req.body;
  const title = updatedTodo.title;
  const userID = updatedTodo.userid;
  const bereichsID = updatedTodo.bereichsID;
  const deadline = updatedTodo.deadline;
  const importance = updatedTodo.importance;
  const niveau = updatedTodo.niveau;
  const completed = updatedTodo.completed;

  try {
    const updated = await db.update(todos)
      .set({
        title,
        userID,
        bereichsID,
        deadline,
        importance,
        niveau,
        completed
      })
      .where(eq(todos.id, Number(id)))
      .returning();
    res.status(200).json({ todo: updated[0] });
  } catch (error) {
    res.status(500).json({ message: "DB error", error: error.message });
  }
});

app.get("/sections", async (_req, res) => {
  try {
    const allSections = await db.select().from(sections);
    res.json({ sections: allSections });
  } catch (error) {
    res.status(500).json({ message: "DB error", error: error.message });
  }
});

