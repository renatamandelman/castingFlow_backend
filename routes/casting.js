import { Router } from 'express';
import Casting from '../models/casting.js';
import Recruiter from '../models/recruiter.js'; 

const router = Router();

// POST /api/castings - Crea un nuevo casting
router.post("/", async (req, res) => {
  const body = req.body;
  try {
    const { title, description, location, payRate, jobDate, recruiter } = body;
    if (!title || !description || !location || !payRate || !jobDate || !recruiter) {
      return res.status(400).send({ message: 'Faltan campos obligatorios.' });
    }

    const existingRecruiter = await Recruiter.findById(recruiter);
    if (!existingRecruiter) {
      return res.status(404).send({ message: 'El ID de reclutador no existe.' });
    }

    const newCasting = new Casting(body);
    await newCasting.save();

    existingRecruiter.postedCastings.push(newCasting._id);
    await existingRecruiter.save();
    
    return res.status(201).send({ message: "Casting creado", casting: newCasting });
  } catch (error) {
    console.error("Error al crear casting:", error);
    return res.status(500).send({ message: "Error al crear el casting", error: error.message });
  }
});

// GET /api/castings - Obtiene todos los castings (activos)
router.get("/", async (req, res) => {
  try {
    const castings = await Casting.find({ status: 'open' })
      .populate('recruiter', 'companyName companyLogoUrl')
      .sort({ createdAt: -1 });
    
    return res.status(200).send({ message: "Castings encontrados", castings });
  } catch (error) {
    console.error("Error al obtener castings:", error);
    return res.status(500).send({ message: "Error al obtener los castings", error: error.message });
  }
});

// GET /api/castings/:id - Obtiene un casting por su ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const casting = await Casting.findById(id)
      .populate('recruiter', 'companyName companyLogoUrl companyDescription');
    
    if (!casting) {
      return res.status(404).send({ message: "Casting no encontrado." });
    }
    
    return res.status(200).send({ message: "Casting encontrado", casting });
  } catch (error) {
    console.error("Error al obtener casting por ID:", error);
    return res.status(500).send({ message: "Error al obtener el casting", error: error.message });
  }
});

// PUT /api/castings/:id - Actualiza un casting
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  try {
    const updatedCasting = await Casting.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!updatedCasting) {
      return res.status(404).send({ message: "Casting no encontrado para actualizar."});
    }
    
    return res.status(200).send({ message: "Casting actualizado", casting: updatedCasting });
  } catch (error) {
    console.error("Error al actualizar casting:", error);
    return res.status(500).send({ message: "Error al actualizar el casting", error: error.message });
  }
});

// DELETE /api/castings/:id - Elimina un casting
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCasting = await Casting.findByIdAndDelete(id);
    
    if (!deletedCasting) {
      return res.status(404).send({ message: "Casting no encontrado para eliminar."});
    }

    // Opcional: Limpiar referencias
    await Recruiter.findByIdAndUpdate(deletedCasting.recruiter, { $pull: { postedCastings: id } });
    // Faltaría eliminar las applications...
    
    return res.status(200).send({ message: "Casting eliminado", casting: deletedCasting });
  } catch (error) {
    console.error("Error al eliminar casting:", error);
    return res.status(500).send({ message: "Error al eliminar el casting", error: error.message });
  }
});

// GET /api/castings/recruiter/:recruiterId - Obtiene castings de un reclutador
router.get("/recruiter/:recruiterId", async (req, res) => {
  const { recruiterId } = req.params;
  try {
    const castings = await Casting.find({ recruiter: recruiterId })
      .sort({ createdAt: -1 });
    
    if (castings.length === 0) {
      return res.status(404).send({ message: 'No se encontraron castings para este reclutador.'});
    }
    
    return res.status(200).send({ message: "Castings del reclutador", castings });
  } catch (error) {
    console.error("Error al obtener castings por reclutador:", error);
    return res.status(500).send({ message: "Error al obtener castings del reclutador", error: error.message });
  }
});

export default router;