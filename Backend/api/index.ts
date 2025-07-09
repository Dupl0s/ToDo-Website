import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from '../src/db/index';
import { users, todos, sections } from '../src/db/schema';
import { eq, and, or, isNull } from 'drizzle-orm';
import { uuid } from 'drizzle-orm/gel-core';
import { userRouter } from './routers/user-router';

const app = express();

// CORS-Konfiguration
app.use(cors({
  origin: [
    "http://localhost:4200",
    "https://dupl0s.github.io"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use("/users", userRouter());

// Lokaler Port nur für Development
if (process.env.NODE_ENV !== 'production') {
  const Port = 3000;
  app.listen(Port, () => {
    console.log(`Server started at http://localhost:${Port}`);
  });
}

//todos

app.get("/todos", async (req, res) => {
  try {
    const { userId, deleted } = req.query;

    let allTodos;

    if (userId && deleted === 'true') {
      // Nur gelöschte Todos für User
      allTodos = await db.select().from(todos).where(
        and(
          eq(todos.userID, String(userId)),
          eq(todos.deleted, true)
        )
      );
    } else if (userId) {
      // Nur aktive Todos für User (deleted = false oder null)
      allTodos = await db.select().from(todos).where(
        and(
          eq(todos.userID, String(userId)),
          or(eq(todos.deleted, false), isNull(todos.deleted))
        )
      );
    } else if (deleted === 'true') {
      // Alle gelöschten Todos
      allTodos = await db.select().from(todos).where(eq(todos.deleted, true));
    } else {
      // Alle aktiven Todos
      allTodos = await db.select().from(todos).where(
        or(eq(todos.deleted, false), isNull(todos.deleted))
      );
    }

    res.json({ todos: allTodos });
  } catch (error) {
    res.status(500).json({ message: "DB error", error: error.message });
  }
});

app.get("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, deleted } = req.query;

  try {
    let todoInBereich;

    if (userId && deleted === 'true') {
      // Gelöschte Todos für User und Bereich
      todoInBereich = await db.select().from(todos).where(
        and(
          eq(todos.bereichsID, Number(id)),
          eq(todos.userID, String(userId)),
          eq(todos.deleted, true)
        )
      );
    } else if (userId) {
      // Aktive Todos für User und Bereich
      todoInBereich = await db.select().from(todos).where(
        and(
          eq(todos.bereichsID, Number(id)),
          eq(todos.userID, String(userId)),
          or(eq(todos.deleted, false), isNull(todos.deleted))
        )
      );
    } else if (deleted === 'true') {
      // Alle gelöschten Todos für Bereich
      todoInBereich = await db.select().from(todos).where(
        and(
          eq(todos.bereichsID, Number(id)),
          eq(todos.deleted, true)
        )
      );
    } else {
      // Alle aktiven Todos für Bereich
      todoInBereich = await db.select().from(todos).where(
        and(
          eq(todos.bereichsID, Number(id)),
          or(eq(todos.deleted, false), isNull(todos.deleted))
        )
      );
    }

    res.json({ todos: todoInBereich });
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
      completed,
      deleted: false
    }).returning();
    res.status(201).json({ todo: inserted[0] });
  } catch (error) {
    res.status(500).json({ message: "DB error", error: error.message });
  }
});

app.delete("/todos/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
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
  const userID = updatedTodo.userID || updatedTodo.userid;
  const bereichsID = updatedTodo.bereichsID;
  const deadline = updatedTodo.deadline;
  const importance = updatedTodo.importance;
  const niveau = updatedTodo.niveau;
  const completed = updatedTodo.completed;
  const deleted = updatedTodo.deleted !== undefined ? updatedTodo.deleted : false;

  try {
    const updated = await db.update(todos)
      .set({
        title,
        userID,
        bereichsID,
        deadline,
        importance,
        niveau,
        completed,
        deleted
      })
      .where(eq(todos.id, Number(id)))
      .returning();
    res.status(200).json({ todo: updated[0] });
  } catch (error) {
    res.status(500).json({ message: "DB error", error: error.message });
  }
});

app.get("/sections", async (_req, res) => {
  const userid = _req.query.userid as string;
  try {
    const allSections = await db.select().from(sections).where(eq(sections.userid, userid));
    res.json({ sections: allSections });
  } catch (error) {
    res.status(500).json({ message: "DB error", error: error.message });
  }
});

app.post("/sections", async (req: Request, res: Response) => {
  const { name, userid } = req.body;
  console.log("Name:", name);
  console.log("UserID:", userid);
  if (!userid) {
    res.status(400).json({ error: "userid fehlt im Body" });
  }
  try {
    const inserted = await db.insert(sections).values({ name, userid }).returning();
    res.status(201).json({ section: inserted[0] });
  } catch (error) {
    res.status(500).json({ message: "DB error", error: error.message });
  }
});

app.put("/sections/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updated = await db.update(sections)
      .set({ name })
      .where(eq(sections.id, Number(id)))
      .returning();
    res.status(200).json({ section: updated[0] });
  } catch (error) {
    res.status(500).json({ message: "DB error", error: error.message });
  }
});

app.delete("/sections/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await db.delete(sections).where(eq(sections.id, Number(id))).returning();
    res.status(200).json({ message: "Section deleted", section: deleted[0] });
  } catch (error) {
    res.status(500).json({ message: "DB error", error: error.message });
  }
});

// Export für Vercel
export default app;