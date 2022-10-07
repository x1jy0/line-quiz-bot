import { Component, OnInit } from '@angular/core';
import liff from '@line/liff';
import { MainService } from 'src/app/services/main.service';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  // 表示用配列
  categoriesData = [
    { name: '読み込み中...', completed: false },
    { name: '読み込み中...', completed: false },
    { name: '読み込み中...', completed: false },
    { name: '読み込み中...', completed: false },
  ];
  log = '';
  // line側のuserData
  lineUser: any;
  // DBのuserData
  userIdIndex: any;
  userData: any;

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
              this.lineUser = profile;
              // ユーザーのDB上のidを取得
              const findUser = { lineUserId: this.lineUser.userId };
              this.mainSvc.findUser(findUser).subscribe((line_users) => {
                this.userData = line_users[0];
                this.userIdIndex = line_users[0].id;
                console.log('lineUser:', this.lineUser);
                console.log('userData:', this.userData);
              });

              //カテゴリーの絞り込み(不要なので省略)
              const query = {};
              //カテゴリーを取得するService呼び出し
              this.mainSvc
                .getCategories(query)
                .pipe(
                  catchError((error: HttpErrorResponse) => {
                    this.log = JSON.stringify(error);
                    return throwError(
                      () =>
                        new Error(
                          'Something bad happened; please try again later.'
                        )
                    );
                  })
                )

                // カテゴリー表示とユーザーの選択を表示
                .subscribe((categories) => {
                  console.log('カテゴリー一覧:', categories);
                  this.categoriesData = categories.map((category: any) => {
                    return {
                      name: category.name,
                      id: category.id,
                      completed: false,
                    };
                  });

                  // ユーザー選択を代入するループ
                  for (let i = 0; i < this.userData.categories.length; i++) {
                    // カテゴリー一覧からユーザーが選択してるカテゴリーのindexを取得
                    const found = categories.findIndex(
                      (element: { name: string }) => {
                        return element.name == this.userData.categories[i].name;
                      }
                    );
                    // ユーザーが選択しているカテゴリーをチェックされた状態にする
                    this.categoriesData[found].completed = true;
                  }
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

  ngOnInit(): void {}

  saveAndClose() {
    //bodyの中にデータを入れてあげると保存できる
    // ユーザー選択がtrueの物のidを数字配列にして指定
    const body = {
      categories: this.categoriesData
        .filter((category) => category.completed == true)
        .map((category: any) => {
          return category.id;
        }),
    };
    console.log('選択されたカテゴリーのid:', body);
    //保存処理
    this.mainSvc.saveCategories(this.userIdIndex, body).subscribe((res) => {
      console.log('saveCategories:', res);
      liff.closeWindow();
    });
  }
}
