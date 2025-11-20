import { PrismaClient, User } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { SignupInput, LoginInput } from '../validators/user.validator';

const prisma = new PrismaClient();

export class UserService {
  async signup(data: SignupInput): Promise<{ user: Partial<User>; token: string }> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        year: data.year,
        major: data.major,
        dorm: data.dorm,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
      },
    });

    const token = generateToken({ userId: user.id, email: user.email });

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async login(data: LoginInput): Promise<{ user: Partial<User>; token: string }> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await comparePassword(data.password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken({ userId: user.id, email: user.email });

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async getUserById(userId: string): Promise<Partial<User>> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        year: true,
        major: true,
        dorm: true,
        bio: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
