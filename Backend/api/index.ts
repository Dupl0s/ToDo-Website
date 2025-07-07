import express, { Request, Response } from 'express';
import { db } from '../src/db/index';
import { users, todos, sections } from '../src/db/schema';
import { userRouter } from './routers/user-router';
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:4200",
  credentials: true,
}));
//user
app.use("/users", userRouter());

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
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "DB error", error: message });
  }
});


//bereiche / sections

app.get("/sections", async (_req, res) => {
  try {
    const allSections = await db.select().from(sections);
    res.json({ sections: allSections });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "DB error", error: message });
  }
});

export default app;



