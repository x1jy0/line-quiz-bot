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
  answers: any;
  answerData: any;
  questionsCount = 0;
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
                // this.answerData = this.userData.answers;
                console.log('lineUser:', this.lineUser);
                console.log('userData:', this.userData);
                console.log('answerData:', this.userData.answers);
              });

              // answerの取得とユーザーの指定
              const query = {
                line_users: this.userIdIndex,
              };
              this.mainSvc
                .getAnswer(query)
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
                .subscribe((answers) => {
                  this.answers = answers;
                  console.log('answerから取得したanswer:', answers);
                });

              //カテゴリーの問題数を取得するService呼び出し
              this.mainSvc.getQuestionsCount(null).subscribe((count) => {
                this.questionsCount = count;
                this.questionsValue =
                  (this.questionsCount / this.questionsCount) * 100;
                console.log('全体の問題数:', count);
              });
              this.mainSvc
                .getCategories(null)
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
                  // // answerDataの整形
                  // this.answerData = this.userData.answers.map((answer: any) => {
                  //   return {
                  //     answerId: answer.id,
                  //     // answer: this.answers,
                  //   };
                  // });
                  // console.log('整形されたanswerData', this.answerData);

                  // カテゴリーの一覧表示
                  console.log('カテゴリー一覧:', categories);
                  this.categoriesData = categories.map((category: any) => {
                    console.log('category:', category.id, category.name);
                    console.log('category.question', category.questions);
                    return {
                      name: category.name,
                      id: category.id,
                      value: (1 / category.questions.length) * 100,
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
