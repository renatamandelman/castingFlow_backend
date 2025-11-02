import express from "express";
const router = express.Router();
import Recruiter from "../models/recruiter.js";

const findAllRecruiters= async (req, res) => {
  try {
    const recruiters = await Recruiter.find();
    return res.status(200).send({ message: "todos los reclutadores", recruiters });
  } catch (error) {
    return res.status(501).send({ message: "error al obtener los reclutadores" });
  }
};

const findOneRecruiter = async (req, res) => {
  const { id } = req.params;
  try {
    const recruiter = await Recruiter.findOne({ _id: id });
    return res.status(200).send({ message: "reclutador encontrado", recruiter });
  } catch (error) {
    return res.status(501).send({ message: "error al obtener los reclutadores" });
  }
};
const addRecruiter = async (req, res) => {
  const body = req.body;
  try {
    const recruiter = new Recruiter(body);
    await recruiter.save();
    return res.status(200).send({ message: "reclutador creado", recruiter });
  } catch (error) {
    return res.status(501).send({ message: "error al obtener los reclutadores" });
  }
};
const updateRecruiter = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  try {
    const recruiterToUpdate = await Recruiter.findByIdAndUpdate(id, body, { new: true });
    if (!recruiterToUpdate) {
      return res.status(404).send({ message: "no existe el reclutador", id: id });
    }
    return res
      .status(200)
      .send({ message: "reclutador update", recruiterToUpdate });
  } catch (error) {
    return res.status(501).send({ message: "error al updeatear los reclutadores" });
  }
};

const deleteRecruiter = async (req, res) => {
  const { id } = req.params;
  try {
    const recruiterToDelete = await Recruiter.findOne({ _id: id });
    if (!recruiterToDelete) {
      return res.status(404).send({ message: "no existe el reclutador", id: id });
    }
    await Recruiter.deleteOne({ _id: id });
    return res
      .status(200)
      .send({ message: "reclutador deleted", recruiterToDelete });
  } catch (error) {
    return res.status(501).send({ message: "error al deletear los reclutadores" });
  }
};

//CRUD endpoints
router.get("/", findAllRecruiters);
router.get("/:id", findOneRecruiter);
router.post("/", addRecruiter);
router.delete("/:id", deleteRecruiter);
router.put("/:id", updateRecruiter);

export default router;