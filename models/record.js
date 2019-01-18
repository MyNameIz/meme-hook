const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

const record_schema = new Schema({
    public : { type : String, required : true },
    text   : { type : String, required : false, default : '' },
    origin : { type : String, required : true },
    images : { type : Array, required : true },
});

let record_model = mongoose.model('record_model', record_schema, 'records');

module.exports = record_model;