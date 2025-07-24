import { User } from "./user.model";
import { IUser, IUserDocument } from "./user.interface";

export const UserService = {
  async createUser(payload: IUser): Promise<IUserDocument> {
    return await User.create(payload);
  },

  async getUserById(id: string): Promise<IUserDocument | null> {
    return User.findById(id);
  },
  async getUserByEmail(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email });
  },

  async login(email: string, password: string): Promise<IUserDocument> {
    const user = (await User.findOne({ email })) as IUserDocument;
    if (!user) throw new Error("User not found");
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Invalid credentials");
    return user;
  },
};
