import mongoose from 'mongoose';

const readingsSchema = mongoose.Schema({
    pH: Number,
    EC: Number, 
    temp: Number, 
    time: { type: Date, default: Date.now }
});

const LatestReading = mongoose.model('LatestReading', readingsSchema);

export default LatestReading;