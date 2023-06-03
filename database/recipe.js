const prisma = require("./prisma");

const findAllRecipes = (userId) => {
  return prisma.recipe.findMany({
    where: {
      userId,

    },
  });
};

const saveRecipe = (recipe, userId) => {
  return prisma.recipe.create({
    data: {
      name: recipe.name,
      description: recipe.description,
      preparationTime: recipe.preparationTime,
      userId: userId,
    },
  });
};

const updateRecipe = async(recipeId, { name, description, preparationTime }, userId) => {
  const id = Number(recipeId);

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    select: { userId: true }
  });

  if (!recipe) throw new Error("Recipe Not Found");
  if (recipe.userId !== userId) throw new Error("Not Authorized");

  return prisma.recipe.update({
    where: { id },
    data: { 
      name,
      description,
      preparationTime
    }
  });

}

const deleteRecipe = async(recipeId, userId) => {
  const id = Number(recipeId);

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    select: { userId: true }
  });

  if (!recipe) throw new Error("Recipe Not Found");
  if (recipe.userId !== userId) throw new Error("Not Authorized");

  return prisma.recipe.delete({
    where: { id }
  });
}



module.exports = {
  findAllRecipes,
  saveRecipe,
  updateRecipe,
  deleteRecipe,
};