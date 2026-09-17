const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  extraIngredients: [{ name: String, price: Number }]
}, { _id: false });

const orderSchema = new mongoose.Schema({
  items: { type: [orderItemSchema], required: true },
  pizzaSubtotal: { type: Number, required: true },
  ingredientsSubtotal: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ['placed', 'paid'], default: 'paid' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);