import { Component, OnInit } from '@angular/core';
import { GameComponent } from '../game/game.component';
import { Player } from '../model/player.model';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  //_game: GameComponent;
  _players: Player [] = [];
  _betAmount: number = 0;

  public imageAddresses:string[] = [];
  public cardNumber:number = 0;
  constructor() { }

  ngOnInit(): void {   
  }  

}
