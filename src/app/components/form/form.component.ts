import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-form',
  imports: [MatIconModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent {
  @Output() closeForm = new EventEmitter<void>();

  onCloseForm(): void {
    this.closeForm.emit();
  }
}
