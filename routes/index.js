// note that .then() on promises already exectuces the exec()
// http://mongoosejs.com/docs/api.html#query_Query-then

const express=require('express')
const authRoutes='./auth.routes';
const userRoutes='./user.routes';
const recipeRoutes='./recipes.routes';
const ingRoutes='./ingredients.routes';






  const router = express.Router();

    router
      .get('/health-check', (req, res, next) => res.send('OK!'))
      .use('/users', userRoutes)
      .use('/recipes', recipeRoutes)
      .use('/ing', ingRoutes)
      .use('/auth', authRoutes(passport));


module.exports=router