import React, { Component } from 'react';
import './style.css';
import UserList from './UserList';
import axios from 'axios';

class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }

  componentDidMount() {
    //console.log('Menu initiated');
    axios.get('http://localhost:8080/api/users')
      .then(res => {
        console.log("Here")
        console.log(Object.values(res.data));
        this.setState({ users:[]});
        this.state.users.forEach(user => {
          console.log(user._id);
        })
      }).catch(err => {
        console.error(err);
      });
  }



  eachUser = (user) => {
    ////console.log (user._id);
    ////console.log (this.props.curUser);
    console.log("MyUser")
    console.log(user)
    return (
      (this.props.curUser !== user._id) &&
      (
        <UserList
          key={user._id}
          id={user._id}
          display={user.username}
          getRecipes={this.props.getFriendRecipe}
        ></UserList>
      )
    );
  }

  //need to get all usernames here
  render() {
    return (
      <div>
        <ul className="nav nav-tabs mt-2 mb-2">
          <li className="nav-item">
            <a className="nav-link" href="#" onClick={this.props.toggleMyRecipe}>My Recipes</a>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">All Recipes</a>
            <div className="dropdown-menu">
            <a className="dropdown-item" href="http://google.com">Action</a>
              {this.state.users.map(this.eachUser)}
            </div>
          </li>

          <li className="nav-item">
            <a className="nav-link" onClick={this.props.toggleMyProfile} href="#">Profile</a>
          </li>
        </ul>
      </div>
    )
  }
}

export default UserMenu;