import mongoose from "mongoose";
const { Schema } = mongoose;
const applicationSchema = new Schema({
  
  status: { 
    type: String,
    enum: ['pendiente', 'preseleccionado', 'rechazado', 'aceptado'], 
    default: 'pendiente'
  },
  message: { // Mensaje opcional del modelo al reclutador
    type: String,
    trim: true,
    default: 'hola como estas',
    maxlength: [500, 'El mensaje no puede exceder los 500 caracteres.']
  },
  submittedPhotos: { 
    type: [String], 
    default: []
  },


  casting: {
    type: Schema.Types.ObjectId,
    ref: 'Casting', 
    required: true
  },

  model: {
    type: Schema.Types.ObjectId,
    ref: 'Model', 
    required: true
  }
  
}, {
  timestamps: true 
});

// Para asegurar que un modelo solo pueda aplicar UNA VEZ al mismo casting
applicationSchema.index({ casting: 1, model: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema, "Applications");
