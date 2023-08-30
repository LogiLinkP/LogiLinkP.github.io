import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.scss']
})
export class BlankComponent {
  constructor(@Inject(DOCUMENT) private document: Document) {}
  scrollToTop(): void {
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
  }
}
