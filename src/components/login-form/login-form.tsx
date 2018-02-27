import { Component, State, Event, EventEmitter } from '@stencil/core';
import firebase from 'firebase';

@Component({
  tag: 'login-form',
  styleUrl: 'login-form.scss'
})
export class LoginForm {

  @State() email: string;
  @State() password: string;
  @State() username: string;
  @Event() closeMenu: EventEmitter;

  componentDidLoad() {

  }

  login(e) {
    console.log('Login' ,e );
    e.preventDefault();
    this.email = e.target[0].value;
    this.password = e.target[2].value;
    firebase.auth().signInWithEmailAndPassword(this.email, this.password).catch(function(error) {
        // Handle Errors here.
        console.warn(error);
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // ...
    }).then( () => {
        this.closeMenu.emit();        
    });
  }

  async createUser(e) {
    console.log('Create user', e, this.email, this.password);
    e.preventDefault();
    this.email = e.target[0].value;
    this.password = e.target[2].value;
    this.username = e.target[4].value;
    try {
        let user = await firebase.auth().createUserWithEmailAndPassword(this.email, this.password);
        await user.updateProfile({
            displayName: this.username
        });
        console.log('Updated Profile');
        this.closeMenu.emit();
    } catch (err) {
        console.warn(err);
    }
  }

  closeForm() {
    this.closeMenu.emit(true);
  }

  render() {
    return (
        <ion-content class="login-form">
            <div class="content">
                <button onClick={() => this.closeForm() } class="close-button"> close x </button>
                <div class="header"> Login </div>
                <form onSubmit={ (e) => this.login(e)}>
                    <ion-label>Email</ion-label>
                    <ion-input type="email"/>
                    <ion-label>Password</ion-label>
                    <ion-input type="password" />
                    <button class="submit-button">Login</button>
                </form>
                <div class="header"> Create Account </div>
                <form onSubmit={ (e) => this.createUser(e)}>
                    <ion-label>Email</ion-label>
                    <ion-input type="email" />
                    <ion-label>Password</ion-label>
                    <ion-input type="password"/>
                    <ion-label>Username</ion-label>
                    <ion-input type="text" />
                    <button class="submit-button">Create User</button>
                </form>
            </div>
        </ion-content>
    );
  }
}
