import { Component, OnInit } from '@angular/core';
import { MonoTypeOperatorFunction } from 'rxjs';
import { CardsComponent } from '../cards/cards.component';
import { Card } from '../model/card.model';
import { Player } from '../model/player.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  public _players: Player[] = [];
  _numberOfPlayers: number = 2;
  public player1: number = 0;
  public computer: number = 1;

  public cardsComp:CardsComponent = new CardsComponent; 
  public cardIndex:number = 0;
  public playerCards:string[] = [];
  public computerCards:string[] = [];
  public playerTurn: boolean = true;
  public playerMessage: string = '';
  public gameBegin:boolean = false;
   
  constructor() { 
    console.log('constructor');
    this.InitGame();
    console.log(this.cardsComp.cards.map(({ id }) => id).join())
    console.log('this.cardsComp.cardsComp.length: ' + this.cardsComp.cards.length);
    for (var i = 0; i < this._numberOfPlayers; i++){
      let _p: Player = {
        name: (i == this.player1) ? "Player 1" :"Computer",
        amount: (i== this.player1) ? 1000 : 0,
        cards: [],
        points: 0,
        optionalPoints: 0,
        standing: false,
        gameModeOn: false,
        currentBetValue: 0,
        bust: false,
        blackjack: false,
        naturalBlackjack: false,
        winnerOfRound: false,
        calcPoints: function (): void {
          console.log("calcPoints: " + this.cards.length)
          this.points = 0;
          this.cards.forEach(c => {
            this.points += c.value;
            if (this.optionalPoints < 11){
              this.optionalPoints += c.value == 1 ? c.value + 10 : c.value;
            }
           }) 
        } 
      };
      console.log(_p.name + ": " +  _p.points); 
      this._players.push(_p);
    }
       
  }

  InitGame() {
    this.cardsComp.initCardsArray();
    this.cardIndex = 0;
    this.cardsComp.shuffleCards();
  }

  shuffleCard(){    
    this.cardsComp.shuffleCards();
  }

  InitPlayers(){
    
    this.playerTurn = true;
    this.playerCards = [];
    this.computerCards = [];
    this.playerMessage = '';

    //reset player data
    this._players[this.player1].amount = 0;
    this._players[this.player1].currentBetValue = 0;
    this._players[this.player1].cards =  [];
    this._players[this.player1].points =  0;
    this._players[this.player1].optionalPoints = 0;
    this._players[this.player1].standing= false;
    this._players[this.player1].gameModeOn= false;
    this._players[this.player1].currentBetValue= 0;
    this._players[this.player1].bust= false;
    this._players[this.player1].blackjack= false;
    this._players[this.player1].naturalBlackjack= false;
    this._players[this.player1].winnerOfRound= false;
    
    console.log(this._players[this.player1].name + ": " +  this._players[this.player1].points);
    //reset computer data
    this._players[this.computer].amount = 0;
    this._players[this.computer].currentBetValue = 0;
    this._players[this.computer].cards =  [];
    this._players[this.computer].points =  0;
    this._players[this.computer].optionalPoints = 0;
    this._players[this.computer].standing= false;
    this._players[this.computer].gameModeOn= false;
    this._players[this.computer].currentBetValue= 0;
    this._players[this.computer].bust= false;
    this._players[this.computer].blackjack= false;
    this._players[this.computer].naturalBlackjack= false;
    this._players[this.computer].winnerOfRound= false;
    console.log(this._players[this.computer].name + ": " +  this._players[this.computer].points);


  }

  ngOnInit(): void {
    //this.StartGame();
  }

  // first two cards for player and computer
  StartGame() {
    this.InitPlayers();
console.log("StartGame: " + this._players[this.computer].points)
console.log("StartGame: " + this._players[this.player1].points)
    for (let i = 0; i< 2; i++)    {
      for (let j = 0; j < this._numberOfPlayers; j++){
        var _image = this.setCard(this._players[j]);                
        this.pushToPlayersCards(j,_image);
      }
    }                             
  }

  pushToPlayersCards(j:number, _image:string): void{
    if (j== this.player1) 
      this.playerCards.push(_image);
    else
      this.computerCards.push(_image);
  }

  setCard(_player: Player): string{
      //let card:Card = this.cardsComp.cards.filter(w => w.id == this.cardIndex+1)[0];
      console.log("StartGame: " + _player.points)
      console.log("StartGame: " + _player.optionalPoints)
            

      let card:Card = this.cardsComp.cards[this.cardIndex];
      //console.log(card.id);
      this.cardIndex++;
      //console.log(_player);
      _player.cards.push(card);            
      _player.points += card.value;
      let busted:boolean = this.checkBusted(_player);  
      _player.optionalPoints += card.value;
      if (card.value == 1 && _player.optionalPoints <= 11){
        _player.optionalPoints += 10;
      }
      if (_player.optionalPoints > 21){
        _player.optionalPoints = _player.points;
      }
      return card.image;      
  }

  checkBusted(_player: Player): boolean {
    return _player.points > 21;
  }

  
  CheckBlackjack(_player: Player){
    if (_player.optionalPoints == 21 && _player.cards.length == 2)
    {
      _player.naturalBlackjack = true;
    }
  }

  CheckComputerPlay():boolean{
    var res:boolean = false;
    if (this._players[this.computer].cards[1].value == 1 && this._players[this.computer].cards.length == 2)
    {
      //insurance
    }

    if (this._players[this.computer].points > 16 
        || this._players[this.computer].optionalPoints > 16)
        {
          this._players[this.computer].standing = true;
          res = true;
        }

    return res;
  }
  CheckWinning() : boolean{
    var res:boolean = true;
    if (this._players[this.player1].optionalPoints > this._players[this.computer].optionalPoints){
      this._players[this.player1].winnerOfRound = true;      
      this.playerMessage = "You Won!!!!"
      //this._players[this.player1].amount += this._players[this.player1].currentBetValue;
    }
    else if (this._players[this.player1].optionalPoints < this._players[this.computer].optionalPoints){
      this._players[this.computer].winnerOfRound = true;
      //this._players[this.player1].amount -= this._players[this.player1].currentBetValue;
      this.playerMessage = "Computer Won!!!!"
      
    }
    else {
      this._players[this.player1].winnerOfRound = false;
      this._players[this.computer].winnerOfRound = false;
      this.playerMessage = "Draw!!!!"
    }
    return res;
  }


  PayMopney(){
    if (this._players[this.player1].naturalBlackjack){      
      this._players[this.player1].amount += this._players[1].currentBetValue * 1.5;
    }
    else if (this._players[this.player1].winnerOfRound){
      this._players[this.player1].amount += this._players[this.player1].currentBetValue;      
    }    
    else if (this._players[this.computer].winnerOfRound){
      this._players[this.player1].amount -= this._players[this.player1].currentBetValue;      
    }
    if (this._players[this.computer].winnerOfRound){

    }

    // check insurance
  }    

  startGame(): void {
    console.log("Clear All");
    this.clearAll();
    console.log("startGame");
    this.StartGame();
    this.playerTurn = true;  
    this.gameBegin = true;  
  }
  clearAll() {
    this.InitGame();
  }
  
  endGame(): void {
      this.InitGame();
      this.playerMessage="GAME OVER";
      this.gameBegin = false;
  }
  hitCard():void{
    var _image = this.setCard(this._players[this.player1]);
    this.pushToPlayersCards(0,_image);
    if (this.checkBusted(this._players[this.player1]))
      this.playerMessage = "Busted!!!! you lost"

  }
  double():void{
    
  }
  stand():void{
    this.playerTurn = false;
    this.computerPlay();
  }

  async computerPlay() {
    if (this.CheckComputerPlay()){
      console.log(1);
      this.CheckWinning();
      this.PayMopney();
    }
    else {
      console.log(2);
      var _image = this.setCard(this._players[this.computer]);
      this.pushToPlayersCards(1,_image);
      if (this.checkBusted(this._players[this.computer])){
        console.log(3);
        this.playerMessage = "computer Busted!!!! You Won!";
      }
      else {
        console.log(4);
        await this.delay(500);
        this.computerPlay();
      }
    }
  }

   delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}