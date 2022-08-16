import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnswerComponent } from './pages/answer/answer/answer.component';
import { QuestionComponent } from './pages/question/question.component';

const routes: Routes = [
  { path: 'question', component: QuestionComponent },
  { path: 'answer', component: AnswerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
