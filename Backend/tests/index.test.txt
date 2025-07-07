import { test, expect } from 'vitest';
import { InMemoryUserRepo } from '../src/repositories/in-memory-user-repository';

/* npm run test */
// TODO: Add tests
test("Create", () => {
  const userRepo = new InMemoryUserRepo();
  const userData = { username: 'jojo', email: 'jojo@gmail.com', password: 'hallo123' };
  const newUser = userRepo.createUser(userData);
  expect(newUser).toHaveProperty('userId');
  expect(newUser.email).toBe('jojo@gmail.com')
  expect(newUser.password).toBe('hallo123');
  expect(newUser.username).toBe('jojo');
});

test("FindUser", () => {
  const userRepo = new InMemoryUserRepo();
  const userData = { username: 'jojo', email: 'jojo@gmail.com', password: 'hallo123' };
  const newUser = userRepo.createUser(userData);
  const email = 'jojo@gmail.com';
  const newUserID = userRepo.findUserWithMail(email);
  if (newUserID) {
    const findUser = userRepo.findUserById(newUserID)
    expect(findUser).toHaveProperty('userId');
    if (findUser) {
      expect(findUser.email).toBe('jojo@gmail.com')
      expect(findUser.password).toBe('hallo123');
      expect(findUser.username).toBe('jojo');
    }
    else console.log("No User")

  } else console.log("No ID")
});

test("ResetPassword", () => {
  const userRepo = new InMemoryUserRepo();
  const userData = { username: 'jojo', email: 'jojo@gmail.com', password: 'hallo123' };
  userRepo.createUser(userData);
  const email = 'jojo@gmail.com';
  const newUserID = userRepo.findUserWithMail(email);
  if (newUserID) {
    const resetUser = userRepo.resetPasswort(newUserID);
    expect(resetUser.password).toBe('');
  } else console.log("no UserId")
})

test("UpdateUser", () => {
  const userRepo = new InMemoryUserRepo();
  const userData = { username: 'jojo', email: 'jojo@gmail.com', password: 'hallo123' };
  userRepo.createUser(userData);
  const newUserID = userRepo.findUserWithMail(userData.email);
  if (newUserID) {
    const updateData = { id: newUserID, username: "Maxo", email: 'max@gmail.com', password: 'safePass!2' };
    const updatedUser = userRepo.updateUser(newUserID, updateData);
    expect(updatedUser).toHaveProperty('userId');
    if (updatedUser) {
      expect(updatedUser.username).toBe('Maxo');
      expect(updatedUser.email).toBe('max@gmail.com');
      expect(updatedUser.password).toBe('safePass!2');
    } else console.log("No Updated User")
  } else console.log("No ID")
});

test("loadUser", () => {
  const userRepo = new InMemoryUserRepo();
  const userData = { username: 'jojo', email: 'jojo@gmail.com', password: 'hallo123' };
  userRepo.createUser(userData);
  const currUser = userRepo.loadUser(userData.email, userData.password);
  expect(currUser).toHaveProperty('userId');
  if (currUser) {
    expect(currUser.email).toBe('jojo@gmail.com')
    expect(currUser.password).toBe('hallo123');
    expect(currUser.username).toBe('jojo');
  }
});

test("Delete", () => {
  const userRepo = new InMemoryUserRepo();
  const userData = { username: 'jojo', email: 'jojo@gmail.com', password: 'hallo123' };
  const newUser = userRepo.createUser(userData);
  expect(newUser).toHaveProperty('userId');
  expect(newUser.email).toBe('jojo@gmail.com')
  expect(newUser.password).toBe('hallo123');
  expect(newUser.username).toBe('jojo');
  userRepo.deleteUser(newUser.userId);
  expect(newUser).toBeNull;
  expect(newUser.userId).toBeNull;
  expect(newUser.email).toBeNull;
});