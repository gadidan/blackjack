import { Component, OnInit } from '@angular/core';
import { MonoTypeOperatorFunction } from 'rxjs';
import { CardsComponent } from '../cards/cards.component';
import { Card } from '../model/card.model';
import { Player } from '../model/player.model';
import { CheatersService } from '../cheaters.service'

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  providers: [CheatersService]
})
export class GameComponent implements OnInit {

  //***** TO DO: selection of player numbers */
  // list of players
  public _players: Player[] = [];
  //number of players (I set it to two)
  _numberOfPlayers: number = 2;
  //computer (the dealer) is the lastone
  public player1: number = 0;
  public computer: number = 1; //computer is the last player in list  

  // the card component
  public cardsComp:CardsComponent = new CardsComponent; 
  // the index of the current/ next card
  public cardIndex:number = 0;
  // the player cards (text,image (url))
  public playerCards:[string,string][] = [];
  public playersAmount:number[] = [];
  // the computer cards (text,image (url))
  public computerCards:[string,string][] = [];
  // set the change from player turn to the computers turn
  public playerTurn: boolean = true;
  // set message for player
  public playerMessage: string = '';
  // set message for game
  public gameMessage: string = '';
  // game state
  public gameStart:boolean = false;  
  public gameBegin:boolean = false;
  public roundEnd:boolean = false;
  //show game message
  public isGameMessage:boolean = false;

  // for cheating...
  public cheatersData:[number,number][] = [];
  public showCheat:boolean = false;
  public cheatersDataHTML:string = '';

  // for test blackjack
  public testBJ:number = -1;
   
  //***** TO DO: forms to get playerS details */
  //constructor 
  constructor(private cheaterService: CheatersService) { 
    // console.log('constructor');
    // initialization
    this.InitGame();
    // console.log(this.cardsComp.cards.map(({ id }) => id).join())
    // console.log('this.cardsComp.cardsComp.length: ' + this.cardsComp.cards.length);
    
    //inserting players & computer details for start
    for (var i = 0; i < this._numberOfPlayers; i++){
      // init players amount to 1,000 (only the first time)
      if (i != this._numberOfPlayers - 1 && this.playersAmount.length < this._numberOfPlayers - 1){
        this.playersAmount.push(1000);
      }
      let _p: Player = {
        name: (i != this._numberOfPlayers - 1) ? "Player " + i.toString() :"Computer",
        amount: (i != this._numberOfPlayers - 1) ? this.playersAmount[i] : 0,
        cards: [],
        points: 0,
        optionalPoints: 0,
        standing: false,
        gameModeOn: false,
        currentBetValue: 0,
        busted: false,
        blackjack: false,
        naturalBlackjack: false,
        winnerOfRound: false,
        calcPoints: function (): void {
          this.points = 0;
          this.cards.forEach(c => {
            this.points += c.value;
            if (this.optionalPoints < 11){
              this.optionalPoints += c.value == 1 ? c.value + 10 : c.value;
            }
           }) 
        } 
      };
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

  // init state for player B4 next round starts 
  InitPlayers(){
    // initialized game data, 
    // remove all curent cards, 
    // deleting messages
    this.playerTurn = true;
    this.playerCards = [];
    this.computerCards = [];
    this.playerMessage = '';

    for (var i = 0; i < this._numberOfPlayers; i++)
    {
      this._players[i].cards =  [];
      this._players[i].points =  0;
      this._players[i].optionalPoints = 0;
      this._players[i].standing= false;
      this._players[i].gameModeOn= false;
      this._players[i].busted= false;
      this._players[i].blackjack= false;
      this._players[i].naturalBlackjack= false;
      this._players[i].winnerOfRound= false;
    }  
  }

  ngOnInit(): void {
    //this.StartGame();
  }

  // open table for game
  StartGame(){
    this.gameStart = true;
    this.roundEnd = true;
    this.playerTurn = true;
    this.playerMessage = "Let the Game begin"
    this.gameMessage = "Please Bet"
  }
  // starts this round
  StartRound() {
    this.InitPlayers();

    // if (this.testBJ != -1){
    //   console.log('before setCards');
    //   this.setCards(this.testBJ);
    // }
    // first two cards for player and computer
    for (let i = 0; i< 2; i++)    {
      for (let j = 0; j < this._numberOfPlayers; j++){
        // getCard select the next card from array for player
        // returns card data
        
        var _image = this.getCard(this._players[j]);                
        //push carddata to (playr(0)/computer(1)) list
        this.pushToPlayersCards(j,_image);
      }
    }
    // check BlackJacks
    this.CheckWinning(true);
    this.roundEnd = false;
    this.playerTurn = true;  
    this.cheatersData = [];
    this.showCheat = false;
  }  
 
  // case 0 oush to player cards list
  // case 1 oush to computer cards list
  pushToPlayersCards(j:number, _image:[string,string]): void{
    if (j== this.player1) 
      this.playerCards.push(_image);
    else
      this.computerCards.push(_image);
  }

  getCard(_player: Player): [string,string]{
      // console.log("StartGame: " + _player.points)
      // console.log("StartGame: " + _player.optionalPoints)
            

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
      
      return [card.imageStr, card.image];      
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
      this.roundEnd = false;
      this.playerTurn = false;
    }
    return _player.naturalBlackjack;
  }

  //computer stop hitting cards when over 16 (points ot optionPoints)
  CheckComputerPlay():boolean{
    var res:boolean = true;
    if (this._players[this.computer].cards[1].value == 1 && this._players[this.computer].cards.length == 2)
    {
      //insurance
    }

    if (this._players[this.computer].busted) {
      res = false;
    }
    else if (this._players[this.computer].points > 16 
        || this._players[this.computer].optionalPoints > 16){

      this._players[this.computer].standing = true;
      res = false;
    }
    
    return res;
  }
  //check whi is heigher (or draw), and sets the winner
  CheckWinning(bj:boolean) : boolean{
    var res:boolean = true;

    if (bj){
      console.log("BJ")
      if (this.CheckBlackjack(this._players[this.player1]))        
      {        
        this.gameMessage = "BlackJack You Won!"
        this.PayMopney();        
      }
      else if (this.CheckBlackjack(this._players[this.computer])){
        this.gameMessage = "Computer's BlackJack You lost!"
        this.PayMopney();
      }
      this.playerTurn = false;
      this.roundEnd= true;
    }
    else{

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
    }
    return res;
  }

  bet() {    
    this._players[this.player1].currentBetValue = 100;
    this._players[this.player1].amount -= 100;
    this.gameMessage = "";
    this.StartRound();
    console.log('Bet: ' + this.playerTurn);
  }
  // pay money only for player, if blackjack get 1.5 other wize win or loose the currentbet

  PayMopney(){
    if (this._players[this.player1].naturalBlackjack){      
      this._players[this.player1].amount += this._players[1].currentBetValue * 2.5;
    }
    else if (this._players[this.player1].winnerOfRound){
      this._players[this.player1].amount += this._players[this.player1].currentBetValue * 2;
    }    
    else if (this._players[this.computer].winnerOfRound){
      this._players[this.player1].amount -= this._players[this.player1].currentBetValue * 0;      
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
    this.roundEnd = true;
  }
  
  //end game clear all data (init game), send message game over, and change state to game off
  endGame(): void {
      this.InitGame();
      this.playerMessage="GAME OVER";
      this.gameBegin = false;
      this.roundEnd = false;
  }

  //player hit card, get the next card
  hitCard():void{
    // gets ther next card    
    var _image = this.getCard(this._players[this.player1]);
    //insert into playerCards array
    this.pushToPlayersCards(0,_image);
    // check if busted
    this._players[this.player1].busted = this.checkBusted(this._players[this.player1])
    if (this._players[this.player1].busted){
      this.playerMessage = "Busted!!!! you lost"
      this.roundEnd = true;
      //this.computerPlay();
    }

  }
  double():void{
    
  }
  stand():void{
    this.playerTurn = false;
    this.computerPlay();
  }

  async computerPlay() {
    if (!this.CheckComputerPlay() 
      || this._players[this.player1].naturalBlackjack 
      || this._players[this.computer].naturalBlackjack){
      this.CheckWinning(false);
      this.PayMopney();
      // player natural  blackjack - wins 1.5
      if (this._players[this.player1].naturalBlackjack)
      {
        this.playerMessage = "Player BlackJack!!!!";
      }
      // player natural  blackjack -
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
      this.roundEnd = true;
      console.log("roundEnd: " + this.roundEnd)
    }
    else { //computer can hit another card
      var _image = this.getCard(this._players[this.computer]);
      this.pushToPlayersCards(this.computer,_image);
      // console.log('(' + this._players[this.computer].points + ',' + this._players[this.computer].optionalPoints + ') ' + this.checkBusted(this._players[this.computer]));
      this._players[this.computer].busted = this.checkBusted(this._players[this.computer]);
      if (this._players[this.computer].busted){
        this.playerMessage = "computer Busted!!!! You Won!";
        this.CheckWinning(false);
        this.PayMopney();
        this.playerTurn = false;
        this.roundEnd = true;
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

  cheatData(){
    //console.log('cheatData');
    if (!this.showCheat){
      this.cheatersData =  this.cheaterService.showData(this._players[this.player1].cards, this._players[this.computer].cards.slice(1));
      console.log('cheatData length: ' + this.cheatersData.length);
      for (var i = 0; i < this.cheatersData.length; i++){
        this.cheatersDataHTML += "<div><span><font size='5' style='font-weight:bold;'> " + this.cheatersData[i][0] + "  - " + this.cheatersData[i][1] + " %   </font></span></div>";
      }
      
    }
    //console.log('cheatData: ' + this.cheatersData);
    this.showCheat = !this.showCheat;
  }

  unitTestData(){
    this.testBJ += 1;
    if (this.testBJ == this._numberOfPlayers){
      this.testBJ = 0;
    }
  }
  resetTest(){
    this.testBJ = -1;
  }

  /*setCards(testBJ: number) {
    var index = 0
    let card:Card = this.cardsComp.cards[index];
    while(card.value != 1){
      index++;
      card = this.cardsComp.cards[index];
    }
    this.swipCards(index, testBJ, true);
    var index = 0
    while(card.value != 10){
      index++;
      card = this.cardsComp.cards[index];
    }
    this.swipCards(index, testBJ, true);
  }
  swipCards(index: number, testBJ: number, isFirst:boolean) {
    var tempCard = this.cardsComp.cards[index];
    var cardPlace = testBJ + ((isFirst) ? 0 : 2);
    this.cardsComp.cards[index] = this.cardsComp.cards[cardPlace];
    this.cardsComp.cards[cardPlace] = tempCard;
  }
  */ 
}