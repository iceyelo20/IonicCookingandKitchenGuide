import { Component, OnInit, NgZone } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth }  from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-dishview',
  templateUrl: './dishview.page.html',
  styleUrls: ['./dishview.page.scss'],
})
export class DishviewPage implements OnInit {

  dishList: any[];
  uid: string = "";
  dish: any;
  dishkey: any;

  constructor(public afAuth: AngularFireAuth,
              public router: Router,
              public route: ActivatedRoute,
              public afDB: AngularFireDatabase,
              public user: UserService,
              public alert: AlertController,
              private ngZone: NgZone) { 

                afAuth.onAuthStateChanged(function(res) {
                  if (res) {
                    afDB.database.ref('Users/' + res.uid).child('username').get().then((snapshot) =>{
                      if(snapshot.exists()){
                        user.setUsername({
                          uname: snapshot.val()
                        })                
                      }
                    });
            
                  } else {
                    ngZone.run(() => router.navigate(['/login'])).then();
                  }
                });

              }

  ngOnInit() { 
    this.dishkey = this.route.snapshot.paramMap.get('id');
    this.afDB.object("Recipes/" + this.dishkey).valueChanges().subscribe(details => {
    this.dish = details;
    this.dishList = Array.of(this.dish);

  });

  this.afAuth.authState.subscribe( user => {
    if (user) { 
      this.uid = user.uid }
  });

  }

  edit(){
    const editID = this.dishkey;
    this.router.navigate(['/dishedit', { editID }]);
  }

  remove(){
    this.afDB.object('Recipes/' + this.dishkey).remove();
    this.router.navigate(['/home']);
    this.showAlert("Success!", "Remove successfully.")
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
