import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userCollection = "users";

/**
 * Define el esquema de Mongoose para el modelo de usuario.
 * Incluye campos para el nombre, apellido, email, rol y contraseña.
 */
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'user' },
    password: { type: String, required: true },
});

/**
 * Middleware pre-save para el esquema de usuario.
 * Encripta la contraseña antes de guardar el usuario en la base de datos.
 */
userSchema.pre('save', function(next) {
    if (this.isModified('password') || this.isNew) {
        this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    }
    next();
});

/**
 * Crea y exporta el modelo de Mongoose para el esquema de usuario.
 */
const User = mongoose.model(userCollection, userSchema);

export default User;
