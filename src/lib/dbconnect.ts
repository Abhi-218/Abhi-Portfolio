import mongoose from 'mongoose'


export async function dbConnect() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI!
        if (mongoose.connection.readyState >= 1) return
        await mongoose.connect(MONGODB_URI)
    } catch (error) {
        console.log(error)
    }
}
