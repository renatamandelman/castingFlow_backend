import mongoose from "mongoose";
const { Schema } = mongoose;

const modelSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'El nombre es obligatorio.'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres.']
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es obligatorio.'],
    trim: true,
    minlength: [2, 'El apellido debe tener al menos 2 caracteres.']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio.'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Por favor, introduce un email válido.']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria.'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres.']
  },
  dob: { 
    type: Date,
    required: [true, 'La fecha de nacimiento es obligatoria.'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer not to say'],
    required: [true, 'El género es obligatorio.']
  },
  city: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  profileImageUrl: {
    type: String,
    default: 'https://t3.ftcdn.net/jpg/01/43/16/06/360_F_143160684_mlPlkWfuePOqO4QegNk1QeVm146Bku3N.jpg' // URL por defecto
  },
  portfolioLink: { 
    type: String,
    trim: true,
    default: 'www.behance.net/renatamandelman' // URL por defecto

  },
  measurements: { 
    height: { type: Number, min: 100, max: 250 }, // cm
    weight: { type: Number, min: 30, max: 200 }, // kg
    shoeSize: { type: Number }
  },
  skills: { 
    type: [String], 
  },
  experience: {
    type: String,
    enum: ['beginner', 'intermediate', 'experienced', 'pro'],
    default: 'beginner'
  },
  galleryImages: { 
    type: [String], 
    default: []
  },
  applications: [{
    type: Schema.Types.ObjectId,
    ref: 'Application' 
  }]
}, {
  timestamps: true 
});


export default mongoose.model("Model", modelSchema, "Models");

