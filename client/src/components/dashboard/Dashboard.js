import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import axios from "axios";
import UserProfile from '../../UserProfile';
import RecipeCard from '../../RecipeCard';
import UserMenu from '../../UserMenu';
import { loadProgressBar } from 'axios-progress-bar';
import '../../style.module.css'
import jwt_decode from "jwt-decode";

import AddRecipeForm from '../../AddRecipeForm';
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      userID: '',
      friendUser: {},
      recipes: [],
      //friendRecipes: [],
      recipeToCopy: {},
      newRecipeName: '',
      newIng: { title: '', qty: '', unit: '' },
      ingredients:[],
      editing: false,
      pageCtrl: 0 //allows users to toggle between pages
      //addRecipeStyleState: {display:'none'}
    };

    this.eachRecipe = this.eachRecipe.bind(this);
    this.addIngredient = this.addIngredient.bind(this);
    this.delAllIngredient = this.delAllIngredient.bind(this);
    this.delIngredient = this.delIngredient.bind(this);
    this.addRecipe = this.addRecipe.bind(this);
    this.remRecipe = this.remRecipe.bind(this);
    this.removeAll = this.removeAll.bind(this);
    this.handleAddRecipe = this.handleAddRecipe.bind(this);
    this.handleAddIngTitle = this.handleAddIngTitle.bind(this);
    this.handleAddIngQty = this.handleAddIngQty.bind(this);
    this.handleAddIngUnit = this.handleAddIngUnit.bind(this);
    this.editRecipName = this.editRecipName.bind(this);
    this.toggleAddRecipe = this.toggleAddRecipe.bind(this);
    this.editIngredient = this.editIngredient.bind(this);
    //this.setLoginMethod = this.setLoginMethod.bind(this);
    this.handleError = this.handleError.bind(this);
    //this.renderAddRecipeForm = this.renderAddRecipeForm.bind(this);

  }
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
  componentDidMount() {

    loadProgressBar();
    let user=jwt_decode(localStorage.jwtToken.replace("Bearer ",""))['id']
    axios.get(`http://localhost:8080/api/recipes/${user}`)
      //axios.get(`/api/${this.state.userID}`)
      .then((res) => {
        ////console.log(res.data);
        ////console.log((typeof(res.data)==='object') && res.data.user.id!==undefined);
          //console.log('User found');
          //console.log(res.data);
          //this.setState({userID:res.data._id});
          console.log(res.data)
          this.setState({recipes: res.data, userID: user})



      }).catch(err => {
        console.error(err);
      });

  }
  getFriendRecipe = (id) => {
    //console.log (id);
    axios.get(`http://localhost:8080/api/recipes/${id}`)
      .then(res => {
        this.setState({
          friendUser: res.data,
          pageCtrl: 1
          
        });
        console.log("FriendUser Here")
        console.log(this.state.friendUser)
      }).catch(err => {
        console.error(err);
      });
  }

  toggleMyRecipe = () => {
    this.setState({
      pageCtrl: 0
    });
  }

  toggleMyProfile = () => {
    this.setState({
      pageCtrl: 2
    });
  }
  handleError(msg) {
    this.setState({
      isError: true,
      errMsg: msg
    })
  }

  toggleAddRecipe() {
    this.setState({
      editing: !this.state.editing
    });
  }

  handleAddIngTitle(event) {
    this.setState({
      newIng: { ...this.state.newIng, title: event.target.value }
    });
  }
  handleAddIngQty(event) {
    this.setState({
      newIng: { ...this.state.newIng, qty: event.target.value }
    });
  }
  handleAddIngUnit(event) {
    this.setState({
      newIng: { ...this.state.newIng, unit: event.target.value }
    });
  }

  handleAddRecipe(event) {
    this.setState({
      newRecipeName: event.target.value
    });
  }
  copyRecipe = (recipe) => {
    this.addRecipeBase(recipe);
    this.setState({
      isError: true,
      errMsg: "Recipe copied!"

    })
  }
  

parseJwt(token) {
    if (!token) { return; }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

  addRecipe() {
    this.addRecipeBase({ title: this.state.newRecipeName });
    this.toggleAddRecipe();
  }

  addRecipeBase = (newRecipe) => {
    //var newRecipe={title:this.state.newRecipeName, ingredients:[{}]};
    //var newRecipe={title:this.state.newRecipeName};
    let userID=jwt_decode(localStorage.jwtToken.replace("Bearer ",""))['id']
    axios.post(`http://localhost:8080/api/recipes/${userID}`, newRecipe)
      .then(res => {
        //console.log(res.data);
        this.setState({

        });
        if (res.data.isError === false) {
          var updatedRecipe = res.data.content;
          this.setState({
            recipes: updatedRecipe,
            newRecipeName: '',
            isError: false
          });
          //console.log(this.state.recipes);

        }
      })
      .catch(err => {
        console.error(err);
      });
  }
  remRecipe(id) {
    //post to the server and delete from the database; delete the same item locally
    axios.delete(`/api/${this.state.userID}/recipe/${id}`)
      .then(res => {
        //console.log(res.data);
        this.setState({
          isError: res.data.isError,
          errMsg: res.data.content.errors
        });
        if (res.data.isError === false) {
          var indexToDel = -1;
          this.state.recipes.forEach(function (recipe, index) {
            if (recipe._id === id) {
              indexToDel = index;
            }
          });
          //console.log(`index to del is ${indexToDel}`);
          var recipeUpdated = this.state.recipes;
          recipeUpdated.splice(indexToDel, 1);
          this.setState({
            recipes: recipeUpdated
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
  editRecipName(id, newName) {
    axios.put(`/api/${this.state.userID}/recipe/${id}`, { 'title': newName })
      .then(res => {
        //console.log(res.data);
        this.setState({
          isError: res.data.isError,
          errMsg: res.data.content.errors
        });
        if (res.data.isError === false) {
          var recipeUpdated = this.state.recipes.map(
            recipe => (recipe._id !== id) ?
              recipe : res.data.content
          );
          this.setState({
            recipes: recipeUpdated
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
  addIngredient(id) {

    //send new ingredient to the database, and the id of the recipe being added
    axios.post(`/ing/${id}`, this.state.newIng)
      .then(res => {

        //console.log(res.data);
        this.setState({
          isError: res.data.isError,

        });
        if (res.data.isError === false) {
          var newIng = res.data;
          var recipeUpdated = this.state.recipes.map(function (recipe) {
            if (recipe._id === id) {
              var addedIng=recipe.ingredients.concat(newIng);
              var newIng = res.data.content.ingredients;
              return { ...recipe, ingredients: newIng };
            } else {
              return recipe;
            }
          });
          this.setState({
            recipes: recipeUpdated,
            newIng: { title: '', qty: 0, unit: '' }
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  delIngredient(id, ingId) {
    axios.delete(`/api/${this.state.userID}/recipe/${id}/${ingId}`)
      .then(res => {
        //console.log(res.data);
        this.setState({
          isError: res.data.isError,
          errMsg: res.data.content.errors
        });
        if (res.data.isError === false) {
          var recipeUpdated = this.state.recipes.map(function (recipe) {
            if (recipe._id === id) {
              var addedIng=recipe.ingredients.concat(newIng);
              var newIng = res.data.content.ingredients;
              return { ...recipe, ingredients: newIng };
            } else {
              return recipe;
            }
          });
          this.setState({
            recipes: recipeUpdated
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  editIngredient(id, ingId, editedIng) {
    axios.put(`/api/${this.state.userID}/recipe/${id}/${ingId}`, editedIng)
      .then(res => {
        //console.log(res.data);
        this.setState({
          isError: res.data.isError,
          errMsg: res.data.content.errors
        });
        if (res.data.isError === false) {
          var recIndexToEdit = -1;
          var ingIndexToEdit = -1;
          this.state.recipes.forEach(function (recipe, index) {
            if (recipe._id === id) {
              recIndexToEdit = index;
              recipe.ingredients.forEach(function (ing, ingIndex) {
                if (ing._id === ingId) {
                  ingIndexToEdit = ingIndex;
                }
              });
            }
          });

          var recipeUpdated = this.state.recipes;
          recipeUpdated[recIndexToEdit].ingredients[ingIndexToEdit] = res.data.content;
          //console.log(recipeUpdated);	
          this.setState({
            recipes: recipeUpdated
          });

        }

      })
      .catch(err => {
        console.error(err);
      });
  }
  removeAll() {
    axios.delete(`/api/${this.state.userID}/recipeDelAll`)
      .then(res => {
        //console.log (res.data);
        this.setState({
          isError: res.data.isError,
          errMsg: res.data.content.errors
        });
        if (res.data.isError === false) {
          this.setState({
            recipes: [],
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
  delAllIngredient(id) {
    axios.delete(`/api/${this.state.userID}/recipeDelAllIng/${id}`)
      .then(res => {
        //console.log(res.data);
        this.setState({
          isError: res.data.isError,
          errMsg: res.data.content.errors
        });
        if (res.data.isError === false) {
          var recipeUpdated = this.state.recipes.map(function (recipe) {
            if (recipe._id === id) {
              var addedIng=recipe.ingredients.concat(newIng);
              var newIng = res.data.content.ingredients;
              return { ...recipe, ingredients: newIng };
            } else {
              return recipe;
            }
          });
          this.setState({
            recipes: recipeUpdated
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  eachRecipe(recipe) {
    let ing=[]
    this.state.ingredients.forEach(function(element){
      if (element['_recipe']==recipe._id){
        ing.push(element)
      }
    })
    console.log("SPECIFIC ING")
    console.log(recipe.ingredients)
    return (
      <RecipeCard
        key={recipe._id}
        id={recipe._id}
        title={recipe.title}
        ingredients={recipe.ingredients}  //mochkla
        addIng={this.addIngredient}
        remRecipe={this.remRecipe}
        delAllIng={this.delAllIngredient}
        delIng={this.delIngredient}
        editIngredient={this.editIngredient}
        handleIngTitle={this.handleAddIngTitle}
        handleIngQty={this.handleAddIngQty}
        handleIngUnit={this.handleAddIngUnit}
        saveEdit={this.editRecipName}
        pageCtrl={this.state.pageCtrl}
        copyRecipe={this.copyRecipe}
      //curRecipe = {recipe}
      ></RecipeCard>
    );
  }

  render() {
    const { user } = this.props.auth;

    return (
      <div style={{ height: "75vh" }} className="container valign-wrapper">
        <div className="row">
          <div className="landing-copy col s12 center-align">
            <h4>
            {<UserMenu toggleMyRecipe={this.toggleMyRecipe}
          toggleMyProfile={this.toggleMyProfile}

          curUser={this.state.userID}
          getFriendRecipe={this.getFriendRecipe}
        />}
            {(<div className="mt-4">
          <AddRecipeForm onChange={this.handleAddRecipe} onSaveButton={this.addRecipe} />
        </div>)}
                {
          (<div className="row">
            {this.state.recipes.map(this.eachRecipe)}
          </div>)}

        {this.state.pageCtrl === 1 &&
          (
            <div>
              <h3 className="mt-2">Selected friend's recipes</h3>
              <div className="row">
                {this.state.friendUser.map(this.eachRecipe)}
              </div>
            </div>)}
        {this.state.pageCtrl === 2 &&
          (<UserProfile
            handleError={this.handleError}
            userInfo={this.state.user}
            loginType={this.state.loginMethod}
            userIcon={this.state.loginIcon}
            userID={this.state.userID}
            numRecipes={this.state.recipes.length} />)}

              <b>Hey there,</b> {user.name.split(" ")[0]}
              <p className="flow-text grey-text text-darken-1">
                You are logged into a full-stack{" "}
                <span style={{ fontFamily: "monospace" }}>MERN</span> app 👏
              </p>
            </h4>
            <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);
