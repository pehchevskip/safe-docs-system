import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-layer',
  templateUrl: './loading-layer.component.html',
  styleUrls: ['./loading-layer.component.sass']
})
export class LoadingLayerComponent {
  @Input() visible = false;
}
