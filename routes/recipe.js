const express = require("express");
const z = require("zod");
const { findAllRecipes, saveRecipe, updateRecipe, deleteRecipe} = require("../database/recipe");
const {recipe} = require("../database/recipe");
const auth = require("../middlewares/auth");

const router = express.Router();

const RecipeSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  preparationTime: z.number().min(1),
});

router.get("/recipe", auth , async (req, res) => {
  const recipe = await findAllRecipes(req.userId);
  res.json({ recipe });
});

router.post("/recipe", auth ,async (req, res) => {
  try {
    const recipe = RecipeSchema.parse(req.body);
    const userId = req.userId;
    const savedRecipe = await saveRecipe(recipe, userId);
    res.status(201).json({
      recipe: savedRecipe 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({
        message: error.errors,
      });
    }
    res.status(500).json({
      message: "server error",
    });
  }
});


router.put("/recipe/:id", auth ,async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = RecipeSchema.parse(req.body);
    const userId = req.userId;
    const updatedRecipe = await updateRecipe(recipeId, recipe, userId);
    res.status(201).json({
      recipe: updatedRecipe
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({
        message: error.errors,
      });
    }
    res.status(500).json({
      message: "server error",
    });
  }
});

router.delete("/recipe/:id", auth ,async (req, res) => {
  try {
    const recipeId = req.params.id;
    const userId = req.userId;
    const deletedRecipe = await deleteRecipe(recipeId, userId);
    res.status(201).json({
      recipe: deletedRecipe
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({
        message: error.errors,
      });
    }
    res.status(500).json({
      message: "server error",
    });
  }
});

module.exports = router;