let ref = Vue.ref;
let db = IO.db;

class GameLogic {
  constructor(players) {
    this.players = players; 
    this.currentPlayerIndex = 0;
    // this.deck = ['Jack of Hearts', 'Queen of Hearts', 'King of Spades', 'Ace of Spades', 'Queen of Spades', 'Ace of Hearts', 'Jack of Spades', 'King of Hearts', 'Joker'];
    this.deck = ['JH', 'QH', 'KH', 'AH', 'JS', 'QS', 'KS', 'AS', 'JO'];
    this.playerHands = players.reduce((hands, player) => {
      hands[player.id] = [];
      return hands;
    }, {});

    this.gameState = ref('waiting'); // Vue ref to create reactive variable.
  }

  shuffleDeck() {
    for(let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  dealCards() {
    while(this.deck.length > 0) {
      this.players.forEach(player => {
        if (this.deck.length > 0) {
          const drawnCard = this.deck.pop();
          this.playerHands[player.id].push(drawnCard);
        }
      });
    }
  }

  startGame() {
    this.shuffleDeck();
    this.dealCards();
    this.players.forEach(player => {
      this.checkPairs(player.id);
    })

    db.ref('/gameState').set('started'); // update gameState in Firebase
    db.ref('/playerHands').set(this.playerHands);
    db.ref('/currentPlayerIndex').set(this.currentPlayerIndex);
  }
  
  turnToDraw(playerId) {
    const nextPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    return nextPlayerIndex === playerId;
  }
  
  cardsToDrawFrom(playerId) {
    if (!this.turnToDraw(playerId))
      return;
    let cards = this.playerHands[this.currentPlayerIndex];
    return cards;
  }

  playerTurn(playerId, drawnCardIndex) {
    if(this.players[this.currentPlayerIndex].id !== playerId) {
      throw new Error('Not your turn');
    }

    const nextPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    const card = this.playerHands[playerId].splice(drawnCardIndex, 1)[0];
    this.playerHands[this.players[nextPlayerIndex].id].push(card);
    console.log("Current player: "+this.currentPlayerIndex);
    
    this.currentPlayerIndex = nextPlayerIndex;
    console.log("Next player: "+this.currentPlayerIndex);
    
    this.checkPairs(nextPlayerIndex);
    
    // Save the current game state to the database
    db.ref('/playerHands').set(this.playerHands);
    db.ref('/currentPlayerIndex').set(this.currentPlayerIndex);

    if (this.checkWinner()) {
      this.gameState = 'finished';
      db.ref('/gameState').set('finished');
    }
  }

  checkPairs(playerId) {
    const hand = this.playerHands[playerId];
    const pairs = [];
    const toRemove = new Set();  // store indices to remove

    for (let i = 0; i < hand.length; i++) {
      for (let j = i + 1; j < hand.length; j++) {
        if (hand[i] === 'JO' || hand[j] === 'JO')
          continue;
        if (hand[i][0] === hand[j][0]) { // check if cards have the same number
          pairs.push([i, j]);
          toRemove.add(i); // mark cards for removal
          toRemove.add(j);
        }
      }
    }

    // create a new hand, excluding the removed pairs
    this.playerHands[playerId] = hand.filter((card, index) => !toRemove.has(index));

    // output removed cards
    pairs.forEach(([a, b]) => {
      console.log("remove card: " + hand[a]);
      console.log("remove card: " + hand[b]);
    });
  }


  checkWinner() {
    let jokerHolder = null;
    this.players.forEach(player => {
      if (this.playerHands[player.id].includes('JO')) {
        if (jokerHolder) {
          return false; // game continues if multiple players still hold joker
        } else {
          jokerHolder = player.id;
        }
      }
    });
    return jokerHolder; // game is over, return the loser
  }
}
