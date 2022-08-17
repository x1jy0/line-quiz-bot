import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { QuestionComponent } from './pages/question/question.component';
import { MaterialModule } from './material/material.module';
import { AnswerComponent } from './pages/answer/answer.component';
import { SettingComponent } from './pages/setting/setting.component';
@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    AnswerComponent,
    SettingComponent,
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    FormsModule,
    DragDropModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
