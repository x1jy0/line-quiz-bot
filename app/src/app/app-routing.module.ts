import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnswerComponent } from './pages/answer/answer.component';
import { QuestionComponent } from './pages/question/question.component';
import { SettingComponent } from './pages/setting/setting.component';
import { RecordComponent } from './pages/record/record.component';
const routes: Routes = [
  { path: 'question', component: QuestionComponent },
  { path: 'answer', component: AnswerComponent },
  { path: 'setting', component: SettingComponent },
  { path: 'record', component: RecordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
