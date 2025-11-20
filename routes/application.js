import { Router } from 'express';
import Application from '../models/application.js';
import Model from '../models/models.js';
import Casting from '../models/casting.js';

const router = Router();

router.post("/", async (req, res) => {
  const body = req.body;
  try {
    const { casting, model } = body;

    if (!casting || !model) {
      return res.status(400).send({ message: 'Faltan IDs de Casting o Modelo.' });
    }

    const existingModel = await Model.findById(model);
    if (!existingModel) {
      return res.status(404).send({ message: 'El ID de modelo no existe.' });
    }
    const existingCasting = await Casting.findById(casting);
    if (!existingCasting) {
      return res.status(404).send({ message: 'El ID de casting no existe.' });
    }

    const existingApplication = await Application.findOne({ casting, model });
    if (existingApplication) {
      return res.status(409).send({ message: 'Este modelo ya aplicó a este casting.' }); // 409 Conflict
    }

    const newApplication = new Application(body);
    await newApplication.save();

    existingModel.applications.push(newApplication._id);
    await existingModel.save();
    existingCasting.applications.push(newApplication._id);
    await existingCasting.save();
    
    return res.status(201).send({ message: "Aplicación creada", application: newApplication });
  } catch (error) {
    console.error("Error al crear aplicación:", error);
    return res.status(500).send({ message: "Error al crear la aplicación", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('model', 'firstName lastName email')
      .populate('casting', 'title');
    
    return res.status(200).send({ message: "Todas las aplicaciones", applications });
  } catch (error) {
    console.error("Error al obtener aplicaciones:", error);
    return res.status(500).send({ message: "Error al obtener las aplicaciones", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const application = await Application.findById(id)
      .populate('model')
      .populate('casting');
    
    if (!application) {
      return res.status(404).send({ message: "Aplicación no encontrada." });
    }
    
    return res.status(200).send({ message: "Aplicación encontrada", application });
  } catch (error) {
    console.error("Error al obtener aplicación por ID:", error);
    return res.status(500).send({ message: "Error al obtener la aplicación", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body; // Esperando algo como { "status": "shortlisted" }
  try {
    const updatedApplication = await Application.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!updatedApplication) {
      return res.status(404).send({ message: "Aplicación no encontrada para actualizar."});
    }
    
    return res.status(200).send({ message: "Aplicación actualizada", application: updatedApplication });
  } catch (error) {
    console.error("Error al actualizar aplicación:", error);
    return res.status(500).send({ message: "Error al actualizar la aplicación", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedApplication = await Application.findByIdAndDelete(id);
    
    if (!deletedApplication) {
      return res.status(404).send({ message: "Aplicación no encontrada para eliminar."});
    }

    // Opcional: Limpiar referencias
    await Model.findByIdAndUpdate(deletedApplication.model, { $pull: { applications: id } });
    await Casting.findByIdAndUpdate(deletedApplication.casting, { $pull: { applications: id } });
    
    return res.status(200).send({ message: "Aplicación eliminada", application: deletedApplication });
  } catch (error) {
    console.error("Error al eliminar aplicación:", error);
    return res.status(500).send({ message: "Error al eliminar la aplicación", error: error.message });
  }
});

// --- Rutas Específicas ---

// GET /api/applications/model/:modelId - Obtiene todas las aplicaciones de un modelo
router.get("/model/:modelId", async (req, res) => {
  const { modelId } = req.params;
  try {
   
    const applications = await Application.find({ model: modelId })
      .populate({
          path: 'casting',
          populate: { path: 'recruiter' } 
      })
      .sort({ createdAt: -1 });
    
    return res.status(200).send({ message: "Aplicaciones del modelo", applications });
  } catch (error) {
    console.error("Error al obtener aplicaciones por modelo:", error);
    return res.status(500).send({ message: "Error al obtener las aplicaciones del modelo", error: error.message });
  }
});

// GET /api/applications/casting/:castingId - Obtiene todas las aplicaciones para un casting
router.get("/casting/:castingId", async (req, res) => {
  const { castingId } = req.params;
  try {
    const applications = await Application.find({ casting: castingId })
      .populate('model', 'firstName lastName email profileImageUrl skills measurements')
      .sort({ createdAt: -1 });
    
    return res.status(200).send({ message: "Aplicaciones para el casting", applications });
  } catch (error) {
    console.error("Error al obtener aplicaciones por casting:", error);
    return res.status(500).send({ message: "Error al obtener las aplicaciones del casting", error: error.message });
  }
});

export default router;