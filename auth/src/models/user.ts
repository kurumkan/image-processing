import mongoose from 'mongoose';
import { Password } from '../services/password';

// interface that describes properties for creating a new user
interface UserAttrs {
  email: string,
  password: string
};

// interface describing User collection
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
};

// inteface describing a single User 
interface UserDoc extends mongoose.Document {
  email: string,
  password: string
};

// user schema - blueprint for creating a model
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.__v;
      
      ret.id = ret._id;
      delete ret._id;    
    }
  }
});

// presave hook - hash password
userSchema.pre('save', async function(done) {
  // hash password only if it has been modified
  if(this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }   
  done();
});

// adding custom method to schema
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// mongoose user model
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };