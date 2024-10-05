import UserDAO from '../dao/UserDAO.js';

class UserRepository {
    async getUserById(id) {
        return UserDAO.findById(id);
    }

    async getUserByEmail(email) {
        return UserDAO.findByEmail(email);
    }

    async createUser(userData) {
        return UserDAO.create(userData);
    }
}

export default new UserRepository();
