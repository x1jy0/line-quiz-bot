import { Component, OnInit } from '@angular/core';

export interface Item {
  name: string;
  completed: boolean;
  items?: Item[];
}

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  //複数選択のmat-checkbox
  item: Item = {
    name: 'Indeterminate',
    completed: false,
    items: [
      { name: '1', completed: false },
      { name: '2', completed: false },
      { name: '3', completed: false },
      { name: '4', completed: false },
      { name: '5', completed: false },
    ],
  };

  constructor() {}

  ngOnInit(): void {}
}
