import {Component, OnDestroy, OnInit} from '@angular/core';
import {EditableForm} from '../../models/editable.form.model';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/store.module';
import {EditableFormsCreateAction} from '../../store/editable-forms/editable.forms.actions';

const draftsFirst = (left, right) => {
  return left.draft ? 1 : right.draft ? -1 : 0;
};

@Component({
  selector: 'app-editable-forms',
  templateUrl: './editable-forms.component.html',
  styleUrls: ['./editable-forms.component.scss']
})
export class EditableFormsComponent implements OnInit, OnDestroy {
  editableForms: EditableForm[];
  sub: Subscription;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
    this.sub = this.store.select(s => s.editableForms.forms)
      .subscribe(forms => {
        this.editableForms = forms.sort(draftsFirst);
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  createNewForm() {
    this.store.dispatch(new EditableFormsCreateAction());
  }
}
