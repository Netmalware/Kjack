const playerScoreEl = document.getElementById('player-score');
const dealerScoreEl = document.getElementById('dealer-score');
const playerHandEl = document.getElementById('player-hand');
const dealerHandEl = document.getElementById('dealer-hand');
const hitBtn = document.getElementById('hit-btn');
const standBtn = document.getElementById('stand-btn');
const restartBtn = document.getElementById('restart-btn');
const messagesEl = document.getElementById('game-messages');


let deck = [];
let playerHand = [];
let dealerHand = [];
let isPlayerTurn = true;
let gameEnded = false;








function createDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
}


function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}


function startGame() {
    isPlayerTurn = true;
    gameEnded = false;
    playerHand = [];
    dealerHand = [];
    
    createDeck();
    shuffleDeck();

    playerHand.push(deck.pop(), deck.pop());
    dealerHand.push(deck.pop(), deck.pop());

    updateUI();
    toggleButtons(false);
    hideMessage();
    restartBtn.style.display = 'none';
    
    
    document.body.classList.remove('win-fx', 'lose-fx');
    document.querySelector('.casino-table').classList.remove('win-led', 'lose-led');

}


function getCardValue(card) {
    if (['J', 'Q', 'K'].includes(card.value)) {
        return 10;
    }
    if (card.value === 'A') {
        return 11;
    }
    return parseInt(card.value);
}


function calculateScore(hand) {
    let score = hand.reduce((sum, card) => sum + getCardValue(card), 0);
    let aces = hand.filter(card => card.value === 'A').length;

    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }
    return score;
}


function createCardElement(card) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    
    const suitSymbols = {
        'hearts': '♥',
        'diamonds': '♦',
        'clubs': '♣',
        'spades': '♠'
    };

    if (card.suit === 'hearts' || card.suit === 'diamonds') {
        cardEl.classList.add('red-suit');
    } else {
        cardEl.classList.add('black-suit');
    }

    
    cardEl.innerHTML = `
        <span class="card-value">${card.value}</span>
        <span class="card-suit">${suitSymbols[card.suit]}</span>
    `;
    return cardEl;
}


function updateUI() {
    playerHandEl.innerHTML = '';
    dealerHandEl.innerHTML = '';

    playerHand.forEach(card => playerHandEl.appendChild(createCardElement(card)));

    dealerHand.forEach((card, index) => {
        const cardEl = createCardElement(card);
        if (index === 0 && isPlayerTurn) {
            cardEl.classList.add('card-back');
        }
        dealerHandEl.appendChild(cardEl);
    });

    playerScoreEl.textContent = calculateScore(playerHand);

    if (!isPlayerTurn) {
        dealerScoreEl.textContent = calculateScore(dealerHand);
    } else {
        dealerScoreEl.textContent = '?';
    }
}


function showMessage(text) {
    messagesEl.querySelector('span').textContent = text;
    messagesEl.classList.add('visible');
}


function hideMessage() {
    messagesEl.classList.remove('visible');
}


function toggleButtons(disabled) {
    hitBtn.disabled = disabled;
    standBtn.disabled = disabled;
}


function checkWinner() {
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);
    let message = '';

    const table = document.querySelector('.casino-table');

    if (playerScore > 21) {
        message = 'Você estourou! O Dealer venceu.';
        document.body.classList.add('lose-fx');
        table.classList.add('lose-led');
    } else if (dealerScore > 21) {
        message = 'O Dealer estourou! Você venceu!';
        document.body.classList.add('win-fx');
        table.classList.add('win-led');
    } else if (playerScore > dealerScore) {
        message = 'Você venceu!';
        document.body.classList.add('win-fx');
        table.classList.add('win-led');
    } else if (dealerScore > playerScore) {
        message = 'O Dealer venceu.';
        document.body.classList.add('lose-fx');
        table.classList.add('lose-led');
    } else {
        message = 'Empate!';
    }


    showMessage(message);
    gameEnded = true;
    toggleButtons(true);
    restartBtn.style.display = 'inline-block';
}





hitBtn.addEventListener('click', () => {
    if (!gameEnded && isPlayerTurn) {
        playerHand.push(deck.pop());
        updateUI();
        if (calculateScore(playerHand) > 21) {
            isPlayerTurn = false;
            updateUI();
            checkWinner();
        }
    }
});

standBtn.addEventListener('click', () => {
    if (!gameEnded && isPlayerTurn) {
        isPlayerTurn = false;
        updateUI();
        
        const dealerTurnInterval = setInterval(() => {
            if (calculateScore(dealerHand) < 17) {
                dealerHand.push(deck.pop());
                updateUI();
            } else {
                clearInterval(dealerTurnInterval);
                checkWinner();
            }
        }, 1000);
    }
});

restartBtn.addEventListener('click', startGame);


startGame();