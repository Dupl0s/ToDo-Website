import { createUser, updateUser, User } from "..";

export interface UserRepository {
    findAll(): User[];
    loadUser(email:string, password: string): User | undefined;
    createUser(user: createUser): User;
    updateUser(id: string, user: updateUser): User | undefined;
    resetPasswort(id:string): User;
    findUserWithMail(email: string): string | undefined;
    findUserById(id: string): User | undefined;
    deleteUser(id:string): boolean;
}