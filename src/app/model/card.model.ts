import { Suits } from '../model/app-enums.model';
export class Card {
    id: number;
    // 1-13
    value:number = 0;

    // Spade. Heart, Diamond, Clubs
    suit:Suits;

    imageStr:string = '';  
    image:string = '';  

    //2-10, 1/11
    realValue:number  = 0;    
    
    constructor(id: number, value: number, suit: Suits, _image: string){ 
        console.log("card constuctor")
        this.id = id;
        this.suit = suit;
        this.value = value;        
        if (this.value > 9)
            this.realValue = 10;                
        console.log("finish card constuctor")
    }
}
