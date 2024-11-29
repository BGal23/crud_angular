import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListItemComponent } from './components/list-item/list-item.component';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormComponent } from './components/form/form.component';
import { ApiService } from './service/api.service';
import { TListItem } from './types/TListItem';

type ListFetchingError = { status: number; message: string };

type IdleState = {
  state: 'idle';
};

type LoadingState = {
  state: 'loading';
};

type SuccessState = {
  state: 'success';
  results: TListItem[];
};

type ErrorState = {
  state: 'error';
  error: ListFetchingError;
};

type ComponentListState = IdleState | LoadingState | SuccessState | ErrorState;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ListItemComponent,
    NgIf,
    MatIconModule,
    FormComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'CRUD App';
  items: TListItem[] = [];
  listState: ComponentListState = { state: 'idle' };
  isFormOpen = false;
  private tasksService = inject(ApiService);

  toggleForm(isOpen: boolean): void {
    this.isFormOpen = isOpen;
  }

  ngOnInit(): void {
    this.getAllItems();
  }

  getAllItems() {
    this.listState = { state: 'loading' };

    this.tasksService.getAll().subscribe({
      next: (response) => {
        this.listState = {
          state: 'success',
          results: response,
        };
      },
      error: (err) => {
        this.listState = {
          state: 'error',
          error: err,
        };
      },
    });
  }
}
