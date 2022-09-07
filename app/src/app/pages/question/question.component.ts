import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
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

  constructor(private mainSvc: MainService) {
    /*
    liff.init({
      liffId: environment.LIFF_ID,
    });
    */
  }

  ngOnInit(): void {
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

  onClickMe(): void {
    console.log(this.question.selection);
  }
  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
}
