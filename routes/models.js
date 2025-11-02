import express from "express";
const router = express.Router();
import Model from "../models/models.js";

const findAllModels = async (req, res) => {
  try {
    const models = await Model.find();
    return res.status(200).send({ message: "todos los modelos", models });
  } catch (error) {
    return res.status(501).send({ message: "error al obtener los modelos" });
  }
};

const findOneModel = async (req, res) => {
  const { id } = req.params;
  try {
    const model = await Model.findOne({ _id: id });
    return res.status(200).send({ message: "modelo encontrado", model });
  } catch (error) {
    return res.status(501).send({ message: "error al obtener los modelos" });
  }
};
const addModel = async (req, res) => {
  const body = req.body;
  try {
    const model = new Model(body);
    await model.save();
    return res.status(200).send({ message: "modelo creado", model });
  } catch (error) {
    return res.status(501).send({ message: "error al obtener los modelos" });
  }
};
const updateModel = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  try {
    const modelToUpdate = await Model.findByIdAndUpdate(id, body, { new: true });
    if (!modelToUpdate) {
      return res.status(404).send({ message: "no existe el modelo", id: id });
    }
    return res
      .status(200)
      .send({ message: "modelo update", modelToUpdate });
  } catch (error) {
    return res.status(501).send({ message: "error al updeatear los modelos" });
  }
};

const deleteModel = async (req, res) => {
  const { id } = req.params;
  try {
    const modelToDelete = await Model.findOne({ _id: id });
    if (!modelToDelete) {
      return res.status(404).send({ message: "no existe el modelo", id: id });
    }
    await Model.deleteOne({ _id: id });
    return res
      .status(200)
      .send({ message: "modelo deleted", productToDelete });
  } catch (error) {
    return res.status(501).send({ message: "error al deletear los modelos" });
  }
};

//CRUD endpoints
router.get("/", findAllModels);
router.get("/:id", findOneModel);
router.post("/", addModel);
router.delete("/:id", deleteModel);
router.put("/:id", updateModel);

export default router;