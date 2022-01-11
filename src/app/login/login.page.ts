import { Component, OnInit, NgZone } from '@angular/core';
import { AngularFireAuth }  from '@angular/fire/auth';
import {Router} from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';

import { AlertController } from '@ionic/angular';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = "";
  password: string = "";
  username: string = "";


  constructor(public afAuth: AngularFireAuth,
              public alert: AlertController,
              public router: Router,
              private ngZone: NgZone,
              public afDB: AngularFireDatabase,
              public user: UserService) { afAuth.onAuthStateChanged(function(res) {
                if (res) {
                  user.setUser({
                    uid: res.uid
                  });
                  afDB.database.ref('Users/' + res.uid).child('username').get().then((snapshot) =>{
                    if(snapshot.exists()){

                      user.setUsername({
                        uname: snapshot.val()
                      })

                    }
                  });
                  

                  ngZone.run(() => router.navigate(['/home'])).then();

                  console.log('user')
                } else {
                  ngZone.run(() => router.navigate(['/login'])).then();
                  console.log('no user')
                }
              }); }

  ngOnInit() {
  }


  async login() {
    const { email, password } = this
    try {
      const res = await this.afAuth.signInWithEmailAndPassword(email, password)

      if(res.user){
        this.user.setUser({
          uid: res.user.uid
        })
      }

      const ref = this.afDB.database.ref('Users/' + res.user.uid)

      ref.child('isAdmin').get().then((snapshot) => {
        if (snapshot.exists()){
          this.showAlert("Success!", "Login successfully.")
          var role = snapshot.val()
          if (role === true){
            this.router.navigate(['/admin'])
          }
          else {

                this.afDB.database.ref('Users/' + this.user.getUID()).child('username').get().then((snapshot) =>{
                  if(snapshot.exists()){
                    this.username = snapshot.val();
                  } 
                });
                this.user.setUsername({
                  uname: this.username
                });


            this.router.navigate(['/home'])
          }
        }
      })
      
    } catch (error) {
      this.showAlert("Failed!", error.message)
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
