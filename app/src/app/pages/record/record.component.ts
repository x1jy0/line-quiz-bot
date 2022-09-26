import { Component, OnInit } from '@angular/core';
import liff from '@line/liff';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss'],
})
export class RecordComponent implements OnInit {
  log = '';
  user: any;
  userIdIndex: any;

  constructor() {
    // lineLogin処理
    liff
      .init({
        liffId: environment.RECORD_LIFF_ID,
      })
      .then(() => {
        // Start to use liff's api
        // login call, only when external browser or LINE's in-app browser is used
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          liff
            .getProfile()
            //getProfileの戻り値
            .then((profile) => {
              this.user = profile;
              console.log('UserData:', this.user);
            })
            .catch((err) => {
              console.log('error', err);
            });
        }
      })
      .catch((err) => {
        // Error happens during initialization
        console.log(err.code, err.message);
      });
  }

  ngOnInit(): void {}

  closeLiff() {
    liff.closeWindow();
  }
}
