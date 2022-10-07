import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import liff from '@line/liff';

export interface multiChoiceList {
  name: string;
  completed: boolean;
  lists?: multiChoiceList[];
}

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss'],
})
export class AnswerComponent implements OnInit {
  //localStorageのデータ取り出し
  correctData = JSON.parse(localStorage.getItem('correctData') ?? '');
  answerData = JSON.parse(localStorage.getItem('answerData') ?? '');
  question = this.correctData.question;
  answer = this.answerData;
  //正誤をboolで宣言する
  result: boolean;

  //並び替え問題の枠
  sorts = ['', '', '', ''];

  constructor(private router: Router) {
    // 正誤の読み込み
    this.result = this.correctData.isCorrect;
  }

  //並び替え問題
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sorts, event.previousIndex, event.currentIndex);
  }

  ngOnInit(): void {}

  closeLiff() {
    liff.closeWindow();
  }

  nextQuestion() {
    this.router.navigateByUrl('/question');
  }
}
