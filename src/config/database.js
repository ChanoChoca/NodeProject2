import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://juanicaprioli16:RTQ0YzrJefi4z19y@cluster0.vzzl3.mongodb.net/integrative_practise?retryWrites=true&w=majority');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

export default db;
