var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 50 },
  description: { type: String, required: true },
  numberInStock: { type: Number, required: true, min: 0, max: 999 },
  price: { type: Number, required: true, min: 0, max: 1000000 },
  category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
});

ItemSchema.virtual('url').get(() => {
  return '/item/' + this._id;
});

module.exports = mongoose.model('Item', ItemSchema);
