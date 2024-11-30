import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TListItem } from '../../types/TListItem';
import { ApiService } from '../../service/api.service';
import { v4 as uuidv4 } from 'uuid';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ComponentListState } from '../../types/Service';
import towns from '../../assets/towns.json';
import keywords from '../../assets/keywords.json';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-form',
  imports: [MatIconModule, ReactiveFormsModule, NgFor],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent {
  @Output() closeForm = new EventEmitter<void>();
  @Output() addItemToList = new EventEmitter<TListItem>();
  @Input() listState: ComponentListState<TListItem> = {
    state: 'IDLE',
  };
  private apiService = inject(ApiService);

  towns: { name: string; id: number }[] = towns;
  keywords: string[] = keywords;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      fund: [0, [Validators.required, Validators.min(0)]],
      town: ['', Validators.required],
      radius: [0, [Validators.required, Validators.min(0)]],
      keywords: [''],
    });
  }

  onCloseForm(): void {
    this.closeForm.emit();
  }

  addItem() {
    if (this.form.valid) {
      const generateId = uuidv4();
      const newObj: TListItem = {
        ...this.form.value,
        status: true,
        id: generateId,
      };
      this.apiService.add(newObj).subscribe({
        next: (item) => {
          this.addItemToList.emit(item);
          this.onCloseForm();
        },
      });
    } else {
      alert('Form is wrong');
    }
  }
}
