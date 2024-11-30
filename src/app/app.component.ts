import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListItemComponent } from './components/list-item/list-item.component';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormComponent } from './components/form/form.component';
import { ApiService } from './service/api.service';
import { TListItem } from './types/TListItem';
import { ComponentListState, LIST_STATE_VALUE } from './types/Service';

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
  items: TListItem[] = [];
  listState: ComponentListState<TListItem> = { state: LIST_STATE_VALUE.IDLE };
  listStateValue = LIST_STATE_VALUE;
  isFormOpen = false;
  balance: number = 0;
  private tasksService = inject(ApiService);

  toggleForm(isOpen: boolean): void {
    this.isFormOpen = isOpen;
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
      console.error('Cannot add item.', this.listState);
    }
  }

  getBalance() {
    this.tasksService.getAccount().subscribe({
      next: (response) => {
        this.balance = response;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onCampaignDeleted(fund: number) {
    this.balance += fund;
  }
}
