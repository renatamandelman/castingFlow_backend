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
  requirements: { // Requisitos (ej: altura, talle, habilidades)
    type: String,
    trim: true,
    maxlength: [1000, 'Los requisitos no pueden exceder los 1000 caracteres.']
  },
  location: {
    type: String,
    required: [true, 'La ubicación es obligatoria.'],
    trim: true
  },
  payRate: { // La paga por el trabajo
    type: Number,
    required: [true, 'La paga es obligatoria.'],
    min: [0, 'La paga no puede ser un número negativo.']
  },
  jobDate: { // Fecha del trabajo o del casting
    type: Date,
    required: [true, 'La fecha del trabajo es obligatoria.']
  },
  status: { // Para saber si el casting sigue abierto o ya cerró
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  
  // --- Relaciones ---

  // ¿Qué reclutador publicó este casting?
  recruiter: {
    type: Schema.Types.ObjectId, // Guarda el ID del reclutador
    ref: 'Recruiter', // Hace referencia al modelo 'Recruiter' que creamos
    required: true
  },
  
  // ¿Quiénes se postularon a este casting?
  applications: [{
    type: Schema.Types.ObjectId, // Es un array de IDs de postulaciones
    ref: 'Application' // Hace referencia al modelo 'Application'
  }]

}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Casting', castingSchema);