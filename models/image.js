const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

const image_schema = new Schema({
    name : { type : String, required : true },
    path : { type : String, required : true },
    url  : { type : String, required : true },
    hash : { type : String, required : true },
}); 

let image_model = mongoose.model('image_model', image_schema, 'images');

module.exports = image_model;