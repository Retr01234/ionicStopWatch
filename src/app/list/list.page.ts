import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  users = []; // var const let not necessary before declaring variable (global only)

  constructor(private http: HttpClient, private alertDialog: AlertController) {
    this.getUsers();
  }

  async presentAlert({header, subHeader, message}) {
    const alert = await this.alertDialog.create({
      header,
      subHeader,
      cssClass: 'ionalert',
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  getUsers() {
    this.http.get('https://randomuser.me/api/?results=10')
    .pipe(map(res => res))
    .subscribe((data: any) => {
      console.log(data);
      this.users = data.results;
      this.presentAlert({
        header: 'Finished',
        subHeader: 'getusers already finished fetching data',
        message: 'great!'
      });
    }, error => {
      console.error(error);
    });
  }

  ngOnInit() {
  }

}
