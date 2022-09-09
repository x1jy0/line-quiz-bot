import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import liff from '@line/liff';
import { environment } from 'src/environments/environment';
import { MainService } from 'src/app/services/main.service';

export interface multiChoiceList {
  name: string;
  completed: boolean;
  lists?: multiChoiceList[];
}

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  question: any;
  selectedChoice: number;
  selectionForm: any;

  constructor(private mainSvc: MainService, private fb: FormBuilder) {
    let user;
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
              user = profile;
              console.log(user);
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
    this.mainSvc.getQuestions(query).subscribe((questions) => {
      const questionLength = questions.length;
      const index: number = this.getRandomInt(0, questionLength);
      console.log(questions);
      console.log(questionLength);
      console.log(index);
      console.log(questions[index]);
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

  //名前を考える===========
  //種類別に正誤判定を作る（宿題）
  //selectedchoice==Correctとか
  onClickMe(): void {
    console.log('取得された問題:', this.question.selection);
    console.log('selectedChoice:', this.selectedChoice);

    //問題種類別正誤判定
    let isCorrect;
    switch (this.question.Format) {
      case 'single':
        //ユーザーの回答:this.selectedChoice
        console.log('Is Single!');
        if (this.selectedChoice == -1) {
          console.log('未回答です');
          break;
        }
        //問題の選択肢のユーザー選択がtrueなら正解
        if (this.question.selection[this.selectedChoice].isCorrect) {
          console.log('Is True!');
        } else {
          console.log('Is False!');
        }
        break;

      case 'multi':
        isCorrect = true;
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
            isCorrect = false;
            break;
          }
        }
        console.log('正誤:', isCorrect); //正誤が表示される
        break;

      case 'sort':
        isCorrect = true;
        //ユーザーの回答:this.question.selection[].Order
        console.log('Is Sort');
        console.log(this.question.selection);
        //Orderがi++で並んでいれば正解
        for (let i = 0; i < this.question.selection.length; i++) {
          console.log('Orderの中身:', this.question.selection[i].Order);
          if (i + 1 !== this.question.selection[i].Order) {
            console.log('isFalse!!!');
            isCorrect = false;
            break;
          }
        }
        console.log('正誤:', isCorrect); //正誤が表示される
        break;

      default:
        console.log('不正なFormat');
        break;
    }
    //console.log(this.selectionForm.value);
    //bodyの中にデータを入れてあげると保存できる
    const body = {};
    this.mainSvc.createAnswer(body).subscribe((res) => {
      console.log(res);
    });
  }
  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
}
