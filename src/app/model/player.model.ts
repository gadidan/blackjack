import { Card } from "./card.model";
export class Player {
  //the name of the player
  name: string = '';
  //next is the amount won during one round
  amount: number = 0;  
  //next property contains the cards of a user during one hand
  cards: Card[] = [];
  //this property keeps track of the total points of the user
  points: number = 0
  optionalPoints: number = 0;
  //"standing" property is made true when the user clicks on stand, which means he doesn't want any more cards
  standing: boolean = false;  
  gameModeOn:boolean = false;   
  //special properties used during the game
  currentBetValue: number = 0;
  //next property is set to true when the player exceeds 21
  bust: boolean = false;
  //when the players has 21 points cannot take another card
  blackjack: boolean = false;
  //opening 21 gets 1.5 from bet
  naturalBlackjack: boolean = false; 

  winnerOfRound: boolean = false;

  public calcPoints(){

    this.points = 0;
    this.cards.forEach(c => {
      this.points += c.value;
      if (this.optionalPoints < 11){
        this.optionalPoints += c.value == 1 ? c.value + 10 : c.value;
      }    
    });    
  }
}