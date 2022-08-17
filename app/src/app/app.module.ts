import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionComponent } from './pages/question/question.component';

@NgModule({
  declarations: [AppComponent, QuestionComponent],
  imports: [
    AppRoutingModule,
    CommonModule,
    MatRadioModule,
    FormsModule,
    DragDropModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
