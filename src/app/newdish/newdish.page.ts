import { Component, OnInit, NgZone } from '@angular/core';
import { AngularFireAuth }  from '@angular/fire/auth';
import {Router} from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { Camera, CameraOptions  } from '@ionic-native/camera/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { UserService } from '../user.service';
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-newdish',
  templateUrl: './newdish.page.html',
  styleUrls: ['./newdish.page.scss'],
})
export class NewdishPage implements OnInit {

  base64Image: string;
  selectedFile: File = null;
  downloadURL: Observable<string>;
  recipe: string = "";
  dishimage: string = "";
  ingredients: string = "";
  procedures: string = "";
  username: string = "";

  constructor(public afAuth: AngularFireAuth,
              public router: Router,
              public afDB: AngularFireDatabase,
              public storage: AngularFireStorage,
              public camera: Camera,
              private ngZone: NgZone,
              private androidPermissions: AndroidPermissions,
              public user: UserService,
              private alertCtrl: AlertController) { afAuth.onAuthStateChanged(function(res) {
                if (res) {
                  afDB.database.ref('Users/' + res.uid).child('username').get().then((snapshot) =>{
                    if(snapshot.exists()){
                      user.setUsername({
                        uname: snapshot.val()
                      });
                    }
                    
                  });

                  user.setUser({
                    uid: res.uid
                  });
                  
                } else {
                  ngZone.run(() => router.navigate(['/login'])).then();
                  console.log('no user')
                }
              });

            }

  ngOnInit() {}
  
    

  submit(){
    if(!this.base64Image){
      this.showAlert("Failed!", "Please add dish image.");
    }
    else if(this.recipe === ""){
      this.showAlert("Failed!", "Please add recipe name.");
    }
    else if(this.ingredients === ""){
      this.showAlert("Failed!", "Please add ingredients.");
    }
    else if(this.procedures === ""){
      this.showAlert("Failed!", "Please add procedures.");
    }
    else{
    this.upload();
    }
  }

  upload(): void {
    var currentDate = Date.now();
    const file: any = this.base64ToImage(this.base64Image);
    const filePath = `Images/${currentDate}`;
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(`Images/${currentDate}`, file);
    task.snapshotChanges()
      .pipe(finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
        this.downloadURL.subscribe(downloadURL => {
          if (downloadURL) {
            var currentDate = new Date()
  
            const { recipe, ingredients, procedures, username} = this


            this.afDB.object('Recipes/' + this.user.getUID() + currentDate).set({
              uid: this.user.getUID(),
              recipe: this.recipe,
              ingredients: this.ingredients,
              username: this.user.getUsername(),
              procedures: this.procedures,
              dishimage: downloadURL,
            });

            this.showSuccesfulUploadAlert();
            this.router.navigate(['/home'])
          }
          
          console.log(downloadURL);
        });
      })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);          
        }
      });

    
  }

  async showSuccesfulUploadAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'basic-alert',
      header: 'Success!',
      message: 'Your recipe is uploaded successfully.',
      buttons: ['OK']
    });

    await alert.present();
  }


  base64ToImage(dataURI) {
    const fileDate = dataURI.split(',');
    // const mime = fileDate[0].match(/:(.*?);/)[1];
    const byteString = atob(fileDate[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
    return blob;
  }


  openCamera(){

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      result => {
        if(!result.hasPermission) {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
          .then( cam => {
            this.capturingPicture();
          })
          .catch( error => {
          });
        } else {
          this.capturingPicture();
        }
      },
      err => {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA); 
      });
  }

  capturingPicture(){

	const options: CameraOptions = {
                  mediaType: this.camera.MediaType.PICTURE,
                  quality : 100, 
                  destinationType : this.camera.DestinationType.DATA_URL, 
                  sourceType : this.camera.PictureSourceType.CAMERA,
                  encodingType: this.camera.EncodingType.JPEG,
                  targetWidth: 300,
                  targetHeight: 300,
                  saveToPhotoAlbum: false
	};  



    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = 'data:image/jpeg;base64,' + imageData;

    }, (err) => {
      // Handle error
      alert(err + '. Please try again.');
    });
  }

  uploadImage(){

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      result => {
        if(!result.hasPermission) {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
          .then( cam => {
            this.gettingPicture();
          })
          .catch( error => {
          });
        } else {
          this.gettingPicture();
        }
      },
      err => {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA); 
      });
  }

  gettingPicture(){

    this.camera.getPicture({quality: 100,
      targetHeight: 300,
      targetWidth: 300,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL}).then((res) => {
      this.base64Image = 'data:image/jpeg;base64,' + res;
      }).catch(e => {

      alert(e + '. Please try again.');
      })
      
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
