import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import liff from '@line/liff';
import { catchError, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
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
  userAnswerData: any;
  categoriesData: any;
  answerData: any;
  questionsList: any;
  excludingDuplicatesQuestions: any;
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
                console.log('lineUser:', this.lineUser);
                console.log('userData:', this.userData);
                console.log('answerData:', this.userData.answers);
              });

              //全体の問題数を取得
              this.mainSvc.getQuestions(null).subscribe((question) => {
                this.questionsList = question;
                this.questionsCount = question.length;
                console.log('問題リスト:', this.questionsList);
              });

              // ユーザーの回答を取得
              const query = {
                line_users: this.userIdIndex,
              };
              this.mainSvc
                .getAnswer(query)
                .pipe(
                  catchError((error: HttpErrorResponse) => {
                    this.log = JSON.stringify(error);
                    delay(3000);
                    return throwError(
                      () =>
                        new Error(
                          'Something bad happened; please try again later.'
                        )
                    );
                  })
                )
                .subscribe((answers) => {
                  // ユーザの回答した問題のquestion.id,answer.id,category.idをまとめて保存
                  this.userAnswerData = answers.map((answer: any) => {
                    var qIndex = this.questionsList.findIndex(
                      ({ id }: any) => id === answer.questions[0].id
                    );
                    return {
                      answerId: answer.id,
                      questionId: answer.questions[0].id,
                      categoryId: this.questionsList[qIndex].categories[0].id,
                    };
                  });

                  // 重複を取り除く処理(変数名が長い)
                  this.excludingDuplicatesQuestions =
                    this.userAnswerData.filter(
                      (element: any, index: any, self: any) =>
                        self.findIndex(
                          (e: any) => e.questionId === element.questionId
                        ) === index
                    );

                  // 結果を出力
                  console.log(
                    '重複を排除した回答済み問題:',
                    this.excludingDuplicatesQuestions
                  );

                  // 全体の解答率を計算
                  this.questionsValue = Math.floor(
                    (this.excludingDuplicatesQuestions.length /
                      this.questionsCount) *
                      100
                  );
                });

              // カテゴリを取得
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
                  }),
                  delay(3000)
                )

                // カテゴリー表示
                .subscribe((categories) => {
                  console.log('カテゴリー一覧:', categories);
                  // カテゴリーごとのmapループ
                  this.categoriesData = categories.map((category: any) => {
                    // カテゴリごとの回答数を集計
                    const filter = this.excludingDuplicatesQuestions.filter(
                      ({ categoryId }: any) => categoryId === category.id
                    );
                    return {
                      name: category.name,
                      id: category.id,
                      value: Math.floor(
                        (filter.length / category.questions.length) * 100
                      ),
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
