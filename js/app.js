// BLACKJACK

// buffer database
let blackjackGame = {
  you: {
    scoreSpan: "#your-score",
    div: "#your-score-div",
    score: 0,
  },
  dealer: {
    scoreSpan: "#dealer-score",
    div: "#dealer-score-div",
    score: 0,
  },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"],
  // name any .png and place them in this array and make sure array.length is updated for the multiplication in math formulas below
  cardsMap: {
    // dictionnary !
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    K: 10,
    J: 10,
    Q: 10,
    A: [1, 11], // ace can have one of the value contained in this array : 2 values only : 1 or 11
  },
  wins: 0,
  losses: 0,
  draws: 0,
  isStand: false,
  turnsOver: false,
};
const YOU = blackjackGame["you"]; // to access you object with that const
const DEALER = blackjackGame["dealer"];
const CARDDECK = blackjackGame["cards"].length;

const hitSound = new Audio("audio/3.mp3");
const winSound = new Audio("audio/1.mp3");
const lossSound = new Audio("audio/3.mp3");

// trigger action on button click
document.querySelector("#hit-button").addEventListener("click", blackjackHit);
document
  .querySelector("#stand-button")
  .addEventListener("click", blackjackHitDealer);
document.querySelector("#deal-button").addEventListener("click", blackjackDeal);

// My turn - process
function blackjackHit() {
  if (blackjackGame["isStand"] === false) {
    let card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
  }
}

// reset all decks and start new game
function blackjackDeal() {
  // showResult(computeWinner()); // if you want to play with a friend, leave it here
  // define all card-on-the-table img objects in a var
  // if turn is over then :
  if (blackjackGame["turnsOver"] === true) {
    blackjackGame["isStand"] = false;
    let yourImages = document
      .querySelector("#your-score-div")
      .querySelectorAll("img");
    let dealerImages = document
      .querySelector("#dealer-score-div")
      .querySelectorAll("img");
    console.log(yourImages);
    // remove all cards based on individual count
    for (i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
    }
    for (i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
    }
    // reinstate hit button
    // document.querySelector("#hit-button").disabled = false;
    // document.querySelector("#stand-button").disabled = false;

    // reset scores
    YOU["score"] = 0;
    DEALER["score"] = 0;
    // update div with reset score and white color
    document.querySelector(YOU["scoreSpan"]).textContent = YOU["score"];
    document.querySelector(YOU["scoreSpan"]).style.color = "white";
    document.querySelector(DEALER["scoreSpan"]).textContent = DEALER["score"];
    document.querySelector(DEALER["scoreSpan"]).style.color = "white";
    // reset upper message to original
    document.querySelector("#blackjack-result").textContent = "Let's Play";
    document.querySelector("#blackjack-result").style.color = "white";
    // reset button
    document.querySelector("#hit-button").disabled = false;
    document.querySelector("#stand-button").disabled = false;
    blackjackGame["turnsOver"] = true;
  }
}

function showCard(card, activePlayer) {
  // if (activePlayer["score"] <= 21) {
  //continue showing cards
  let cardImage = document.createElement("img");
  cardImage.src = `images/${card}.png`;
  document.querySelector(activePlayer["div"]).appendChild(cardImage);
  // hitSound.play();
  // }
}

// algorythm - draw cards
function randomCard() {
  let randomIndex = Math.floor(Math.random() * CARDDECK);
  return blackjackGame["cards"][randomIndex];
}

function updateScore(card, activePlayer) {
  let newcardValue = blackjackGame["cardsMap"][card];
  // ace math logic : if add 11, keeps me below 21 -> add 11, else, add 1
  if (card === "A") {
    if (activePlayer["score"] + newcardValue[1] <= 21) {
      // [0] = 1, [1] = 11 in cardsMap A card array
      activePlayer["score"] += newcardValue[1];
    } else {
      activePlayer["score"] += newcardValue[0];
    }
  } else {
    activePlayer["score"] += newcardValue;
  }
}

function showScore(activePlayer) {
  if (activePlayer["score"] > 21) {
    document.querySelector(activePlayer["scoreSpan"]).textContent = "BUST !";
    document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
    // disable hit button !
    if (activePlayer === YOU) {
      document.querySelector("#hit-button").disabled = true;
    }
  } else {
    document.querySelector(activePlayer["scoreSpan"]).textContent =
      activePlayer["score"];
  }
}

// bot turn - process
async function blackjackHitDealer() {
  // async function when time is involved

  //disable hit button + stand button
  document.querySelector("#hit-button").disabled = true;
  document.querySelector("#stand-button").disabled = true;
  //draw cards process for AI
  blackjackGame["isStand"] = true;
  while (DEALER["score"] < 16 && blackjackGame["isStand"] === true) {
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(500);
    // AI logic
    if (DEALER["score"] > 15) {
      // indicate turn is over
      blackjackGame["turnsOver"] = true;
      // show result
      let winner = computeWinner();
      showResult(winner);
    }
  }
}

//compute winner and return winner name
function computeWinner() {
  let winner;
  // you dont bust
  if (YOU["score"] <= 21) {
    if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
      blackjackGame["wins"]++;
      winner = YOU;
    } else if (YOU["score"] === DEALER["score"]) {
      blackjackGame["draws"]++;
    } else if (YOU["score"] < DEALER["score"]) {
      blackjackGame["losses"]++;
      winner = DEALER;
    }
    // you bust, dealer dont
  } else if (YOU["score"] > 21 && DEALER["score"] <= 21) {
    blackjackGame["losses"]++;
    winner = DEALER;
  }
  // both bust
  else if (YOU["score"] > 21 && DEALER["score"] > 21) {
    blackjackGame["draws"]++;
  }
  return winner;
}

// showing on screen - upper part and score table
function showResult(winner) {
  let message, messageColor;
  if (blackjackGame["turnsOver"]) {
    if (winner === YOU) {
      document.querySelector("#wins").textContent = blackjackGame["wins"];
      message = "You Won !";
      messageColor = "green";
      winSound.play();
    } else if (winner === DEALER) {
      document.querySelector("#losses").textContent = blackjackGame["losses"];
      message = "You Lost !";
      messageColor = "red";
      // lossSound.play();
    } else {
      document.querySelector("#draws").textContent = blackjackGame["draws"];
      message = "You Drew !";
      messageColor = "black";
    }
    document.querySelector("#blackjack-result").textContent = message;
    document.querySelector("#blackjack-result").style.color = messageColor;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
