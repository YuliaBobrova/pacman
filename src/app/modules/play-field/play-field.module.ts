import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameLevelComponent } from './pages/game-level/game-level.component';
import { PlayFieldRoutingModule } from './play-field-routing.module';


@NgModule({
  declarations: [GameLevelComponent],
  imports: [
    CommonModule,
    PlayFieldRoutingModule
  ]
})
export class PlayFieldModule { }
