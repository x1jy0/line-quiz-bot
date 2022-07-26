import { Component, OnInit } from '@angular/core';
import liff from '@line/liff';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  constructor() {
    /*
    liff.init({
      liffId: environment.LIFF_ID,
    });
    */
  }

  ngOnInit(): void {}
}
