import express, { Request, Response } from 'express';
import { db } from '../src/db/index';
import { users, todos, sections } from '../src/db/schema';

const app = express();
app.use(express.json());

//user

// Alle User abrufen
app.get("/users", async (_req, res) => {
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

app.get("/todos", async (_req, res) => {
  try {
    const allTodos = await db.select().from(todos);
    res.json({ todos: allTodos });
  } catch (error) {
    res.status(500).json({ message: "DB error", error: error.message });
  }
});


//bereiche / sections

app.get("/sections", async (_req, res) => {
  try {
    const allSections = await db.select().from(sections);
    res.json({ sections: allSections });
  } catch (error) {
    res.status(500).json({ message: "DB error", error: error.message });
  }
});




