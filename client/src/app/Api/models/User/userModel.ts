'use server'
import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const { Schema, model } = mongoose;

const userSchema = new Schema({
	username:{
		type:String,
		unique:true,
		required:[true,"username is required."],
		minLength:[3,"username must be at least 3 charcters long."],
		maxLength:[12,"username must be at most 12 charcters long."],
		message:(props:{value:string})=>`${props.value} is not a valid email.`
	},
	email:{
		type:String,
		unique:true,
		required:[true,"email is required."],
		minLength:[3,"email must be at least 3 charcters long."],
		maxLength:[254,"email must be at most 254 charcters long."],
		validate: {
			validator:function(v:string){
			return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(v);
		},
		message:(props:{value:string})=>`${props.value} is not a valid email.`
	}},
	password:{
		type:String,
		required:[true,"password is required."],
		minLength:[8,"password must be at least 8 charcters long."],
		maxLength:[20,"password must be at most 20 charcters long."],
		validate: {
			validator:function(v:string){
			return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).*$/.test(v);
		},
		message:(props:{value:string})=>`${props.value} password must contain atleast 1 uppercase letter, lowercase letter, special character and number.`
	}},
	verificationToken:{
		type: String,
        required: [true, 'verification token is missing'],
        match: [/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/, 'invalid token'],
	},
	verified:{
		type:Boolean,
		default:false
	},
	tokenExpires:{
		type: Date,
        default: () => Date.now() + 24 * 60 * 60 * 1000,
	},
	isdeleted:{
		type:Boolean,
		default:false
	}
});

userSchema.pre("save",async function (next) {
	const user = this;

	if(!user.isModified("password")){
		return next();
	}

	try {
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password,salt);
		next();
	} catch (error:any) {
		next(error);
	}
})

const User = mongoose.models.User || model("User", userSchema);
export default User;
