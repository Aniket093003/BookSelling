import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required:true,
    minlength: 3
  },
  price: {
    type: Number,
    required: true,
    min: 100,
  },
  category: {
    type: Array,
    required: true
  },
  image: {
    type : String,
    required: true
  }
  
}, {timestamps: true});
const bookModel = mongoose.model("Book", bookSchema);

export default bookModel;
