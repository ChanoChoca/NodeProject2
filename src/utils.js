import bcrypt from 'bcrypt';

/**
 * Crea un hash de la contraseña utilizando bcrypt.
 * Genera un hash seguro con un salt de 10 rondas.
 * @param {string} password - La contraseña a hashear.
 * @returns {string} - El hash de la contraseña.
 */
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

/**
 * Verifica si la contraseña proporcionada coincide con el hash almacenado.
 * Utiliza bcrypt para comparar la contraseña con el hash.
 * @param {Object} user - El objeto del usuario que contiene el hash de la contraseña.
 * @param {string} password - La contraseña a verificar.
 * @returns {boolean} - `true` si la contraseña es válida, `false` en caso contrario.
 */
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);
