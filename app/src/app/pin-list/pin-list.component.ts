import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pin-list',
  templateUrl: './pin-list.component.html',
  styleUrls: ['./pin-list.component.css']
})
export class PinListComponent {
  @Input('pinList') pinList : any[]= [];

}
