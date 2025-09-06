import mongoose  from "mongoose";

let configDb=async()=>{

  await  mongoose.connect(process.env.CONNECTION_URL)
  .then(()=>console.log("connected to mongodb"))
}

export default configDb;