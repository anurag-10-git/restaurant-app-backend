const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username is required']
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, "password is required"]
  },
  address: {
    type: String
  },
  phone: {
    type: String,
    required: [true, 'phone number is required']
  },
  usertype: {
    type: String,
    required: [true, 'user type is required'],
    default: 'client',
    enum: ['client', 'admin', 'vendor', 'driver']
  },
  profile: {
    type: String,
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  },
  answer: {
    type: String,
    required: true
  }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

userSchema.methods.verifyPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);