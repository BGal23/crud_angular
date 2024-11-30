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
  @Output() editItemToList = new EventEmitter<TListItem>();
  @Input() editFormData: TListItem | undefined;
  @Input() listState: ComponentListState<TListItem> = {
    state: 'IDLE',
  };
  @Input() isEdit: boolean = false;
  private apiService = inject(ApiService);
  towns: { name: string; id: number }[] = towns;
  // keywords: string[] = keywords;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      fund: [0, [Validators.required, Validators.min(0)]],
      town: ['', Validators.required],
      radius: [0, [Validators.required, Validators.min(0)]],
      keywords: [''],
      id: [''],
      stats: [true],
    });
  }

  ngOnInit(): void {
    if (this.editFormData) {
      this.form.patchValue(this.editFormData);
    }
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
      alert('New form is wrong');
    }
  }

  editItem() {
    if (this.form.valid) {
      const updatedItem: TListItem = {
        ...this.form.value,
      };

      this.apiService.update(updatedItem.id, updatedItem).subscribe({
        next: (item) => {
          this.editItemToList.emit(item);
          this.onCloseForm();
          return item;
        },
      });
    } else {
      alert('Edit form is wrong');
    }
  }
}
