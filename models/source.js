const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const source_schema = {
    name : { type : String, required : true },
    url  : { type : String, required : true }
}

let source_model = mongoose.model('source_model', source_schema, 'sources');

module.exports = source_model;