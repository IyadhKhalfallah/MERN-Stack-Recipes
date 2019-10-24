import React, { Component } from 'react';
import axios from 'axios';
import PasswordForm from './PasswordForm';
import classes from './css/userProfile.module.css'; /*import*/
/*import classes from './css/userProfile.module.css';*/

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changePassToggle: false,
      changeDeleteToggle: false
    }
  }
  componentDidMount() {
    //console.log(this.props.userInfo);
  }
  showPassForm = () => {
    this.setState({
      changePassToggle: !this.state.changePassToggle
    })
  }
  showDelTog = () => {
    this.setState({
      changeDeleteToggle: !this.state.changeDeleteToggle
    })
  }
  deleteAccount = () => {
    console.log("OK :'(");
    axios({
      method: 'post',
      url: `/api/${this.props.userID}/deleteAccount`,
      data: {
      }
    }).then(res => {
      //console.log(res.data);
      this.props.handleError("Account Deleted, logging out!");
      window.location = '/';
    }).catch(err => {
      //console.log(err.response.data);
      this.props.handleError(err.response.data.error);
    });
  }
  render() {

    return (
      <div>
        <div className='col-12 col-sm-6'>
          <div className="card">
            <div className={classes.cardHeader}>
              <h3 className={classes.Info}>{this.props.userInfo}</h3>
              <i className={this.props.userIcon} aria-hidden="true"></i>
            </div>
            <div className="card-block">
              <p className="card-text ml-3 mt-2">Total Recipes : {this.props.numRecipes}</p>
              {this.props.loginType === 'local' && (<button className="btn ml-3 mb-2" className={classes.button} onClick={this.showPassForm}>Change Password</button>)}
              {this.state.changePassToggle && (<PasswordForm
                showPassForm={this.showPassForm}
                handleError={this.props.handleError}
                userID={this.props.userID} />)}
              {!this.state.changeDeleteToggle &&
                (<p><button className="btn btn-danger ml-3" className={classes.button} onClick={this.showDelTog}>Delete Account</button></p>
                )}
              {this.state.changeDeleteToggle &&
                (<p>
                  <button className="btn btn-success ml-3 mb-2" className={classes.button} sonClick={this.showDelTog}>Keep Account</button>
                </p>)}
              {this.state.changeDeleteToggle &&
                (<p>
                  <button className="btn btn-danger ml-3" className={classes.button} onClick={this.deleteAccount}>Confirm Delete!</button>
                </p>)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UserProfile;
