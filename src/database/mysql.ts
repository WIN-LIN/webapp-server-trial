import { prismaClient } from "../clients/prsima";
import { User } from "@prisma/client";

async function findUser(filter: object): Promise<User | null> {
  return prismaClient.user.findFirst({ where: filter });
}

const getUserById = async (id: number): Promise<User | null> => {
  return prismaClient.user.findUnique({ where: { id } }) || null;
};

const getUserByUsernameAndEmailAndPasskeyType = async (
  username: string,
  email: string,
  passkeyType: string
): Promise<User | null> => {
  const user = await findUser({ username, email, passkeyType });
  return user || null;
};

const getUserPasskeysByUsernameAndEmail = async (
  username: string,
  email: string
): Promise<string[] | null> => {
  const users = await prismaClient.user.findMany({
    where: { username, email },
    select: { passkeyType: true },
  });
  return users.map((user) => user.passkeyType) || null;
};

const createUser = async (
  username: string,
  email: string,
  passkeyType: string
): Promise<User | null> => {
  if (
    await getUserByUsernameAndEmailAndPasskeyType(username, email, passkeyType)
  ) {
    return null;
  }
  return prismaClient.user.create({ data: { username, email, passkeyType } });
};

const deleteUser = async (id: number): Promise<User | null> => {
  const user = await getUserById(id);
  if (!user) {
    return null;
  }
  return prismaClient.user.delete({ where: { id } });
};

export {
  getUserById,
  getUserByUsernameAndEmailAndPasskeyType,
  getUserPasskeysByUsernameAndEmail,
  createUser,
  deleteUser,
};
