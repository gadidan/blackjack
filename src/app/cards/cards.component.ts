import { Component, OnInit } from '@angular/core';
import { Card } from '../model/card.model';
import { Suits } from '../model/app-enums.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  
  cards: Card[] = [];

  constructor() {     
  }

  ngOnInit(): void {
  }



  public initCardsArray(): void {
    this.cards = [];
    for (var i = 1; i< 53; i++){

      var _image = '';
      var _imageStr = '';
      //console.log("i: " + i);
      let val = i%13;        
      let suitInd = Math.floor(i /13);
      //console.log("(" + val + "," + suitInd+")")
      var suit = Suits.Club;
      
      _image += val +1;
      switch(suitInd) { 
        case 0: { 
          suit = Suits.Spade;
          _image += 's';
          _imageStr += 's';
           break; 
        } 
        case 1: { 
           suit = Suits.Heart;
           _image += 'h';
           _imageStr += 'h';
           break; 
        } 
        case 2: { 
          suit = Suits.Diamond;
          _image += 'd';
          _imageStr += 'd';
          break; 
        } 
        case 3: { 
          suit = Suits.Club;
          _image += 'c';
          _imageStr += 'c';
          break; 
        }
        default: { 
          suit = Suits.Club;
          _image += 'c';
          _imageStr += 'c';
           break; 
        }
      }       
      _imageStr += val +1;
      

      console.log('../assets/Images/' + _image + '.png');
      var card: Card = {        
        id: i,
        value: (val  + 1) > 9 ?10 : val + 1,
        suit: suit,
        imageStr: _image,
        image: '..\\assets\\Images\\' + _imageStr + '.png',
        realValue: (i > 9) ? 10 : i
      };
      //{i,suit,val,_image};
      this.cards.push(card);          
    }   
    //console.log("Number of cards: " + this.cards.length)
  }

  public shuffleCards(): void {
    //console.log(this.cards.map(({ image }) => image).join())
    for (var i = 0; i < 52 ; i++){
      var ind1 = this.GetRandom(52);
      var ind2 = this.GetRandom(52);
      let temp  = this.cards[ind1];
      this.cards[ind1] = this.cards[ind2];
      this.cards[ind2] = temp;
    }
    ;
    //console.log(this.cards.map(({ image }) => image).join())

  }

  private  GetRandom(max: number){
    return Math.floor(Math.random() * Math.floor(max))
  }
}



