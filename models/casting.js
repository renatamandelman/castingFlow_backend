import mongoose from "mongoose";
const { Schema } = mongoose;

const castingSchema = new Schema({
  title: {
    type: String,
    required: [true, 'El título del casting es obligatorio.'],
    trim: true,
    minlength: [5, 'El título debe tener al menos 5 caracteres.']
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria.'],
    trim: true,
    maxlength: [2000, 'La descripción no puede exceder los 2000 caracteres.']
  },
  requirements: { 
    type: String,
    trim: true,
    maxlength: [1000, 'Los requisitos no pueden exceder los 1000 caracteres.']
  },
  location: {
    type: String,
    required: [true, 'La ubicación es obligatoria.'],
    trim: true
  },
  payRate: { 
    type: Number,
    required: [true, 'La paga es obligatoria.'],
    min: [0, 'La paga no puede ser un número negativo.']
  },
  jobDate: { 
    type: Date,
    required: [true, 'La fecha del trabajo es obligatoria.']
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  
  recruiter: {
    type: Schema.Types.ObjectId, 
    ref: 'Recruiter',
    required: true
  },
    applications: [{
    type: Schema.Types.ObjectId,
    ref: 'Application'
  }]

}, {
  timestamps: true 
});

export default mongoose.model("Casting", castingSchema, "Castings");
