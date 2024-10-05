import User from '../models/user.js';

class UserDAO {
    async findById(id) {
        return User.findById(id).populate('cart');
    }

    async findByEmail(email) {
        return User.findOne({ email });
    }

    async create(userData) {
        const user = new User(userData);
        return user.save();
    }
}

export default new UserDAO();
