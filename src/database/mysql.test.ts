import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as mysql from "./mysql";
import { prismaClient } from "../clients/prsima";
import { User } from "@prisma/client";
async function cleanDatabase() {
  // List all tables you want to clear
  const tables = ["User", "Account"];

  // Disable foreign key checks to avoid deletion conflicts
  await prismaClient.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 0;");

  for (const table of tables) {
    await prismaClient.$executeRawUnsafe(`TRUNCATE TABLE ${table};`);
  }

  // Re-enable foreign key checks
  await prismaClient.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 1;");
}

describe("mysql", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterEach(async () => {
    await cleanDatabase();
  });

  it("should create a new user if no existing user is found", async () => {
    const mockNewUser: User = {
      id: 1,
      username: "newuser",
      email: "new@example.com",
      passkeyType: "type1",
    };

    const user = await mysql.createUser(
      mockNewUser.username,
      mockNewUser.email,
      mockNewUser.passkeyType
    );

    expect(user).toEqual(mockNewUser);
  });

  it("returns null if trying to create a user that already exists", async () => {
    const mockUser: User = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      passkeyType: "type1",
    };

    await mysql.createUser(
      mockUser.username,
      mockUser.email,
      mockUser.passkeyType
    );

    const user = await mysql.createUser(
      mockUser.username,
      mockUser.email,
      mockUser.passkeyType
    );

    expect(user).toBeNull();
  });

  it("returns a user if user id exists", async () => {
    const user: User = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      passkeyType: "type1",
    };

    await mysql.createUser(user.username, user.email, user.passkeyType);

    const exisitingUser = await mysql.getUserById(1);
    expect(exisitingUser).toEqual(user);
  });

  it("should return null if user id does not exist", async () => {
    const user = await mysql.getUserById(1);
    expect(user).toBeNull();
  });

  it("should return user if given username, email, passkey type combination exists", async () => {
    const mockUser: User = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      passkeyType: "type1",
    };

    await mysql.createUser(
      mockUser.username,
      mockUser.email,
      mockUser.passkeyType
    );

    const user = await mysql.getUserByUsernameAndEmailAndPasskeyType(
      mockUser.username,
      mockUser.email,
      mockUser.passkeyType
    );

    expect(user).toEqual(mockUser);
  });

  it("should return null if given username, email, passkey type combination does not exist", async () => {
    const user = await mysql.getUserByUsernameAndEmailAndPasskeyType(
      "nonexistent",
      "user@example.com",
      "type1"
    );

    expect(user).toBeNull();
  });

  it("should return a list of passkey types for given username and email", async () => {
    const username = "testuser";
    const email = "test@example.com";
    const passkeyTypes = ["type1", "type2"];

    await mysql.createUser(username, email, passkeyTypes[0]);
    await mysql.createUser(username, email, passkeyTypes[1]);

    const passkeys = await mysql.getUserPasskeysByUsernameAndEmail(
      username,
      email
    );

    expect(passkeys).toEqual(passkeyTypes);
  });

  it("should return the deleted user if user id exists", async () => {
    const user: User = {
      id: 1,
      username: "testuser",
      email: "test@example.com",
      passkeyType: "type1",
    };

    await mysql.createUser(user.username, user.email, user.passkeyType);

    const deletedUser = await mysql.deleteUser(user.id);
    expect(deletedUser).toEqual(user);

    expect(await mysql.getUserById(user.id)).toBeNull();
  });

  it("should return null if deleted user id does not exist", async () => {
    expect(await mysql.deleteUser(1)).toBeNull();
  });
});
