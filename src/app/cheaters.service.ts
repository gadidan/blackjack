import { Injectable } from '@angular/core';
import { Card } from './model/card.model';

@Injectable({
  providedIn: 'root'
})
export class CheatersService {

  // all point in deck of cards 
  public cardsLeft:[number,number][] = [[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,16]];
  // the statistic of cards
  public cardStatistic:[number,number][] = [];
  constructor() {     
  }

  // gets player& computer cards (as available) and return statistic of left cards points
  showData(playerCards: Card[], computerCards: Card[]){
    this.cardStatistic = [];
    // reduce player cards from cardsLeft
    //console.log('computers card: ' + computerCards.length);
    this.calcLeftCards(playerCards);
    // reduce computer cards from cardsLeft
    this.calcLeftCards(computerCards);  
    
    // how many card left
    var numLeft = 52 - playerCards.length - computerCards.length;
    // calc points of player
    var playerPoints = this.calcPoints(playerCards);
    // calc known points of computer
    var compPoints = this.calcPoints(computerCards);
    
    // calc statistic
    this.calcStatistic(numLeft);
    
    return this.cardStatistic;
  }

  // return the points of card and precentage in deck
  calcStatistic(numLeft: number) {
    this.cardsLeft.forEach(card => {
      this.cardStatistic.push([card[0],card[1] * 100/ numLeft])
    });
  }

  //calc points of player / computer to make a better choice
  /*****************************************************
    I don't know what should player do, 
    SORRY!!!!
   *****************************************************/
  calcPoints(cards: Card[]) {
    var points = 0;

    cards.forEach(card => {
      points += card.value;
    });

    return points;
  }

  // reduce left cards acorfing to player /  computer cards from statisctics
  calcLeftCards(cards: Card[]) {

    cards.forEach(card => {
      var val = card.realValue;
      if (val > 9){
        val = 10;
      }            
      this.cardsLeft[val-1][1]  -=  1;
    });
  }
}
