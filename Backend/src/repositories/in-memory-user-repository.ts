import { User, createUser, updateUser } from "..";
import { UserRepository } from "./user-repository";

export class InMemoryUserRepo implements UserRepository {
    constructor(private allUser: User[] = []) { }

    findUserById(id: string): User | undefined {
        return this.allUser.find((user) => user.userId === id)
    }
    loadUser(email: string, password: string): User | undefined
    {
        const authUser = this.allUser.find((user) => user.email === email && user.password === password);
        if (!authUser) {
            console.log("No AuthUser")
            return undefined;
        }
        if (authUser) {
            console.log("AuthUser")
            return authUser;
        }
    }
    createUser(user: createUser): User {
        const newUser: User = {
            userId: crypto.randomUUID(),
            ... user,
        }
        this.allUser.push(newUser);
        return newUser;
    }
    updateUser(id: string, updatedUser: updateUser): User | undefined {
        const userIndex = this.allUser.findIndex((user) => user.userId === id);
        if (userIndex === -1) return undefined

        this.allUser[userIndex] = {
            ...this.allUser[userIndex],
            ...updatedUser };
        return this.allUser[userIndex];
    }

    resetPasswort(id:string): User {
        const userIndex = this.allUser.findIndex((user) => user.userId === id)
        this.allUser[userIndex].password = '';
        return this.allUser[userIndex] = { ...this.allUser[userIndex] }
    }
    findUserWithMail(email: string): string | undefined {
        console.log(this.allUser)
        
        return this.allUser.find((user) =>  user.email === email)?.userId;
    }

    deleteUser(id: string): boolean {
        const userLength = this.allUser.length;
        this.allUser = this.allUser.filter((user) => user.userId !== id);
        return this.allUser.length !== userLength;
    }
    
}