import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import liff from '@line/liff';
import { environment } from 'src/environments/environment';

export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  single: boolean;
  multi: boolean;
  sort: boolean;

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
  constructor() {
    /*
    liff.init({
      liffId: environment.LIFF_ID,
    });
    */

    //問題出題形式の指定
    this.single = false;
    this.multi = true;
    this.sort = false;
  }

  ngOnInit(): void {}
}
