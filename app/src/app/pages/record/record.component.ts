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
  userAnswerData: any;
  categoriesData: any;
  answers: any;
  answerData: any;
  questionsList: any;
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

              //全体の問題数を取得
              this.mainSvc.getQuestions(null).subscribe((question) => {
                this.questionsList = question;
                this.questionsCount = question.length;

                console.log('問題リスト:', this.questionsList);
                console.log('全体の問題数:', this.questionsCount);
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

                  // 回答済みの問題のidにtrueを入れるための配列
                  var answeredQuestion = Array(this.questionsCount);
                  answeredQuestion.fill(false);

                  // ユーザの回答した問題のquestion.id,answer.id,category.idをまとめて保存
                  this.userAnswerData = this.answers.map((answer: any) => {
                    // 回答済みの問題にtrue(これをmapでやってcat.idも持たせたら勝ちでは？)
                    // 完成したuserAnsDからまたmapかfilterしてq.idの配列作ればcat.idも持たせやすくて完璧
                    answeredQuestion[answer.questions[0].id] = true;
                    var qIndex = this.questionsList.findIndex(
                      ({ id }: any) => id === answer.questions[0].id
                    );
                    return {
                      answerId: answer.id,
                      questionId: answer.questions[0].id,
                      categoryId: this.questionsList[qIndex].categories[0].id,
                    };
                  });

                  // 全体の回答数を出すフィルター
                  var answeredQuestionCount = answeredQuestion.filter(
                    (question) => question === true
                  );
                  console.log('回答問題数:', answeredQuestionCount);
                  console.log('回答済みのデータ:', this.userAnswerData);
                  this.questionsValue =
                    (answeredQuestionCount.length / this.questionsCount) * 100;
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
                  console.log('カテゴリー一覧:', categories);

                  // カテゴリーごとのmapループ
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
