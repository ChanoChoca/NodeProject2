import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }
}, { versionKey: false });

ticketSchema.pre('save', function(next) {
    if (this.isNew) {
        this.code = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    next();
});

export default mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);
