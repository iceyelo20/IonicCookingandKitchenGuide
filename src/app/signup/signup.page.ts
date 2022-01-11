import { Component, OnInit, NgZone } from '@angular/core';
import { AngularFireAuth }  from '@angular/fire/auth';
import {Router} from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';

import { AlertController } from '@ionic/angular';
import { UserService } from '../user.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  email: string = ""
  username: string = ""
  password: string = ""
  confirmPassword: string = ""

  constructor(public afAuth: AngularFireAuth,
              public alert: AlertController,
              public router: Router,
              public afDB: AngularFireDatabase,
              public user: UserService,
              private ngZone: NgZone) {
                afAuth.onAuthStateChanged(function(res) {
                if (res) {

                  ngZone.run(() => router.navigate(['/home'])).then();

                } else {
                  ngZone.run(() => router.navigate(['/signup'])).then();
                  console.log('no user')
                }
              });
             }

  ngOnInit() {
  }

  async signup() {

    this.afDB.database.ref('Users').orderByChild("username").equalTo(this.username).once("value",snapshot => {
      if (snapshot.exists()){
        const userData = snapshot.val();
        this.showAlert("Try again!", "Username already exists.")
      }else{
        this.checkUser();
      }
  });


  }

  async checkUser(){
    const { email, username, password, confirmPassword } = this

    if(password !== confirmPassword){
      this.showAlert("Error!", "Password don't match.")
      return console.error("Password don't match.")
    }

    try {
      const res = await this.afAuth.createUserWithEmailAndPassword(email, password)

        this.user.setUser({
          uid: res.user.uid
          
        })

        this.user.setUsername({
          uname: this.username
        })

      this.afDB.object('Users/' + res.user.uid).set({
        email: this.email,
        username: this.username,
        isAdmin: false
      });


      this.showAlert("Success!", "Successfully register.")
      this.ngZone.run(() => this.router.navigate(['/home'])).then();
    } catch (error) {
      this.showAlert("Error!", error.message)
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ["Ok"]
    })

    await alert.present()
  }
}
