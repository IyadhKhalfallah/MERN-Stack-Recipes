const express=require('express')
const getAllRecipes=require('../controllers/recipes.controller').getAllRecipes
const createRecipe=require('../controllers/recipes.controller').createRecipe
const getRecipeByUser=require('../controllers/recipes.controller').getRecipeByUser
const getOneRecipe=require('../controllers/recipes.controller').getOneRecipe
const deleteAllRecipesForUser=require('../controllers/recipes.controller').deleteAllRecipesForUser
const deleteOneRecipe=require('../controllers/recipes.controller').deleteOneRecipe
const updateOneRecipe=require('../controllers/recipes.controller').updateOneRecipe


const router = express.Router();
const recipeError = new Error('No recipes found!');

router.route('/')
  // get all recipes from all users
  .get((req, res, next) => {
    getAllRecipes()
      .then(recipes => recipes.length !== 0 ? res.json(recipes) : next(recipeError))
      .catch(err => next(err));
  });

router.route('/:userid')
  // create new recipe for user
  .post((req, res, next) => {
    createRecipe(req.params.userid, req.body)
      .then(recipe => res.json(recipe))
      .catch(err => next(err));
  })
  // read all recipes for user
  .get((req, res, next) => {
    getRecipeByUser(req.params.userid)
      .then(recipes => recipes.length !== 0 ? res.json(recipes) : next(recipeError))
      .catch(err => next(err));
  })
  //delete all recipes for user
  .delete((req, res, next) => {
    deleteAllRecipesForUser(req.params.userid)
      .then(recipes => recipes.length > 0 ? res.json(recipes) : next(recipeError))
      .catch(err => next(err));
  });

router.route('/single/:recipeid')
  // read specific recipe
  .get((req, res, next) => {
    getOneRecipe(req.params.recipeid)
      // .then(recipes => res.json(recipes))
      .then(recipes => recipes ? res.json(recipes) : next(recipeError))
      .catch(err => next(err));
  })
  // update specific recipe
  .put((req, res, next) => {
    updateOneRecipe(req.params.recipeid, req.body)
      .then(recipes => recipes ? res.json(recipes) : next(recipeError))
      .catch(err => next(err));
  })
  // delete specific recipe
  .delete((req, res, next) => {
    deleteOneRecipe(req.params.recipeid)
      .then(recipes => res.json(recipes))
      .catch(err => next(err));
  });

module.exports= router;
