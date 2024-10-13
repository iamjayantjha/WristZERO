const mongoose = require('mongoose');

const watchSchema = new mongoose.Schema({
    watch_name: String,
    watch_size: Number,
    watch_color: String,
    type_gender: String,
    length_of_band: Number,
    brand: String,
    price: Number,
    image_url: String,
});

module.exports = mongoose.model('Watch', watchSchema);