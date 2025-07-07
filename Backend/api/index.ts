import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from '../src/db/index';
import { users, todos, sections } from '../src/db/schema';
import {count, and, eq} from 'drizzle-orm';


const app = express();
app.use(cors());
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
    const allSections = await db.select().from(sections).orderBy(sections.id);

    /*const sectionsWithCount = await Promise.all(
      allSections.map(async (section) => {
        const [{ count: incompleteCount }] = await db
          .select({ count: count() })
          .from(todos)
          .where(
            and(
              eq(todos.bereichsID, section.id),
              eq(todos.completed, false)
            )
          );
        return { ...section, incompleteCount: Number(incompleteCount) };
      })
    );*/

    res.json( allSections );
  } catch (error) {
    res.status(500).json({ message: "DB error", error: error.message });
  }
});

app.post('/sections', async(req,res)=>{
  try{
    const {name}= req.body;
    const [inserted]=await db.insert(sections).values({name}).returning();
    res.status(201).json(inserted);
  }catch(error){
    res.status(500).json({ message: "DB error", error: error.message });
  }
});

app.delete('/sections/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try{
    await db.delete(sections).where(eq(sections.id,id));
  res.status(204).send();
  } catch (error){
    res.status(500).json({error:'Failed to delete the Category'});
  }
  });

app.put('/sections/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const { name } = req.body;
  
    try {
      await db.update(sections).set({name}).where(eq(sections.id,id));
      res.status(200).json({ id, name });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update the Category' });
    }
  });
  
  export default app;



