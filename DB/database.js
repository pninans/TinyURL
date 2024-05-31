import mongoose from "mongoose";
const uri =
"mongodb+srv://p0504155494:H74fzWk2hZXgx83W@pninans.3nqcs0c.mongodb.net/";
const uriLocal = "mongodb://localhost:27017/<dbname>";

const connectDB = async () => {
  await mongoose.connect(uri);
};
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
})

database.once('connected', () => {
  console.log('Database Connected');
})
mongoose.set('toJSON', {
    virtuals: true,
    transform: (doc, converted) => {
      delete converted._id;
    }
  });
export default connectDB;
