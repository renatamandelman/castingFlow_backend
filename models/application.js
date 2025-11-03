import mongoose from "mongoose";
const { Schema } = mongoose;
const applicationSchema = new Schema({
  
  status: { // El estado de la postulación, que el reclutador puede cambiar
    type: String,
    enum: ['pending', 'shortlisted', 'rejected'], // Pendiente, Preseleccionado, Rechazado
    default: 'pending'
  },
  message: { // Mensaje opcional del modelo al reclutador
    type: String,
    trim: true,
    maxlength: [500, 'El mensaje no puede exceder los 500 caracteres.']
  },
  submittedPhotos: { // Fotos que el modelo envía específicamente para este casting
    type: [String], // Un array de URLs de imágenes
    default: []
  },

  // --- Relaciones (Las más importantes) ---

  // ¿A qué casting se está postulando?
  casting: {
    type: Schema.Types.ObjectId,
    ref: 'Casting', // Referencia al modelo 'Casting'
    required: true
  },

  // ¿Qué modelo se está postulando?
  model: {
    type: Schema.Types.ObjectId,
    ref: 'Model', // Referencia al modelo 'Model'
    required: true
  }
  
}, {
  timestamps: true // Añade createdAt (para saber cuándo aplicó) y updatedAt
});

// Para asegurar que un modelo solo pueda aplicar UNA VEZ al mismo casting
applicationSchema.index({ casting: 1, model: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema, "Applications");
