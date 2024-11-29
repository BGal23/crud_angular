import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TListItem } from '../../types/TListItem';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
  imports: [CommonModule, MatIconModule],
})
export class ListItemComponent {
  @Input({ required: true }) items: TListItem[] = [];
}
