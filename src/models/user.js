import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
    role: { type: String, default: 'user' },
}, { versionKey: false});

userSchema.pre('save', function(next) {
    if (this.isModified('password') || this.isNew) {
        this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    }
    next();
});

const User = mongoose.model(userCollection, userSchema);

export default User;
