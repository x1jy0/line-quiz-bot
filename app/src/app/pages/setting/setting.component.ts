import { Component, OnInit } from '@angular/core';
import liff from '@line/liff';
import { MainService } from 'src/app/services/main.service';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

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
  // 表示用配列
  categoriesData = [
    { name: '読み込み中...', completed: false },
    { name: '読み込み中...', completed: false },
    { name: '読み込み中...', completed: false },
    { name: '読み込み中...', completed: false },
  ];
  log = '';
  // line側のuserData
  user: any;
  // DBのuserData
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
              const findUser = { lineUserId: this.user.userId };
              this.mainSvc.findUser(findUser).subscribe((line_users) => {
                this.userIdIndex = line_users[0];
              });
              console.log('userData:', this.user);
              console.log('userIdIndex:', this.userIdIndex);
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
                  // 表示用配列にnameを代入するループ
                  for (let i = 0; i < categories.length; i++) {
                    this.categoriesData[i].name = categories[i].name;
                  }
                  console.log(
                    '選択されているカテゴリー',
                    this.userIdIndex.categories
                  );
                  console.log('表示用配列:', this.categoriesData);
                  // ユーザー選択を代入するループ
                  for (let i = 0; i < this.userIdIndex.categories.length; i++) {
                    // カテゴリー一覧からユーザーが選択してるカテゴリーのindexを取得
                    const found = categories.findIndex(
                      (element: { name: string }) => {
                        return (
                          element.name == this.userIdIndex.categories[i].name
                        );
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

  closeLiff() {
    liff.closeWindow();
  }
}
