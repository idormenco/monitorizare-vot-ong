import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { EditableFormQuestion } from '../../../../models/editable.form.question.model';
import { EditableFormSection } from '../../../../models/editable.form.section.model';
import { QuestionType } from '../../../../models/editable.form.question.type';
import { EditableFormQuestionOption } from '../../../../models/editable.form.question.option.model';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/store.module';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-question-card',
  templateUrl: './question-card.component.html',
  styleUrls: ['./question-card.component.scss']
})
export class QuestionCardComponent implements OnInit, OnDestroy {
  @Input() section: EditableFormSection;
  @Input() question: EditableFormQuestion;
  @Output() deleteQuestion = new EventEmitter<number>();

  questionTypes: QuestionType[] = QuestionType.values();
  private ADD_NEW_OPTION_ID = -99;

  options: EditableFormQuestionOption[];
  private sub: Subscription;
  newOption: EditableFormQuestionOption;

  constructor(private store: Store<AppState>, private translate: TranslateService) {
    this.newOption = new EditableFormQuestionOption(this.ADD_NEW_OPTION_ID, '', '');
  }

  ngOnInit() {
    this.sub = this.store.select(s => s.editableForms.options)
      .subscribe(newOptionTypes => {
        this.question.options.forEach(questionOption => {
          let optionTypeIndex = newOptionTypes.findIndex(optionType => optionType.text === questionOption.text);
          if (optionTypeIndex >= 0) {
            console.log(`Question option ${questionOption.id} has the following type id: ${newOptionTypes[optionTypeIndex].id}`);
            questionOption.id = newOptionTypes[optionTypeIndex].id;
          } else {
            console.log(`We couldn't find the type for option: ${questionOption.text}`);
          }
        });


        this.options = [
          ...newOptionTypes
        ];
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onDeleteQuestion() {
    this.deleteQuestion.emit(this.question.id);
  }

  deleteOption(): void {
    console.log('deleting option');
  }

  onOptionTypeChange(event) {
    console.log(`Question option type has changed!`, event);
  }

  addNewOption(){

    // this.store.dispatch(new EditableFormsAddFormQuestionAction({
    //   formSet: this.formSet,
    //   formId: this.section.id
    // }));


    this.question.options.push(this.newOption);
    this.options.push(this.newOption);
    this.ADD_NEW_OPTION_ID = this.ADD_NEW_OPTION_ID-1;
    this.newOption = new EditableFormQuestionOption(this.ADD_NEW_OPTION_ID, '', '');
  }
}
