import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';

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
  //questionType: string;
  //正誤をboolで宣言する
  result: boolean;

  question = this.correctData.question;
  // question = {
  //   id: 1,
  //   question: '問題文',
  //   Format: 'single',
  //   CorrectComment: '正解のコメント',
  //   IncorrectComment: '不正解のコメント',
  //   published_at: '2022-08-24T09:15:34.155Z',
  //   created_at: '2022-08-24T09:15:20.300Z',
  //   updated_at: '2022-08-24T09:15:34.279Z',
  //   selection: [
  //     { id: 1, Statement: '2', Correct: true, Order: 2 },
  //     { id: 2, Statement: '1', Correct: false, Order: 1 },
  //     { id: 3, Statement: '3', Correct: false, Order: 3 },
  //     { id: 4, Statement: '4', Correct: false, Order: 4 },
  //   ],
  //   categories: [],
  //   answers: [],
  // };

  answer = [
    {
      id: 4,
      Statement: '4',
      Correct: false, //ユーザー選択と同じで正解(trueとtrueで正解,fxfは通常表示)
      Order: 4,
      selected: false, //ユーザー選択
      sortCorrect: false,
    },
    {
      id: 2,
      Statement: '1',
      Correct: false,
      Order: 1,
      selected: false,
      sortCorrect: false,
    },
    {
      id: 3,
      Statement: '3',
      Correct: false,
      Order: 3,
      selected: false,
      sortCorrect: true,
    },
    {
      id: 1,
      Statement: '2',
      Correct: true,
      Order: 2,
      selected: true,
      sortCorrect: false,
    },
  ];

  //単一選択のradio-button

  singleChoices: string[] = [
    'MSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSI',
    'DELL',
    'Apple',
    'Hewlett-Packard',
  ];

  //複数選択のmat-checkbox
  multiChoice: multiChoiceList = {
    name: 'Indeterminate',
    completed: false,
    lists: [
      { name: 'ゴーヤ', completed: false },
      { name: 'なす', completed: false },
      { name: 'いちご', completed: false },
      { name: 'トマト', completed: false },
    ],
  };
  //並び替え問題の内容
  sorts = ['1111111111', '2222222222', '3333333333', '4444444444'];

  constructor() {
    // 正誤の読み込み
    this.result = this.correctData.isCorrect;
    console.log(this.correctData.isCorrect);
  }

  //並び替え問題
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.sorts, event.previousIndex, event.currentIndex);
  }

  ngOnInit(): void {}
}
