import mongoose from "mongoose";
const { Schema } = mongoose;

const recruiterSchema = new Schema({
  companyName: {
    type: String,
    required: [true, 'El nombre de la empresa es obligatorio.'],
    trim: true, 
    minlength: [2, 'El nombre de la empresa debe tener al menos 2 caracteres.']
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
  companyWebsite: {
    type: String,
    trim: true,
    
  },
  contactPerson: { 
    type: String,
    trim: true
  },
  companyDescription: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción de la empresa no puede exceder los 1000 caracteres.']
  },
  companyLogoUrl: { 
    type: String,
    default: 'logo.png' // URL por defecto
  },
  postedCastings: [{
    type: Schema.Types.ObjectId,
    ref: 'Casting' 
  }]
}, {
  timestamps: true 
});


export default mongoose.model("Recruiter", recruiterSchema, "Recruiters");
