import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    thumbnails: { type: [String], default: [] },
    status: { type: Boolean, default: true }
}, { versionKey: false });

productSchema.plugin(mongoosePaginate);

export default mongoose.models.Product || mongoose.model('Product', productSchema);
