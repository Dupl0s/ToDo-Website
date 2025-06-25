import express from 'express';
import { z } from "zod"
import { createUserSchema, updateUserSchema, userSchema } from "./models/user"
import { InMemoryUserRepo } from './repositories/in-memory-user-repository';
import { buildUserRouter } from './routers/user-router';

/* Im Terminal im Verzeichnis /Backend mit npm start Server auf Port 3000 starten, dann im /Frontend ng serve --proxy-config proxy.conf.json*/


export type User = z.infer<typeof userSchema>;
export type createUser = z.infer<typeof createUserSchema>;
export type updateUser = z.infer<typeof updateUserSchema>

const localUser = [
    {
        userId: "1",
        username: 'user1',
        email: 'user1@gmail.com',
        password: 'hallo123'
    },
    {
        userId: "2",
        username: 'user2',
        email: 'user2@gmail.com',
        password: 'hallo456'
    },
    {
        userId: "3",
        username: 'user3',
        email: 'user3@gmail.com',
        password: 'hallo789'
    }
] satisfies User[]


const app = express();
const Port = 3000;

app.use(express.json());

const userRepo = new InMemoryUserRepo(localUser);
const userRouter = buildUserRouter(userRepo);
app.use("/user", userRouter);

app.get("/api/backend", (_req, res) => {
    res.json({ message: "Hello Backend!" });
});

app.listen(Port);
console.log("Server started at http://localhost:" + Port);
