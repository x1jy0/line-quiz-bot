import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import liff from '@line/liff';
import { environment } from 'src/environments/environment';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  question: any;
  selectedChoice: number;
  selectionForm: any;
  user: any;
  userIdIndex: any;
  isCorrect = false;

  constructor(private mainSvc: MainService, private fb: FormBuilder) {
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
    this.mainSvc.getQuestions(query).subscribe((questions) => {
      const questionLength = questions.length;
      const index: number = this.getRandomInt(0, questionLength);
      //console.log('問題一覧:',questions);
      console.log('取得した問題:', questions[index]);
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
        console.log(this.selectedChoice);
        if (this.selectedChoice == -1) {
          console.log('未回答です');
          break;
        }
        //問題の選択肢のユーザー選択がtrueなら正解
        if (this.question.selection[this.selectedChoice].Correct) {
          console.log('Is True!');
          this.isCorrect = true;
        } else {
          console.log('Is False!');
          this.isCorrect = false;
        }
        break;

      case 'multi':
        this.isCorrect = true;
        //ユーザーの回答:this.selectionForm.value
        console.log('Is Multi!');
        console.log(this.selectionForm.value);
        for (let i = 0; i < this.question.selection.length; i++) {
          console.log(
            'selectionForm[i]の中身',
            this.selectionForm.value.selections[i]
          );
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
          console.log('Orderの中身:', this.question.selection[i].Order);
          if (i + 1 !== this.question.selection[i].Order) {
            console.log('isFalse!!!');
            this.isCorrect = false;
            break;
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
      console.log('lineUsers:', line_users);
      console.log('ユーザーidのindex値:', this.userIdIndex);
      //userIdが正しいものか確認
      if (this.user.userId == line_users[0].lineUserId) {
        //bodyの中にデータを入れてあげると保存できる
        const body = {
          correct: this.isCorrect,
          questions: this.question.id,
          line_users: this.userIdIndex,
        };

        console.log('正誤:', this.isCorrect);
        console.log('問題のindex:', this.question.id);
        console.log('userIdのindex:', this.userIdIndex);
        //保存をサブスク内に入れることで強制同期
        this.mainSvc.createAnswer(body).subscribe((res) => {
          console.log('createAnswer:', res);
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
