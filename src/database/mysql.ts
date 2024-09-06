import { prisma } from "../clients/prsima";
import { User } from "../models/models";

async function findUser(filter: object): Promise<User | null> {
  return prisma.user.findFirst({ where: filter });
}

const getUserById = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({ where: { id } }) || null;
};

const getUserByUsernameAndEmailAndPasskeyType = async (
  username: string,
  email: string,
  passkey_type: string
): Promise<User | null> => {
  const user = await findUser({ username, email, passkey_type });
  return user || null;
};

const getUserPasskeysByUsernameAndEmail = async (
  username: string,
  email: string
): Promise<string[] | null> => {
  const users = await prisma.user.findMany({
    where: { username, email },
    select: { passkey_type: true },
  });
  return users.map((user) => user.passkey_type) || null;
};

const createUser = async (
  username: string,
  email: string,
  passkey_type: string
): Promise<User | null> => {
  if (
    await getUserByUsernameAndEmailAndPasskeyType(username, email, passkey_type)
  ) {
    return null;
  }
  return prisma.user.create({ data: { username, email, passkey_type } });
};

const deleteUser = async (id: number): Promise<User | null> => {
  const user = await getUserById(id);
  if (!user) {
    return null;
  }
  return prisma.user.delete({ where: { id } });
};

export {
  getUserById,
  getUserByUsernameAndEmailAndPasskeyType,
  getUserPasskeysByUsernameAndEmail,
  createUser,
  deleteUser,
};
