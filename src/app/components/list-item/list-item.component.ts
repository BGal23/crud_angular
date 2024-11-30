import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TListItem } from '../../types/TListItem';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
  imports: [CommonModule, MatIconModule],
})
export class ListItemComponent {
  @Input({ required: true }) items: TListItem[] = [];
  @Output() deleteInfo = new EventEmitter<string>();
  @Output() changeInfo = new EventEmitter<string>();
  @Output() openForm = new EventEmitter<void>();
  @Output() formData = new EventEmitter<TListItem>();

  private apiService = inject(ApiService);

  delete(id: string) {
    const itemToDelete = this.items.find((item) => item.id === id);

    if (itemToDelete) {
      this.apiService.delete(id).subscribe({
        next: () => {
          this.items = this.items.filter((item) => item.id !== id);
          this.deleteInfo.emit(itemToDelete.id);
        },
        error: (res) => {
          alert(res.message);
        },
      });
    }
  }

  editItem(item: TListItem) {
    this.formData.emit(item);
    this.openForm.emit();
  }

  changeStatus(id: string) {
    const updatedItem = this.items.find((item) => item.id === id);
    if (!updatedItem) return;
    const updatedStatus = { status: !updatedItem.status };

    this.apiService.update(id, updatedStatus).subscribe({
      next: (res) => {
        this.items = this.items.map((item) => {
          if (item.id === res.id) {
            this.changeInfo.emit(item.id);
            return res;
          } else {
            return item;
          }
        });
      },
      error: (res) => {
        alert(res.message);
      },
    });
  }
}
