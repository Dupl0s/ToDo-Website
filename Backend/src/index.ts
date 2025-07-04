import express from 'express';
import { z } from "zod"
import { createUserSchema, updateUserSchema, userIdSchema, userSchema } from "./models/user"
import { InMemoryUserRepo } from './repositories/in-memory-user-repository';
import { buildUserRouter } from './routers/user-router';

export type User = z.infer<typeof userSchema>;
export type createUser = z.infer<typeof createUserSchema>;
export type updateUser = z.infer<typeof updateUserSchema>;
export type userIdSchema = z.infer<typeof userIdSchema>;

const localUser = [
    {
        userId: "1uwh",
        username: 'user1',
        email: 'user1@gmail.com',
        password: 'hallo123'
    },
    {
        userId: "2uwh",
        username: 'user2',
        email: 'user2@gmail.com',
        password: 'hallo456'
    },
    {
        userId: "3uwh",
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
