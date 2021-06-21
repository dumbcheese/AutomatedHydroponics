import mongoose from 'mongoose';

const readingsSchema = mongoose.Schema({
    pH: Number,
    EC: Number, 
    temp: Number, 
    time: { type: Date, default: Date.now }
});

const Readings = mongoose.model('Readings', readingsSchema);

export default Readings;