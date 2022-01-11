import { Component, NgZone } from '@angular/core';
import { AngularFireAuth }  from '@angular/fire/auth';
import {Router} from '@angular/router';
import { UserService } from '../user.service';
import { AlertController } from '@ionic/angular';

import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  dishList: any[];
  keyID: string="";

  constructor(public afAuth: AngularFireAuth,
              public router: Router,
              private ngZone: NgZone,
              public afDB: AngularFireDatabase,
              public user: UserService,
              private alertCtrl: AlertController) {

                afDB.list('Recipes').valueChanges()   // returns observable
                .subscribe(list=> {
                this.dishList = list;
                console.log(this.dishList);
             });

             afAuth.onAuthStateChanged(function(res) {
              if (res) {
                
                afDB.database.ref('Users/' + res.uid).child('username').get().then((snapshot) =>{
                  if(snapshot.exists()){
                    user.setUsername({
                      uname: snapshot.val()
                    });
                    user.setUser({
                      uid: res.uid
                    });
                  }
                });


              } else {
                ngZone.run(() => router.navigate(['/login'])).then();
              }
            });
            }

  ngOnInit() {}

  dishView(i) {

    this.afDB.database.ref('Recipes/').get().then((snapshot) =>{
      if(snapshot.exists()){
        const id = Object.keys(snapshot.val())[i];
        console.log(id);
        this.router.navigate(['/dishview', { id }]);
      }
    });

  }

  logout() {
    this.afAuth.signOut().then(() => {
        this.router.navigate(['/login']);
      })
      this.showAlert("Success!", "Logout successfully.");
  }

    addDish() {
      this.router.navigate(['/newdish'])
    }

    async showAlert(header: string, message: string) {
      const alert = await this.alertCtrl.create({
        header,
        message,
        buttons: ["Ok"]
      })
  
      await alert.present()
  }
}
