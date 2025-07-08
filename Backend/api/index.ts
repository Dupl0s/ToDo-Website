import express, { Request, Response } from 'express';
import { db } from '../src/db/index';
import { todos, sections } from '../src/db/schema';
import { userRouter } from './routers/user-router';
import cors from 'cors'
import { eq } from 'drizzle-orm';

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:4200",
  credentials: true,
}));

const Port = 3000;
app.listen(Port, () => {
  console.log(`Server started at http://localhost:${Port}`);
});

//users
app.use("/users", userRouter());

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

app.post('/sections', async(req,res)=>{
  try{
    const {name}= req.body;
    const [inserted]=await db.insert(sections).values({name}).returning();
    res.status(201).json(inserted);
  }catch(error){
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "DB error", error: message });
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
  
/* export const handler = serverless({ app });
 */
export default app;