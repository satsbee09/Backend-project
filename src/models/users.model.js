import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema =new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{

            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true

        },
        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avator:{
            type:String,
            required:true  // URL of the user's avatar image
        },
        coverImage:{
            type:String,
            required:true  // URL of the user's cover image
        },
        WatchHistory:{
            type:Schema.Types.ObjectId,
            ref:"Video"
        },
        password:{
            type:String,
            required:[true,"Password is required"],
        },
        refreshToken:{
            type:String
        }
},
{
    timestamps:true
}

)
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken=function(){
   return  jwt.sign({
        _id:this._id,
        eamil:this.email,
        username:this.username,
        fullname:this.fullname
    }
    ,process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRES_IN
    }
    )
}
userSchema.methods.generateRefreshToken=function(){
   return  jwt.sign({
        _id:this._id
    }
    ,process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRES_IN
    }
)
    
}
export const User=mongoose.model("User",userSchema )