const express=require('express');
const listUsers=require('../controllers/user.controller').listUsers
const createUser=require('../controllers/user.controller').createUser
const deleteUser=require('../controllers/user.controller').deleteUser
const updateUser=require('../controllers/user.controller').updateUser
const getOneUser=require('../controllers/user.controller').getOneUser
const router = express.Router();

router.route('/')
  .get((req, res, next) => {
    listUsers()
      .then(users => res.json(users))
      .catch(err => next(err));
  })
  .post((req, res, next) => {
    createUser({
      username:req.body.username,
      email:req.body.email,
      password:req.body.password
    })
      .then(user => res.json(user))
      .catch(err => next(err));
  });

router.route('/:id')
  .get((req, res, next) => {
    getOneUser(req.params.id)
      .then(users => res.json(users))
      .catch(err => next(err));
  })
  .delete((req, res, next) => {
    deleteUser(req.params.id)
      .then(user => res.json(user))
      .catch(err => next(err));
  })
  .put((req, res, next) => {
    updateUser(req.params.id, req.body)
      .then(users => res.json(users))
      .catch(err => next(err));
  });

module.exports=router;
