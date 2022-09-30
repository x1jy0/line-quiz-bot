import { Component, OnInit } from '@angular/core';
import liff from '@line/liff';
import { MainService } from 'src/app/services/main.service';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
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
  categories: any;
  // 表示用配列
  listCategories = [
    { name: '読み込み中...', completed: false },
    { name: '読み込み中...', completed: false },
    { name: '読み込み中...', completed: false },
    { name: '読み込み中...', completed: false },
  ];
  log = '';
  user: any;
  userIdIndex: any;

  constructor(private mainSvc: MainService) {
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
              const findUser = { lineUserId: this.user.userId };
              this.mainSvc.findUser(findUser).subscribe((line_users) => {
                this.userIdIndex = line_users[0];
                console.log('userIdIdex:', this.userIdIndex);
              });
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

  ngOnInit(): void {
    const delay_observable = of('').pipe(delay(5000));
    delay_observable.subscribe((s) => {
      console.log('delay!');
      //カテゴリーの絞り込み(不要なので省略)
      const query = {};
      //カテゴリーを取得するService呼び出し
      this.mainSvc
        .getCategories(query)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.log = JSON.stringify(error);
            return throwError(
              () => new Error('Something bad happened; please try again later.')
            );
          })
        )
        .subscribe((categories) => {
          console.log('取得した項目:', categories);
          this.categories = categories;
          // 表示用配列にnameと選択状況(completed)を代入する
          for (let i = 0; i < categories.length; i++) {
            console.log(categories[i].name);
            this.listCategories[i].name = categories[i].name;
            // this.listCategories[i].completed = true;
          }
          console.log(this.userIdIndex.categories);
          console.log('表示用配列:', this.listCategories);
          // const array1 = [{ name: '学校' }, { name: '家' }];

          for (let i = 0; i < this.userIdIndex.categories.length; i++) {
            const found = categories.findIndex((element: { name: string }) => {
              // console.log('findの中:', element);
              // console.log('userIdIndex:', this.userIdIndex.categories[0].name);
              return element.name == this.userIdIndex.categories[i].name;
            });

            console.log(i, 'found:', found);
            this.listCategories[found].completed = true;
          }
        });
    });
  }

  closeLiff() {
    liff.closeWindow();
  }
}
