import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, {DBUser} from '../dataBase/User.model';

export const registerUser = async (username: string, password: string,
                                   role: string, bossId: string | null): Promise<string> => {
    try {
        let boss: string | null = null;

        if (role !== 'administrator') {
            const bossUser: DBUser|null = await User.findById(bossId);
            if (!bossUser || (bossUser.role !== 'boss' && bossUser.role !== 'administrator'))  {
                throw new Error('Boss not found or invalid');
            }
            boss = bossId;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, role, boss });
        await user.save();
        return 'User registered successfully';
    } catch (error: any) {
        throw new Error(error as any);
    }
};

export const loginUser = async (username: string, password: string): Promise<string> => {
    try {
        const user: DBUser|null = await User.findOne({ username });
        if (!user) throw new Error('Invalid username or password');

        console.log(user)

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new Error('Invalid username or password');

        return jwt.sign({userId: user._id},
            process.env.JWT_SECRET || '', {expiresIn: '1h'});
    } catch (error: any) {
        throw new Error(error as any);
    }
};

export const getSubordinates = async (userId: string): Promise<DBUser[]> => {
    try {
        const subordinates: DBUser[] = await User.find({ bossId: userId });
        let allSubordinates: DBUser[] = [...subordinates];
        for (const subordinate of subordinates) {
            const nestedSubordinates: DBUser[] = await getSubordinates(subordinate._id);
            allSubordinates = [...allSubordinates, ...nestedSubordinates];
        }
        return allSubordinates;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
};

export const getUsers = async (user: DBUser): Promise<DBUser[]> => {
    try {
        const { role, _id } = user;
        let users: DBUser[] = [];
        if (role === 'administrator') {
            users = await User.find();
        } else if (role === 'boss') {
            const boss = await User.findById(_id);
            if (!boss) {
                throw new Error('Boss not found');
            }
            const subordinates = await getSubordinates(_id);
            users = [boss, ...subordinates];
        } else if (role === 'regular user') {
            const user = await User.findById(_id);
            if (!user) {
                throw new Error('User not found');            }
            users = [user];
        }
       return users
    } catch (error) {
        throw new Error('Internal Server Error');
    }
};

export const changeUserBoss = async (user: DBUser, userId: string, bossId: string): Promise<string> => {
    try {
        if (user.role !== 'boss') {
            throw new Error('Forbidden');
        }

        const subordinate: DBUser|null = await User.findById(userId);
        if (!subordinate || !subordinate.boss || subordinate.boss.toString() !== user._id.toString()) {
            throw new Error('Invalid user or not your subordinate');
        }

        const bossUser: DBUser|null = await User.findById(bossId);
        if (!bossUser || bossUser.role !== 'boss') {
            throw new Error('Boss not found or invalid');
        }

        subordinate.boss = bossId;
        await subordinate.save();
        return 'Boss changed successfully';
    } catch (error) {
        throw new Error('Internal Server Error');
    }
};
