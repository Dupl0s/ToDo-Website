import { createUserSchema, emailSchema, updateUserSchema, userIdSchema, loginSchema } from "../models/user";
import express, { Request, Response } from 'express';
import { db } from "../../src/db";
import { users } from "../../src/db/schema";
import { randomUUID } from "crypto";
import { eq } from 'drizzle-orm';

export const userRouter = () => {
    const router = express.Router();

    router.get("/", async (req: Request, res: Response) => {
        const { email } = req.query;
        /* Get user by email */
        if (email) {
            const { success, data, error } = emailSchema.safeParse({ email });
            if (success) {
                try {
                    console.log(success);
                    const result = await db.select({ userId: users.userId }).from(users).where(eq(users.email, data.email));
                    const userId = result[0]?.userId;
                    if (userId && userId.length > 0) {
                        res.status(200).json({ message: "Benutzer vorhanden", userId })
                    }
                    else res.status(404).json({
                        message:
                            "Kein Benutzer mit dieser Mailadresse vorhanden. Willst du ein neues Konto erstellen?"
                    })
                } catch (error) {
                    const message = error instanceof Error ? error.message : String(error);
                    res.status(500).json({ message: "DB error", error: message });
                }
            }
            if (!success) {
                res.status(400).json({ message: "Ungültige Email-Angabe", error });
                return;
            }
        }
        /* Get all users */
        if (!email) {
            try {
                const allUsers = await db.select().from(users);
                res.json({ users: allUsers });
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                res.status(500).json({ message: "DB error", error: message });
            }
        }
    })

    /* Create User */
    router.post("/", async (req: Request, res: Response) => {
        const { success, data, error } = createUserSchema.safeParse(req.body);
        if (success) {
            try {
                console.log(data);
                const userWithId = { ...data, userId: randomUUID() };
                const newUserArray = await db.insert(users).values(userWithId).returning();
                const newUser = newUserArray[0];
                res.status(201).json({
                    message: "User wurde erstellt: ", user: newUser
                });
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                res.status(500).json({ message: "DB error", error: message });
            }
        }
        if (!success) {
            res.status(400).json({
                message: "Error: " + error,
            });
            return;
        }
    });

    /* Reset Password with Email Adress */
    router.post("/reset-password", async (req: Request, res: Response) => {
        const { email } = req.body;
        const emailStr = Array.isArray(email) ? email[0] : email;

        const { success, data, error } = emailSchema.safeParse({ emailStr });
        if (success) {
            try {
                const userResult = await db.select().from(users).where(eq(users.email, emailStr));
                const userId = userResult[0]?.userId;
                if (userId) {
                    const updatedUser = await db.update(users).set({ password: '' }).where(eq(users.userId, userId)).returning();
                    console.log("User geupdatet", updatedUser)
                    res.status(200).json({
                        message: "Dem User wird ein Link geschickt. ",
                        user: updatedUser
                    });
                } else {
                    res.status(404).json({ message: "User not found" });
                };
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                res.status(500).json({ message: "DB error", error: message });
            }
        }
        if (!success) {
            res.status(400).json({ message: "Invalid email.", error });
            return;
        }
    });


    /* Login */
    router.post("/login", async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const { success, error } = loginSchema.safeParse({ email: email, password: password });
        if (success) {
            try {
                const result = await db.select().from(users).where(eq(users.email, email));
                const user = result[0];
                if (!user) {
                    res.status(404).json({
                        message: "Kein Benutzer mit dieser Mailadresse vorhanden. Willst du dich registrieren?",
                    });
                }
                if (user.password !== password) {
                    res.status(401).json({
                        message: "User mit Mail gefunden, aber falsches Passwort. Passwort vergessen?",
                    });
                }
                res.status(200).json({
                    message: "Benutzer vorhanden und verifiziert",
                    username: user.username, email: user.email, userId: user.userId,
                });
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                res.status(500).json({ message: "Serverfehler", error: message });
            }
        }
        if (!success) {
            res.status(400).json({ message: "Ungültige Email-Angabe", error });
            return;
        }
    })

    /* Update User */
    router.put("/:userId", async (req: Request, res: Response) => {
        const { userId } = req.params;
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const updateData = body;
        const { success, data, error } = updateUserSchema.safeParse(updateData);
        console.log(req.body);
        if (success) {
            try {
                const id = Array.isArray(userId) ? userId[0] : userId;
                const updatedUser = await db.update(users).set(data).where(eq(users.userId, id)).returning();
                console.log("User upgedatet: ", updatedUser[0])
                if (updatedUser && updatedUser.length > 0) {
                    res.status(201).json({ message: "User wurde upgedated.", user: updatedUser[0] });
                }
                else {
                    res.status(404).json({ message: "User not found." })
                }
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                res.status(500).json({ message: "DB error", error: message });
            }
        }
        if (!success) {
            res.status(400).json({
                message: "Error: " + error.errors,
            });
            return;
        }
    });
    /* Delete User */
    router.delete("/:userId", async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { success, data, error } = userIdSchema.safeParse(userId);
        if (success) {
            try {
                const id = Array.isArray(userId) ? userId[0] : userId;
                const deletedUser = await db.delete(users).where(eq(users.userId, id)).returning();
                console.log("User gelöscht.")
                if (deletedUser && deletedUser.length > 0) {
                    res.status(200).json({ message: "User wurde gelöscht.", user: deletedUser[0] });
                }
                else {
                    res.status(404).json({ message: "Fehler." })
                }
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                res.status(500).json({ message: "DB error", error: message });
            }
        }
        if (!success) {
            res.status(400).json({
                message: "Error: " + error.errors,
            });
            return;
        }
    })
    return router;
}
