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

  //***** TO DO: selection of player numbers */
  // list of players
  public _players: Player[] = [];
  //number of players (I set it to two)
  _numberOfPlayers: number = 2;
  //computer (the dealer) is the lastone
  public player1: number = 0;
  public computer: number = 1;

  // the card component
  public cardsComp:CardsComponent = new CardsComponent; 
  // the index of the current/ next card
  public cardIndex:number = 0;
  // the player cards
  public playerCards:string[] = [];
  // the computer cards
  public computerCards:string[] = [];
  // set the change from player turn to the computers turn
  public playerTurn: boolean = true;
  // set message for player
  public playerMessage: string = '';
  // game state
  public gameBegin:boolean = false;
   
  //***** TO DO: forms to get playerS details */
  //constructor 
  constructor() { 
    // console.log('constructor');
    // initialization
    this.InitGame();
    // console.log(this.cardsComp.cards.map(({ id }) => id).join())
    // console.log('this.cardsComp.cardsComp.length: ' + this.cardsComp.cards.length);
    
    //inserting players & computer details for start
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
      //console.log(_p.name + ": " +  _p.points); 
      this._players.push(_p);
    }
       
  }
  // initialization 
  InitGame() {
    //***** TO DO - needs to work only one time */
    // Initialization of the cards
    this.cardsComp.initCardsArray();
    //fisrt card
    this.cardIndex = 0;
    // suffle the cards
    this.cardsComp.shuffleCards();
  }

  shuffleCard(){    
    this.cardsComp.shuffleCards();
  }

  InitPlayers(){
    // initialized game data, 
    // remove all curent cards, 
    // deleting messages
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
    
    //console.log(this._players[this.player1].name + ": " +  this._players[this.player1].points);
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
    //console.log(this._players[this.computer].name + ": " +  this._players[this.computer].points);


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
        // getCard select the next card from array for player
        // returns card data
        var _image = this.getCard(this._players[j]);                
        //push carddata to (playr(0)/computer(1)) list
        this.pushToPlayersCards(j,_image);
      }
    }
    if (this.CheckBlackjack(this._players[this.player1]) 
      ||this.CheckBlackjack(this._players[this.computer]))
    {
      this.computerPlay();
    }                            
  }
 
  // case 0 oush to player cards list
  // case 1 oush to computer cards list
  pushToPlayersCards(j:number, _image:string): void{
    if (j== this.player1) 
      this.playerCards.push(_image);
    else
      this.computerCards.push(_image);
  }

  getCard(_player: Player): string{
      //let card:Card = this.cardsComp.cards.filter(w => w.id == this.cardIndex+1)[0];
      console.log("StartGame: " + _player.points)
      console.log("StartGame: " + _player.optionalPoints)
            

      // get the next xard 
      let card:Card = this.cardsComp.cards[this.cardIndex];
      //console.log(card.id);
      this.cardIndex++;
      //console.log(_player);
      // push to cards array
      _player.cards.push(card);
      // add card value to player point            
      _player.points += card.value;
      // check if busted
      let busted:boolean = this.checkBusted(_player);  
      // optionpoints means if Ace is 11 (and can be 11)
      _player.optionalPoints += card.value;
      if (card.value == 1 && _player.optionalPoints <= 11){
        _player.optionalPoints += 10;
      }
      // if it is too high it becomes points
      if (_player.optionalPoints > 21){
        _player.optionalPoints = _player.points;
      }
      
      return card.image;      
  }

  // check if over 21
  checkBusted(_player: Player): boolean {
    return _player.points > 21;
  }

  // check natural blackjack (21 with two cards)
  CheckBlackjack(_player: Player): boolean{
    _player.naturalBlackjack = false;
    if (_player.optionalPoints == 21 && _player.cards.length == 2)
    {
      _player.naturalBlackjack = true;
    }
    return _player.naturalBlackjack;
  }

  //computer stop hitting cards when over 16 (points ot optionPoints)
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
  //check whi is heigher (or draw), and sets the winner
  CheckWinning() : boolean{
    var res:boolean = true;
    if ((this._players[this.player1].optionalPoints > this._players[this.computer].optionalPoints)
      || this._players[this.computer].busted){
      this._players[this.player1].winnerOfRound = true;      
      this.playerMessage = "You Won!!!!"
      //this._players[this.player1].amount += this._players[this.player1].currentBetValue;
    }
    else if ((this._players[this.player1].optionalPoints < this._players[this.computer].optionalPoints)
      || this._players[this.player1].busted){
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

  // pay money only for player, if blackjack get 1.5 other wize win or loose the currentbet

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
  // start game, clear all (init game), start game, players turn, and the game state is on
  startGame(): void {
    console.log("Clear All");
    this.InitGame();
    console.log("startGame");
    this.StartGame();
    this.playerTurn = true;  
    this.gameBegin = true;  
  }
  //
  // clearAll() {
  //   this.InitGame();
  // }
  
  //end game clear all data (init game), send message game over, and change state to game off
  endGame(): void {
      this.InitGame();
      this.playerMessage="GAME OVER";
      this.gameBegin = false;
  }

  //player hit card, get the next card
  hitCard():void{
    // gets ther next card
    var _image = this.getCard(this._players[this.player1]);
    //insert into playerCards array
    this.pushToPlayersCards(0,_image);
    // check if busted
    if (this._players[this.player1].busted = this.checkBusted(this._players[this.player1])){
      this.playerMessage = "Busted!!!! you lost"
      this.computerPlay();
    }

  }
  double():void{
    
  }
  stand():void{
    this.playerTurn = false;
    this.computerPlay();
  }

  async computerPlay() {
    
    if (this.CheckComputerPlay() 
      || this._players[this.player1].naturalBlackjack 
      || this._players[this.computer].naturalBlackjack){
      this.CheckWinning();
      this.PayMopney();
      if (this._players[this.player1].naturalBlackjack)
      {
        this.playerMessage = "Player BlackJack!!!!";
      }
      else if (this._players[this.computer].naturalBlackjack)
      {
        this.playerMessage = "Computer BlackJack!!!!";
      }
      if (this._players[this.player1].winnerOfRound){
        this.playerMessage = "You Won!";
      }
      else if (this._players[this.computer].winnerOfRound){
        this.playerMessage = "computer Won!";
      }
      else{
        this.playerMessage ="DRAW!!!"
      }
      this.gameBegin = false;
    }
    else { //computer can hit another card
      var _image = this.getCard(this._players[this.computer]);
      this.pushToPlayersCards(1,_image);
      if (this._players[this.computer].busted = this.checkBusted(this._players[this.computer])){
        this.playerMessage = "computer Busted!!!! You Won!";
        this.CheckWinning();
        this.PayMopney();
        this.gameBegin = false;
      }
      else { // computer was not busted
        await this.delay(1000);
        this.computerPlay();
      }
    }
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}