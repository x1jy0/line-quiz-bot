import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';

export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
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
  favoriteSeason: string | undefined;
  seasons: string[] = [
    'MSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSIMSI',
    'DELL',
    'Apple',
    'Hewlett-Packard',
  ];

  //複数選択のmat-checkbox
  task: Task = {
    name: 'Indeterminate',
    completed: false,
    subtasks: [
      { name: 'ゴーヤ', completed: false },
      { name: 'なす', completed: false },
      { name: 'いちご', completed: false },
      { name: 'トマト', completed: false },
    ],
  };
  //並び替え問題の内容
  movies = ['1111111111', '2222222222', '3333333333', '4444444444'];

  constructor() {
    //問題出題形式の指定
    this.questionType = 'single';
    this.result = true;
  }

  //並び替え問題
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }

  ngOnInit(): void {}
}
