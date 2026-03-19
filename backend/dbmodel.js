import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/urlshortener")

const Schema = mongoose.Schema({
    url:String,
    shortened:String
})

const dbmodel = mongoose.model("dbmodel",Schema)
export default dbmodel
