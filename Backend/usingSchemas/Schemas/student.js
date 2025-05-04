import mongoose from 'mongoose';
const studentSchema=new mongoose.Schema(
    {
        name: {
            type: String,
            required:true,
        },
        class:{
            type:String,
            required:true
        },
        rollNo: {
            type: Number,
            required: true
        } 
    }, {timestamps: true}
)
const student = mongoose.model("Student", studentSchema);
export default student