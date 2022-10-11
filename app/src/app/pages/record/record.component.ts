import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import liff from '@line/liff';
import { catchError, throwError } from 'rxjs';
import { MainService } from 'src/app/services/main.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss'],
})
export class RecordComponent implements OnInit {
  log = '';
  lineUser: any;
  userIdIndex: any;
  userData: any;
  categoriesData: any;
  questionsValue = 0;

  constructor(private mainSvc: MainService) {
    this.categoriesData = [
      {
        name: '読み込み中',
        value: 0,
      },
    ];
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
              this.lineUser = profile;
              console.log('categories:', this.categoriesData);
              // ユーザーのDB上のidを取得
              const findUser = { lineUserId: this.lineUser.userId };
              this.mainSvc.findUser(findUser).subscribe((line_users) => {
                this.userData = line_users[0];
                this.userIdIndex = line_users[0].id;
                console.log('lineUser:', this.lineUser);
                console.log('userData:', this.userData);
                console.log('answerData:', this.userData.answers);
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

                // カテゴリー表示
                .subscribe((categories) => {
                  console.log('カテゴリー一覧:', categories);
                  this.categoriesData = categories.map((category: any) => {
                    return {
                      name: category.name,
                      id: category.id,
                      value: 50,
                    };
                  });
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
