import mongoose from 'mongoose';

const parametersSchema = mongoose.Schema({
    pHLow: Number,
    pHHigh: Number,
    ECLow: Number, 
    ECHigh: Number, 
    tempLow: Number, 
    tempHigh: Number, 
    operate: Boolean
});

const Parameters = mongoose.model('Parameters', parametersSchema);

export default Parameters;