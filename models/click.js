import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
    insertedAt: { type: Date, default: Date.now },
    ipAddress: String,
    targetParamValue:  String ,
    targetParamValue:String 
})

export default clickSchema;