import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListItemComponent } from './components/list-item/list-item.component';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormComponent } from './components/form/form.component';
import { ApiService } from './service/api.service';
import { TListItem } from './types/TListItem';
import { ComponentListState, LIST_STATE_VALUE } from './types/Service';
import emptyItem from './assets/emptyItem.json';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ListItemComponent,
    FormComponent,
    NgIf,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'CRUD App';
  listState: ComponentListState<TListItem> = { state: LIST_STATE_VALUE.IDLE };
  listStateValue = LIST_STATE_VALUE;
  isFormOpen = false;
  isFormEdit = false;
  balance: number = 0;
  formData: TListItem | undefined;
  private tasksService = inject(ApiService);

  toggleForm(isOpen: boolean, isEdit?: boolean): void {
    if (!isEdit) {
      this.isFormEdit = false;
      this.formData = emptyItem;
    } else {
      this.isFormEdit = true;
    }

    this.isFormOpen = isOpen;
  }

  getFormData(data: TListItem) {
    this.formData = data;
  }

  ngOnInit(): void {
    this.getBalance();
    this.getAllItems();
  }

  getAllItems() {
    this.listState = { state: LIST_STATE_VALUE.LOADING };

    this.tasksService.getAll().subscribe({
      next: (response) => {
        this.listState = {
          state: LIST_STATE_VALUE.SUCCESS,
          results: response,
        };
        const sum = this.listState.results.reduce((total, item) => {
          return total + item.fund;
        }, 0);

        this.balance -= sum;
      },
      error: (err) => {
        this.listState = {
          state: LIST_STATE_VALUE.ERROR,
          error: err,
        };
      },
    });
  }

  addItemToList(newItem: TListItem) {
    if (
      this.listState.state === LIST_STATE_VALUE.SUCCESS &&
      Array.isArray(this.listState.results)
    ) {
      this.listState = {
        ...this.listState,
        results: [...this.listState.results, newItem],
      };
      this.balance -= newItem.fund;
    } else {
      console.error('Cannot add item!', this.listState);
    }
  }

  editItemToList(editItem: TListItem) {
    if (this.listState.state === 'SUCCESS') {
      const oldItem = this.listState.results.find(
        (item) => item.id === editItem.id
      );

      if (oldItem) {
        this.listState = {
          ...this.listState,
          results: this.listState.results.map((item) =>
            item.id === editItem.id ? { ...item, ...editItem } : item
          ),
        };

        this.balance += oldItem.fund;
        this.balance -= editItem.fund;
      } else {
        console.error('Old item not found!');
      }
    } else {
      console.error('Can not change this element!');
    }
  }

  getBalance() {
    this.tasksService.getAccount().subscribe({
      next: (response) => {
        this.balance = response;
      },
      error: (err) => {
        console.error('Cannot get balance!', err);
      },
    });
  }

  onChanged(id: string) {
    if (this.listState.state === 'SUCCESS') {
      const itemToUpdate = this.listState.results.find(
        (item) => item.id === id
      );

      if (itemToUpdate) {
        itemToUpdate.status = !itemToUpdate.status;
        this.listState = {
          ...this.listState,
          results: this.listState.results.map((item) =>
            item.id === id ? { ...item, status: itemToUpdate.status } : item
          ),
        };
      } else {
        console.error('This ID does not exist!');
      }
    }
  }

  onDeleted(id: string) {
    if (this.listState.state === 'SUCCESS') {
      const itemToDelete = this.listState.results.find(
        (item) => item.id === id
      );

      if (itemToDelete) {
        this.balance += itemToDelete.fund;
        this.listState.results = this.listState.results.filter(
          (item) => item.id !== itemToDelete.id
        );
      } else {
        console.error('This ID does not exist!');
      }
    }
  }
}
