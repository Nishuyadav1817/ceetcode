const mongoose= require('mongoose');
 

async function Main() {
    await mongoose.connect(process.env.MONGO_URI)
}

module.exports=Main;