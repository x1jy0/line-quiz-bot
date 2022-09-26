import { Component, OnInit } from '@angular/core';
import liff from '@line/liff';
import { environment } from 'src/environments/environment';
export interface Item {
  name: string;
  completed: boolean;
  items?: Item[];
}

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  //複数選択のmat-checkbox
  item: Item = {
    name: 'Indeterminate',
    completed: false,
    items: [
      { name: '1', completed: false },
      { name: '2', completed: false },
      { name: '3', completed: false },
      { name: '4', completed: false },
      { name: '5', completed: false },
    ],
  };
  log = '';
  user: any;
  userIdIndex: any;

  constructor() {
    // lineLogin処理
    liff
      .init({
        liffId: environment.SETTING_LIFF_ID,
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
