import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import liff from '@line/liff';
import { environment } from 'src/environments/environment';
import { MainService } from 'src/app/services/main.service';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  log = '';
  question: any;
  selectedChoice: number;
  selectionForm: any;
  user: any;
  userIdIndex: any;
  isCorrect = false;
  sortCorrect: boolean[] = [];
  answerData = [
    {
      Statement: 'a',
      Correct: false, //ユーザー選択と同じで正解(trueとtrueで正解,fxfは通常表示)
      selected: false, //ユーザー選択
      sortCorrect: false,
    },
    {
      Statement: 'b',
      Correct: false,
      selected: false,
      sortCorrect: false,
    },
    {
      Statement: 'c',
      Correct: false,
      selected: false,
      sortCorrect: false,
    },
    {
      Statement: 'd',
      Correct: false,
      selected: false,
      sortCorrect: false,
    },
  ];

  constructor(
    private mainSvc: MainService,
    private fb: FormBuilder,
    private router: Router
  ) {
    liff
      .init({
        liffId: environment.LIFF_ID,
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

    //numberを使うために初期化
    this.selectedChoice = -1;
  }

  ngOnInit(): void {
    //カテゴリーの絞り込み
    const query = {
      // categories: 1,
    };
    //問題を取得するService呼び出し
    this.mainSvc
      .getQuestions(query)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.log = JSON.stringify(error);
          return throwError(
            () => new Error('Something bad happened; please try again later.')
          );
        })
      )
      .subscribe((questions) => {
        const questionLength = questions.length;
        const index: number = this.getRandomInt(0, questionLength);
        console.log('取得した問題:', questions[index]);
        this.log = JSON.stringify(questions);
        // 取得した問題をquestionに代入
        this.question = questions[index];
        // 複数選択の時
        if (questions[index].Format == 'multi') {
          this.selectionForm = this.fb.group({
            selections: this.fb.array(
              questions[index].selection.map((v: any) => false)
            ),
          });
        }
      });
  }

  //並び替え問題
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.question.selection,
      event.previousIndex,
      event.currentIndex
    );
  }

  //clickonme名前を考える===========
  //selectedchoice==Correctとか
  toAnswerButton(): void {
    //userIdを取得
    console.log('userId:', this.user.userId);

    //問題種類別正誤判定

    switch (this.question.Format) {
      case 'single':
        //ユーザーの回答:this.selectedChoice
        console.log('Is Single!');
        console.log('ユーザーの選択:', this.selectedChoice);
        if (this.selectedChoice == -1) {
          console.log('未回答です');
          break;
        }
        //問題の選択肢のユーザー選択がtrueなら正解
        if (this.question.selection[this.selectedChoice].Correct) {
          this.isCorrect = true;
          this.answerData[this.selectedChoice].selected = true;
        } else {
          this.isCorrect = false;
          this.answerData[this.selectedChoice].selected = true;
        }
        break;

      case 'multi':
        this.isCorrect = true;
        //ユーザーの回答:this.selectionForm.value
        console.log('Is Multi!');
        console.log('ユーザーの選択:', this.selectionForm.value);
        for (let i = 0; i < this.question.selection.length; i++) {
          if (
            //不正解があるとCorrectがFalseになる
            this.question.selection[i].Correct !==
            this.selectionForm.value.selections[i]
          ) {
            this.isCorrect = false;
            break;
          }
        }
        break;

      case 'sort':
        this.isCorrect = true;
        //ユーザーの回答:this.question.selection[].Order
        console.log('Is Sort');
        //Orderがi++で並んでいれば正解

        for (let i = 0; i < this.question.selection.length; i++) {
          this.sortCorrect[i] = true;
          this.answerData[i].sortCorrect = true;
          if (i + 1 !== this.question.selection[i].Order) {
            this.isCorrect = false;
            this.answerData[i].sortCorrect = false;
            this.sortCorrect[i] = false;
          }
        }
        break;

      default:
        console.log('不正なFormat');
        break;
    }

    //UserIdのindex取得
    const findUser = { lineUserId: this.user.userId };
    this.mainSvc.findUser(findUser).subscribe((line_users) => {
      this.userIdIndex = line_users[0].id;
      console.log('ユーザーidのindex値:', this.userIdIndex);
      //userIdが正しいものか確認
      if (this.user.userId == line_users[0].lineUserId) {
        //bodyの中にデータを入れてあげると保存できる
        const body = {
          correct: this.isCorrect,
          questions: this.question.id,
          line_users: this.userIdIndex,
        };
        //localStorageへ渡すデータ作成
        var multiChoiceAnswer: any;
        if (this.question.Format == 'multi') {
          multiChoiceAnswer = this.selectionForm.value;
        }
        var correctData = {
          question: this.question,
          isCorrect: this.isCorrect,
        };

        // answerで使うデータに変換(answerData)
        for (let i = 0; i < this.question.selection.length; i++) {
          this.answerData[i].Statement = this.question.selection[i].Statement;
          this.answerData[i].Correct = this.question.selection[i].Correct;
          // // 単一選択の選択したものにtrue
          // this.answerData[this.selectedChoice].selected = true;
          if (this.question.Format == 'multi') {
            this.answerData[i].selected =
              this.selectionForm.value.selections[i];
          }
        }

        //localStorageへ保存
        localStorage.setItem('correctData', JSON.stringify(correctData));
        localStorage.setItem('answerData', JSON.stringify(this.answerData));
        console.log(
          '保存されたデータ(correctData):',
          JSON.parse(localStorage.getItem('correctData') ?? '')
        );
        console.log(
          '保存されたデータ(answerData):',
          JSON.parse(localStorage.getItem('answerData') ?? '')
        );

        //保存処理
        this.mainSvc.createAnswer(body).subscribe((res) => {
          console.log('createAnswer:', res);
          //画面を遷移
          this.router.navigateByUrl('/answer');
        });
      } else {
        console.log('不正な動作です');
      }
    });
  }

  //問題を表示するためのランダムチョイス
  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
}
