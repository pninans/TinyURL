
import mongoose from 'mongoose'
import clickSchema from './click.js'
import targetValueSchema from './targetValue.js'
const linkSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    clicks: [clickSchema] ,
    targetParamName: { type: String, default: "t" }, 
    targetValues: [targetValueSchema]    
    
})

const linkModel =  mongoose.models.links || mongoose.model('links', linkSchema);;
export default linkModel;