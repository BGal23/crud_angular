import { Component, inject, OnInit, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListItemComponent } from './components/list-item/list-item.component';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormComponent } from './components/form/form.component';
import { ApiService } from './service/api.service';
import { TListItem } from './types/TListItem';
import { ComponentListState, LIST_STATE_VALUE } from './types/Service';
// import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ListItemComponent,
    FormComponent,
    NgIf,
    MatIconModule,
    // ReactiveFormsModule,
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
  private tasksService = inject(ApiService);

  toggleForm(isOpen: boolean): void {
    this.isFormOpen = isOpen;
  }

  ngOnInit(): void {
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
      },
      error: (err) => {
        this.listState = {
          state: LIST_STATE_VALUE.ERROR,
          error: err,
        };
      },
    });
  }
}
