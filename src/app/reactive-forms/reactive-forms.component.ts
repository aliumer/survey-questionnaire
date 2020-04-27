import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-reactive-forms',
  templateUrl: './reactive-forms.component.html',
  styleUrls: ['./reactive-forms.component.css']
})
export class ReactiveFormsComponent implements OnInit {

  childForm: FormGroup;
  questions: FormArray;
  options: FormArray;
  canAdd = false;


  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.questions = new FormArray([]);
    this.questions.push(
      this.fb.group({
        'QuestionnaireName': new FormControl('', [Validators.required]),
        'Subject': new FormControl('', [Validators.required])
      })
    );
    this.questions.valueChanges.subscribe(val => {
      this.canAdd = this.questions.status.toLowerCase() === 'valid' ? true : false;
    });
  }

  changeType(event) {
    console.log(event);
  }

  addNewForm() {
    this.childForm = this.fb.group({
      'type': new FormControl('', [Validators.required]),
      'name': new FormControl('', [Validators.required]),
      'label': new FormControl('', [Validators.required]),
      'required': new FormControl(false),
    });
    this.childForm.get('type').valueChanges.subscribe(theVal => {
      if (['radio', 'checkbox', 'dropdown'].indexOf(theVal) > -1) {
        const options = new FormArray([]);
        options.push(
          this.fb.group({
            key: new FormControl()
          })
        );
        this.childForm.addControl('options', options);
        this.options = options;
      } else {
        this.childForm.removeControl('options');
      }
    });
    this.questions.push(this.childForm);
  }

  RemoveQuestion(index) {
    if (confirm('Are you sure? You want to remove this question.')) {
      this.questions.controls.splice(index, 1);
    }
  }

  ifControlExists(form: FormGroup, ctrl) {
    // this function check if the control exists in child form or not.
    return form.controls[ctrl] ? true : false;
  }

  ifOptionExists(form: FormGroup) {
    return form.controls['options'] ? true : false;
  }

  OnAddOption(question: FormGroup) {
    const optionForm = this.fb.group({
      key: new FormControl('', [Validators.required])
    });
    const childOptions = question.get('options') as FormArray;
    childOptions.push(optionForm);
  }

}
