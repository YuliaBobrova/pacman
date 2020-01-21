import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameLevelComponent } from './pages/game-level/game-level.component';

const routes: Routes = [
  {
    path: '',
    //pathMatch: 'full',
    component: GameLevelComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayFieldRoutingModule {}
