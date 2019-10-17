const express=require('express')
const getAllIng=require('../controllers/ingredients.controller').getAllIng
const createIng=require('../controllers/ingredients.controller').createIng
const getIngByRecipe=require('../controllers/ingredients.controller').getIngByRecipe
const deleteAllIngForRecipe=require('../controllers/ingredients.controller').deleteAllIngForRecipe
const getOneIng=require('../controllers/ingredients.controller').getOneIng
const updateOneIng=require('../controllers/ingredients.controller').updateOneIng
const deleteOneIng=require('../controllers/ingredients.controller').deleteOneIng

const router = express.Router();

const ingError = new Error('No ingredients found!');

router.route('/health')
  .get((req, res, next) => res.send('OK'));

router.route('/')
  .get((req,res,next) => {
    getAllIng()
      .then(ing => ing.length !== 0 ? res.json(ing) : next(ingError))
      .catch( err => next(err));
  });

router.route('/:recipeid')
  // create new ing for recipe
  .post((req, res, next) => {
    createIng(req.params.recipeid, req.body)
      .then(ing => res.json(ing))
      .catch(err => next(err));
  })
  // read all ing for recipe
  .get((req, res, next) => {
    getIngByRecipe(req.params.recipeid)
      .then(ing => ing.length !== 0 ? res.json(ing) : next(ingError))
      .catch(err => next(err));
  })
  //delete all recipes for user
  .delete((req, res, next) => {
    deleteAllIngForRecipe(req.params.recipeid)
      .then(ing => ing.length > 0 ? res.json(ing) : next(ingError))
      .catch(err => next(err));
  });

router.route('/single/:ingid')
  // read specific recipe
  .get((req, res, next) => {
    getOneIng(req.params.ingid)
      // .then(recipes => res.json(recipes))
      .then(ing => ing ? res.json(ing) : next(ingError))
      .catch(err => next(err));
  })
  // update specific recipe
  .put((req, res, next) => {
    updateOneIng(req.params.ingid, req.body)
      .then(ing => ing ? res.json(ing) : next(ingError))
      .catch(err => next(err));
  })
  .delete((req, res, next) => {
    deleteOneIng(req.params.ingid)
      .then(ing => res.json(ing))
      .catch(err => next(err));
  });

module.exports= router;
