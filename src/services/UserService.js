import UserRepository from '../repository/UserRepository.js';

class UserService {
    async getUserById(userId) {
        try {
            const user = await UserRepository.getUserById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error(`Error getting user: ${error.message}`);
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await UserRepository.getUserByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error(`Error getting user: ${error.message}`);
        }
    }

    async createUser(userData) {
        try {
            return await UserRepository.createUser(userData);
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    async updateUserRole(userId, newRole) {
        try {
            const user = await UserRepository.getUserById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            user.role = newRole;
            await user.save();
            return user;
        } catch (error) {
            throw new Error(`Error updating user role: ${error.message}`);
        }
    }
}

export default new UserService();
