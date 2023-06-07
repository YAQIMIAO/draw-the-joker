// Use this later for people!
let avatars = [];
let settings = {
  sceneID: "studyroom",
  rotationSpeed: 0,
  rotation: 0,
  startGame: false,
  resetGame: false,
  playerIndex: 0,
  playerSkin: "#minion",
  sphere1Size: 5,
  sphere2Size: 5,
  rotationSpeed: 1,
  columnRadius: 10,
  maximumPlayer: 5,
  count: 2,
  slots: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"],
  haircolor: "#002164",
  headSize: 1,
  skins: [
         "#person2",
         "#minion",
         "#person1",
        "#person3",
        "#person4"],
  cardw: 2,
  cardh: 3,
  face: [
   {name:"AH", url:"https://cdn.glitch.global/b5ac0561-4ef4-49f5-bb27-5edc00428bba/heart%20A.jpeg?v=1685298680461"},
   {name:"JH", url:"https://cdn.glitch.global/b5ac0561-4ef4-49f5-bb27-5edc00428bba/Screen%20Shot%202023-05-28%20at%201.33.40%20PM.png?v=1685298823174"},
   {name:"QH", url:"https://cdn.glitch.global/b5ac0561-4ef4-49f5-bb27-5edc00428bba/qhearts.png?v=1685505464585"},
   {name:"KH", url:"https://cdn.glitch.global/b5ac0561-4ef4-49f5-bb27-5edc00428bba/Screen%20Shot%202023-05-28%20at%201.34.10%20PM.png?v=1685298854439"},
   {name:"JO", url:"https://cdn.glitch.global/b5ac0561-4ef4-49f5-bb27-5edc00428bba/Screen%20Shot%202023-05-28%20at%202.46.55%20PM.png?v=1685303244133"},
   {name:"JS", url:"https://cdn.glitch.global/b5ac0561-4ef4-49f5-bb27-5edc00428bba/jspade.png?v=1685477861355"},
   {name:"QS", url:"https://cdn.glitch.global/b5ac0561-4ef4-49f5-bb27-5edc00428bba/qspade.png?v=1685477864098"},
   {name:"KS", url:"https://cdn.glitch.global/b5ac0561-4ef4-49f5-bb27-5edc00428bba/kspade.png?v=1685477862855"},
   {name:"AS", url:"https://cdn.glitch.global/b5ac0561-4ef4-49f5-bb27-5edc00428bba/aspade.png?v=1685477858635"},
  ],
  back: {name:"Face-down", url:"https://cdn.glitch.global/b5ac0561-4ef4-49f5-bb27-5edc00428bba/back.png?v=1685477860013"},
};

window.onload = function (e) {
  
  let countRef = db.ref('/tableSize');
  let playersRef = db.ref('/players');
  let gameStateRef = db.ref('/gameState');
  let currentPlayerIndexRef = db.ref('/currentPlayerIndex');
  let playerHandsRef = db.ref('/playerHands');


  // A Vue element for the controls
  window.vueControl = new Vue({
    template: `
    <div id="controls">
      <div id="controlPanel" style="display: block;margin: 10px;">
        <!-- Select menu for number of player -->
        <div>
          <label>Number of Players:</label>
          <select v-model="settings.count">
            <option v-for="index in settings.maximumPlayer" :value="index">{{ index }}</option>
          </select>
        </div>

        <!-- Select menu for player index -->
        <div>
          <label>Player Index:</label>
          <select v-model="settings.playerIndex">
            <option v-for="index in settings.count" :value="index - 1">Slot {{ index }}</option>
          </select>
        </div>

        <!-- hair color picker for avatar  -->
        <div>
          <label>Robe Color: {{settings.haircolor}}</label>
          <input v-model="settings.haircolor"  type="color"  />
        </div>

        <!-- slider for head size -->
        <div>
          <label>Head Size: {{settings.headSize}}</label>
          <input v-model.number="settings.headSize" 
            step=".01" min=1.1 max=2 type="range"  />
        </div>

        <!-- Select menu for skin image -->
        <div>
          <label>Face Image:</label>
          <select v-model="settings.playerSkin">
            <option v-for="skin in settings.skins" :value="skin">{{ skin }}</option>
          </select>
        </div>
          <button type="button" id="cameraButton" @click="hideVideo">Hide Video</button>
          <button type="button" @click="triggerStart">Start Game</button>
          <button type="button" @click="triggerReset">Reset Game</button>
          <span><p>Controls:
          <br>When all players have joined their own slots, hit "Start Game"
          <br>👆 - Choose the card
          <br>👍 - Confirm selection
          <br>If you encouters any issue, try "Reset Game" and restart the game</p>
          <p>How to play: The dealer shuffles and deals all the cards to players, and each player keeps their cards secret. The player left of the dealer starts by offering their hand face-down to the next player, who draws a card.

The game proceeds with each player offering their hand to the person on their left, who picks a card. Players set aside any pairs of the same number from their hand.

The game ends when all cards are paired and set aside, leaving only the Joker. The player left holding the Joker loses the game.</p>

</span>
        </div>
      <button type="button" class="collapsible" id="controlButton" @click="toggleControl">Fold Controls</button>
    </div>`,  
    data() {
      return {
        avatars,
        settings,
      };
    },
    
    methods: {
      toggleControl() {
        let controlPanel = document.getElementById('controlPanel');
        let button = document.getElementById('controlButton');
        if (controlPanel.style.display === "none") {
          controlPanel.style.display = "block";
          button.textContent = "Fold Controls"
        } else {
          controlPanel.style.display = "none";
          button.textContent = "Open Controls"
        }
      },
      triggerStart() {
        this.settings.startGame=true
      },
      triggerReset() {
        this.settings.resetGame=true
      },
      hideVideo() {
        let preview = document.getElementsByClassName('preview')[0];
        let label = document.getElementById('cameraButton');
        if (preview.style.display === "none") {
          preview.style.display = "block";
          label.textContent = "Hide Preview";
        } else {
          preview.style.display = "none";
          label.textContent = "Display Preview";
        }
      }
    },
    el: "#controls"
  });
  
  // A Vue element for the scene
  window.vueScene = new Vue({
    template: `<a-entity id="scene">
    <a-entity class="studyroom-scene">
    <a-sky src="#sphere-wizard"></a-sky>


    <!-- Exterior directional sunlight -->
     <a-light 
      position="-27 20 -24"
      color="#93e9fb"
      light="type:directional;castShadow:true"
    />
    
    <!-- small light -->
    <a-light color="orange" light="type: spot; castShadow: true; intensity: 1" position="-3 2 15"></a-light>
    
    <!-- small light -->
    <a-light color="orange" light="type: spot; castShadow: true; intensity: 1" position="15 2 0" rotation="0 90 0"></a-light>
    
    <a-light color="orange" light="type: point; castShadow: true; distance: 10" position="0 9 0"></a-light>
    
    <!-- Table -->
    <a-cylinder 
      id="table" 
      src="#oak-diffuse" 
      position="0 0 0" 
      radius="9" 
      height="0.2" 
      repeat="3 3"
      roughness="1" 
      normal-scale= "2 2"
      normalMap="#oak-normal" 
      shadow="receive: true"></a-cylinder>
    
    <!-- Camera -->
    <a-entity :rotation="cameraRotation">
      <a-entity id="cameraRig" position="0 1.5 14">
        <a-camera camera="fov:60" look-controls wasd-controls />
      </a-entity>
    </a-entity>
     
    <a-entity 
       shadow="receive: true" 
       v-for="cpos in columnPositions"
       :rotation="cpos.rotation"
       :id="'entity-' + cpos.index">
      <a-entity :position="cpos.position" >
        <a-light v-if="cpos.index === settings.playerIndex" color="lightyellow" light="type: spot; angle: 30; castShadow: true; intensity: 0.5" position="0 6 1" rotation="-110 0 0"></a-light>
        <a-entity class="a-text" :text="{value: settings.slots[cpos.index], side: 'double', align: 'center', baseline: 'bottom', wrapCount: 5, width: 5, color: '#000000'}" position="0 0.11 2" rotation="270 180 0"></a-entity>
        <!-- Head -->
        <a-box :src=cpos.image position="0 1 0" :height="0.9 * settings.headSize" :width="0.9 * settings.headSize"></a-box>
        <a-box :color="settings.haircolor" position="0 1 -.1" :height="settings.headSize" :width="settings.headSize" />
        <!-- Body -->
        <a-box :color="settings.haircolor" position="0 0 -.05" :height="settings.headSize" :width="settings.headSize + 1" />
        <a-box :color="settings.haircolor" position="0 -1 -.05" :height="settings.headSize * 2" :width="settings.headSize" />
        <!-- Card --> 
        <a-plane 
          v-if="!myTurnToDraw"
          v-for="(card, cardIndex) in currentPlayerHands" 
          type="card"
          :position="cardPosition(cardIndex)" 
          rotation="0 180 0" 
          :width="settings.cardw"
          :height="settings.cardh"
          :src="getCardImage(card)">
        </a-plane>
        <a-plane 
            v-if="myTurnToDraw"
            v-for="(card, cardIndex) in drawCards" 
            :id="'draw-' + cardIndex"
            type="card"
            :position="cardPosition(cardIndex)" 
            rotation="0 180 0" 
            :width="settings.cardw"
            :height="settings.cardh"
            :src="settings.back.url"
            :material="cardIndex === selectedCard ? 'emissive: #857a00;' : 'emissive: #000000;'">
        </a-plane>
        
      </a-entity>
    </a-entity>

     
    <!-- Spheres -->

    <a-entity id="spheres" position="0 15 0" rotation="0 0 0">
      <!-- Fire sphere -->
      <!-- <a-sphere
          material="shader:displacement-offset"
          myoffset-updater
          :scale="sphere1Size"
          radius="1"
          position="-2 0 0"
          segments-height="128"
          segments-width="128"
          shadow="cast: true"
        >
          <a-animation
            attribute="scale"
            direction="alternate-reverse"
            dur="5000"
            from="1 1 1"
            to="4 4 4"
            repeat="indefinite"
          ></a-animation>
        </a-sphere> -->

        <!-- Glass sphere -->
        <a-entity 
          material="src: #sphere-wizard; metalness:0; roughness: 0;" 
          geometry="primitive: sphere; radius: 1" 
          position="0 0 0" 
          shadow="cast: true"
          :scale="sphere2Size"></a-entity>
      </a-entity>
  </a-entity>
    </a-entity>`,
  computed: {
    cameraRotation() {
      return `0 ${this.settings.rotation} 0`
    },
    sphere1Size() {
      return `${this.settings.sphere1Size} ${this.settings.sphere1Size} ${this.settings.sphere1Size}`;
    },
    sphere2Size() {
      return `${this.settings.sphere2Size} ${this.settings.sphere2Size} ${this.settings.sphere2Size}`;
    },
    columnPositions() {
      console.log(this.settings);
      let count = this.settings.count;
      let columnPositions = [];
      for (var i = 0; i < count; i++) {
        let theta = (i * 360) / count;
        let image = this.settings.skins[i % this.settings.skins.length]
        if (i === this.settings.playerIndex) {
          image = this.settings.playerSkin
        }
        columnPositions[i] = {
          index: i,
          rotation: `0 ${theta} 0`,
          position: `0 0 -${this.settings.columnRadius}`,
          image: image,
        };
      }
      return columnPositions;
    },
    cameraRotation() {
      let i = this.settings.playerIndex;
      let count = this.settings.count;
      let theta = (i * 360) / count + 180;
      return `0 ${theta} 0`
    },
    myTurnToDraw() {
      if (this.game.turnToDraw(this.settings.playerIndex)) {
        // let prevPlayer = (this.settings.playerIndex - 1 + this.settings.count) % this.settings.count;
        this.drawCards = this.game.cardsToDrawFrom(this.settings.playerIndex);
        this.selectedCard = Math.floor(this.drawCards.length / 2)
        return true;
      }
      return false;
    },
  },
  methods: {
      cardPosition(cardIndex) {
        const pos = cardIndex * (0.5 + this.settings.cardw) - (this.currentPlayerHands.length * (0.5 + this.settings.cardw)) / 2
        return `${pos} 2 3`;
      },
      getCardImage(cardName) {
        const card = this.settings.face.find(c => c.name === cardName);
        return card ? card.url : '';
      },
      startGame() {
        // TODO
        this.game.startGame();
        this.updatePlayerHands();
        console.log(this.currentPlayerHands);
      },
      resetGame() {
        // TODO: reset the game states and player settings, update to server
        let players = []
        for (let i = 0; i < this.settings.count; i++) {
          players.push(new Player(i, this.settings.skins[i % this.settings.skins.length], "#002164", 1))
        }
        this.players = players;
        this.game = new GameLogic(players);
        
        countRef.set(this.settings.count);
        playersRef.set(players);
        gameStateRef.set(this.game.gameState);
        currentPlayerIndexRef.set(this.game.currentPlayerIndex);
        playerHandsRef.set(this.game.playerHands);
      },
      updatePlayers() {
        // TODO: update the players in the view
      },
      updatePlayerHands() {
        // TODO: update the player's card in the view according to this.game.playerHands[this.playerIndex]
        this.currentPlayerHands = this.game ? this.game.playerHands[this.settings.playerIndex] : []
      },
      selectCard(change) {
        // You can handle the card selection logic here, like saving the card
        // information and making it emissive. 

        // Save the card info. This depends on how your game logic is structured.
        if (!this.game.turnToDraw(this.settings.playerIndex)) 
          return;
        let newSelection = (this.selectedCard + change + this.drawCards.length) % this.drawCards.length;
//         // Old card
//         let oldCard = document.getElementById("draw-" + this.selectedCard);
//         if (oldCard) {
//           oldCard.classList.remove('emissive: #857a00;');
//         }

//         // Make the card emissive.
//         let cardElement = document.getElementById("draw-" + newSelection);
//         if (cardElement) {
//           cardElement.classList.add('emissive: #857a00;');
//         }
        this.selectedCard = newSelection;
        
      },
      playerTurn() {
        let prevPlayer = (this.settings.playerIndex - 1 + this.settings.count) % this.settings.count;
        try{
          console.log(this.drawCards[this.selectedCard] + "was drawn.");
          this.game.playerTurn(prevPlayer, this.selectedCard);
        } catch (e) {
          console.warn(e);
        }
        // this.updatePlayerHands();
      },
  },
  mounted() {
    // console.log("Scene!")
    
    // Rotate the scene on a turntable
    // setInterval(() => {
    //   settings.rotation += settings.rotationSpeed
    // }, 10) 
    
    console.log("Start Studyroom scene");
    console.log("settings", this.settings)
    
    // Initialize players.
    let players = []
    for (let i = 0; i < this.settings.count; i++) {
      players.push(new Player(i, this.settings.skins[i % this.settings.skins.length], "#002164", 1))
    }
    this.players = players;
    this.game = new GameLogic(players);
    
    // Load players from db
    countRef.on('value', (snapshot) => {
      const data = snapshot.val();
      this.settings.count = data;
    })
    playersRef.on('value', (snapshot) => {
      const data = snapshot.val();
      this.players = data;
      this.updatePlayers()
    });
    gameStateRef.on('value', (snapshot) => {
      const data = snapshot.val();
      this.game.gameState = data;
    });
    currentPlayerIndexRef.on('value', (snapshot) => {
      const data = snapshot.val();
      this.game.currentPlayerIndex = data;
    });
    playerHandsRef.on('value', (snapshot) => {
      if (this.game.gameState === 'started') {
        const data = snapshot.val();
        this.game.playerHands = data;
        this.updatePlayerHands();
      }
    });
  },
    
    data() {
      return {
        avatars,
        settings,
        // Initial game state
        game: undefined,
        players: [],
        currentPlayerHands: [],
        drawCards: [],
        selectedCard: 0,
      };
    },
    watch: {
      'settings.count'(newValue) {
        countRef.set(newValue);
      },
      'settings.startGame'(newValue) {
        if (newValue === true) {
          this.startGame();
          this.settings.startGame = false;
        }
      },
      'settings.resetGame'(newValue) {
        if (newValue === true) {
          this.resetGame();
          this.settings.resetGame = false;
        }
      },
      'settings.playerIndex'(newValue) {
        this.updatePlayerHands();
      },
      'game.currentPlayerIndex'(newValue) {
        this.updatePlayerHands();
      },
    },
    
    el: "#scene"
  });
  initGestureControl(window.vueScene);
};
