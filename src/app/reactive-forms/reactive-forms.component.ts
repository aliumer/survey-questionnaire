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
  generatedForm = '';

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

  addNewForm() {
    this.childForm = this.fb.group({
      'type': new FormControl('', [Validators.required]),
      'label': new FormControl('', [Validators.required]),
      'required': new FormControl(false),
    });
    this.childForm.get('type').valueChanges.subscribe(theVal => {
      if (['radio', 'checkbox', 'dropdown'].indexOf(theVal) > -1) {
        const options = new FormArray([]);
        options.push(
          this.fb.group({
            label: new FormControl()
          })
        );
        this.childForm.addControl('options', options);
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
      label: new FormControl('', [Validators.required])
    });
    const childOptions = question.get('options') as FormArray;
    childOptions.push(optionForm);
  }

  Save() {
    const myJson = this.questions.value.map(element => {
      if (element.hasOwnProperty('type')) {
        element = { ...element, value: '', name: element.label.split(' ').join('').toLowerCase()};
        if (element.hasOwnProperty('options')) {
          element.options = element.options.map ((o) => {
            return { ...o, key: o.label.split(' ').join('').toLowerCase() };
          });
        }
      }
      return element;
    });

    this.generatedForm =  myJson;
  }

}
