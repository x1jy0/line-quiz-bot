import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';

export interface multiChoice {
  name: string;
  completed: boolean;
  choiceList?: multiChoice[];
}

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.scss'],
})
export class AnswerComponent implements OnInit {
  questionType: string;
  //正誤を一旦boolで指定する
  result: boolean;

  //単一選択のradio-button

  singleChoices: string[] = [
    'MSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSI',
    'DELL',
    'Apple',
    'Hewlett-Packard',
  ];

  //複数選択のmat-checkbox
  multiChoice: multiChoice = {
    name: 'multiChoice',
    completed: false,
    choiceList: [
      { name: 'ゴーヤ', completed: false },
      { name: 'なす', completed: false },
      { name: 'いちご', completed: false },
      { name: 'トマト', completed: false },
    ],
  };
  //並び替え問題の内容
  sorts = ['1111111111', '2222222222', '3333333333', '4444444444'];

  constructor() {
    //問題出題形式の指定
    this.questionType = 'single';
    this.result = true;
  }

  //並び替え問題
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sorts, event.previousIndex, event.currentIndex);
  }

  ngOnInit(): void {}
}
