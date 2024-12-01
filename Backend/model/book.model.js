import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    unique: true,
  },

  price: Number,
  category: String,
  image: String
});
const bookModel = mongoose.model("Book", bookSchema);

export default bookModel;
