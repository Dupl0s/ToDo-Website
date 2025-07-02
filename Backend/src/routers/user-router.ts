import { updateUser } from "..";
import { createUserSchema, emailSchema, updateUserSchema, userSchema } from "../models/user";
import { UserRepository } from "../repositories/user-repository";
import express, { Request, Response } from 'express';
import { z } from "zod";

export const buildUserRouter = (userRepo: UserRepository) => {
    const router = express.Router();

    /* Get all users */
    router.get("/", (req: Request, res: Response) => {
        const users = userRepo.findAll();
        res.status(200).json(users);
    })

    /* Create User */
    router.post("/", (req: Request, res: Response) => {
        const { success, data, error } = createUserSchema.safeParse(req.body);
        if (success) {
            const newUser = userRepo.createUser(data);
            res.status(201).json({ message: "User wurde erstellt: ", username: newUser.username, email: newUser.email });
        }
        if (!success) {
            res.status(400).json({
                message: "Error: " + error,
            });
            return;
        }
        else {
            res.status(500).json({ message: "No Connection." });
        }
    });

    /* Reset Password with Email Adress */
    router.post("/reset-password", (req: Request, res: Response) => {
        const { email } = req.body;
        console.log("POST /reset-password:", email);

        const { success, error } = emailSchema.safeParse({ email });
        if (success) {
            const userId = userRepo.findUserWithMail(email);
            if (userId) {
                const updatedUser = userRepo.resetPasswort(userId);
                console.log("User geupdatet", updatedUser)
                res.status(200).json({
                    message: "Dem User wird ein Link geschickt. ",
                    user: updatedUser
                });
            } else {
                res.status(404).json({ message: "User not found" });
            };
        }
        if (!success) {
            res.status(400).json({ message: "Invalid email.", error });
            return;
        }
    });

    /* FindUserWithMail */
    router.get("/by-mail", (req: Request, res: Response) => {
        const rawEmail = req.query.email;
        console.log(rawEmail);
        if (typeof rawEmail !== 'string') {
            res.status(400).json({ message: "E-Mail muss ein String sein" });
            return;
        }
        const { success, error } = emailSchema.safeParse({ email: rawEmail });
        if (success) {
            console.log(success);
            const userId = userRepo.findUserWithMail(rawEmail);
            if (userId) {
                const user = userRepo.findUserById(userId);
                res.status(200).json({ message: "Benutzer vorhanden", username: user?.username, email: user?.email })
            }
            else res.status(404).json({
                message:
                    "Kein Benutzer mit dieser Mailadresse vorhanden. Willst du ein neues Konto erstellen?"
            })
        }
        if (!success) {
            res.status(400).json({ message: "Ungültige Email-Angabe", error });
            return;
        }
    });

    /* Login */
    router.post("/login", (req: Request, res: Response) => {
        const { email, password } = req.body;
        const { success, error } = emailSchema.safeParse({ email: email, password: password });
        if (success) {
            const user = userRepo.loadUser(email, password);
            if (user) {
                console.log("Auth User in Router")
                res.status(200).json({
                    message: "Benutzer vorhanden und verifiziert",
                    username: user.username, email: user.email, userId: user.userId
                })
            }
            else {
                const UserId = userRepo.findUserWithMail(email);
                if (UserId) {
                    res.status(401).json({ message: "User mit Mail gefunden, aber falsches Passwort. Passwort vergessen?" })
                }
                else {
                    console.log("No User arrived")
                    res.status(404).json({ message: "Kein Benutzer mit dieser Mailadresse vorhanden. Willst du dich registrieren?" })
                }
            }
        }
        if (!success) {
            res.status(400).json({ message: "Ungültige Email-Angabe", error });
            return;
        }
    })
    /* Update User */
    router.put("/:userId", (req: Request, res: Response) => {
        const { userId } = req.params;
        const updateData = req.body;

        const { success, data, error } = updateUserSchema.safeParse(updateData);
        console.log(req.body);
        if (success) {
            const updatedUser = userRepo.updateUser(userId, data)
            console.log("User upgedatet: " + updatedUser?.email, updatedUser?.password, updatedUser?.username)
            if (updatedUser) {
                res.status(201).json({ message: "User wurde upgedated.", user: updatedUser });
            }
            else {
                res.status(404).json({ message: "User not found." })
            }
        }
        if (!success) {
            res.status(400).json({
                message: "Error: " + error.errors,
            });
            return;
        }
    });
    return router;
}