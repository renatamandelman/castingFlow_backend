import express from "express";
import Model from "../models/models.js";
import Recruiter from "../models/recruiter.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await Model.findOne({ email });
    let role = "model";

    // Si no existe como Model, buscar como Recruiter
    if (!user) {
      user = await Recruiter.findOne({ email });
      role = "recruiter";
    }

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }
    console.log(password)
    
    if (user.password !== password) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }


    // Enviar respuesta
    res.json({
      message: "Login exitoso",
      user,
      role
    });

  } catch (error) {
    console.log("Error en login:", error);
    res.status(500).json({ message: "Error en el login" });
  }
});

export default router;
