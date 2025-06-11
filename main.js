let isSpinning = false;
let coins = 50;
let spinCount = 0;
let wins = 0;
let losses = 0;
let betAmount = 1;
const betIncrements = [1, 2, 5, 10, 20, 50];
const spinSound = new Audio('casino-slot-machine-win-sound-effect.mp3');
const winSound = new Audio('win-sound.mp3');  
const loseSound = new Audio('sound-effect-hd.mp3');

document.addEventListener("DOMContentLoaded", function () {
    const increaseBetBtn = document.getElementById("increaseBet");
    const decreaseBetBtn = document.getElementById("decreaseBet");
    const spinBtn = document.getElementById("spinBtn");

    increaseBetBtn.addEventListener("click", increaseBet);
    decreaseBetBtn.addEventListener("click", decreaseBet);
    spinBtn.addEventListener("click", spin);

    updateCoinsDisplay();
    updateBetDisplay();
    updateSpinCountDisplay();
    updateWinLossDisplay();
    generateRandomNumbers();
});

function increaseBet() {
    let nextBet = betIncrements.find(amount => amount > betAmount && amount <= coins);
    betAmount = nextBet || coins; 
    updateBetDisplay();
}

function decreaseBet() {
    let previousBet = [...betIncrements].reverse().find(amount => amount < betAmount);
    betAmount = previousBet || 1; 
    updateBetDisplay();
}

function updateCoinsDisplay() {
    document.getElementById("coinCount").textContent = `Coins: ${coins}`;
}

function updateBetDisplay() {
    document.getElementById("betAmount").textContent = betAmount;
}

function updateSpinCountDisplay() {
    document.getElementById("spinCount").textContent = `Spins: ${spinCount}`;
}

function updateWinLossDisplay() {
    document.getElementById("winCount").textContent = `Wins: ${wins}`;
    document.getElementById("lossCount").textContent = `Losses: ${losses}`;
}

function spin() {
    if (isSpinning || coins < betAmount) return;
    spinSound.play();
    isSpinning = true;
    coins -= betAmount;
    spinCount++;
    updateCoinsDisplay();
    updateSpinCountDisplay();

    const spinBtn = document.getElementById("spinBtn");
    spinBtn.disabled = true;
    spinBtn.src = "pakadole.png";


    setTimeout(() => {
        spinBtn.src = "pakahore.png";
    }, 2000);

    const imageMap = {
        0: "grape.png",
        1: "jahod.png",
        2: "melon.png",
        3: "pome.png",
        4: "tresen.png",
        5: "zvon.png",
        6: "7.png"
    };

    const slots = ["slot1", "slot2", "slot3"].map(id => document.getElementById(id));
    const numbers = ["num1", "num2", "num3"].map(id => document.getElementById(id));
    const result = document.getElementById("result");
    let finalNumbers = [];
    let completedSlots = 0;

    slots.forEach((slot, index) => {
        slot.classList.add("animate");

        let spinDuration = 50;
        let spinIterations = 20 + index * 1;

        function spinSlot(iteration) {
            if (iteration >= spinIterations) {
                setTimeout(() => {
                    let finalNum = Math.floor(Math.random() * 7);
                    finalNumbers[index] = finalNum;
                    numbers[index].textContent = finalNum;
                    slot.src = imageMap[finalNum];
                    slot.classList.remove("animate");
                    completedSlots++;

                    if (completedSlots === 3) {
                        setTimeout(showResult, 500);
                    }
                }, index * 100);
                return;
            }

            let randomNum = Math.floor(Math.random() * 7);
            numbers[index].textContent = randomNum;
            slot.src = imageMap[randomNum];

            setTimeout(() => {
                spinSlot(iteration + 1);
            }, spinDuration);

            spinDuration += 20;
        }

        spinSlot(0);
    });

    let consecutiveLosses = 0; 

    function showResult() {
        try {
            let isWin = finalNumbers[0] === finalNumbers[1] && finalNumbers[1] === finalNumbers[2];
            let isJackpot = isWin && finalNumbers[0] === 6; 
            let prize = isJackpot ? betAmount * 50 : (isWin ? betAmount * 10 : 0);

            if (consecutiveLosses >= 10) {

                isWin = true;
                finalNumbers[0] = finalNumbers[1] = finalNumbers[2] = Math.floor(Math.random() * 6) + 1;
                prize = betAmount * 5;
            }

            if (isJackpot) {
                coins += prize;
                wins++;
                result.textContent = `🎰 JACKPOT! 🎉 +${prize} Coins 🎰`;
                winSound.play();
                consecutiveLosses = 0;
            } else if (isWin) {
                coins += prize;
                wins++;
                result.textContent = `🎉 Win! +${prize} Coins 🎉`;
                winSound.play();
                consecutiveLosses = 0;
            } else {
                setTimeout(() => { loseSound.play(); }, 1000);
                losses++;
                consecutiveLosses++;
                result.textContent = "❌ You Lost! ❌";

            }

            updateCoinsDisplay();
            updateWinLossDisplay();

        } finally {
            const spinBtn = document.getElementById("spinBtn");
            spinBtn.disabled = false;
            isSpinning = false;
            checkGameOver();
        }
    }
}

function checkGameOver() {
    if (coins <= 0) {
        document.getElementById("spinBtn").disabled = true;


        const modal = document.getElementById("gameOverModal");
        modal.style.display = "flex";


        document.getElementById("restartBtn").onclick = () => {
            modal.style.display = "none";
            restartGame();
        };

        document.getElementById("closeModalBtn").onclick = () => {
            modal.style.display = "none";
        };
    }
}


function restartGame() {
    coins = 50;
    spinCount = 0;
    wins = 0;
    losses = 0;
    betAmount = 1;
    updateCoinsDisplay();
    updateBetDisplay();
    updateSpinCountDisplay();
    updateWinLossDisplay();
    document.getElementById("spinBtn").disabled = false;
    document.getElementById("result").textContent = "";
    generateRandomNumbers();
}

function generateRandomNumbers() {
    const imageMap = {
        0: "grape.png",
        1: "jahod.png",
        2: "melon.png",
        3: "pome.png",
        4: "tresen.png",
        5: "zvon.png",
        6: "7.png"
    };

    ["slot1", "slot2", "slot3"].forEach((id, index) => {
        let randomNum = Math.floor(Math.random() * 7);
        document.getElementById(id).src = imageMap[randomNum];
        document.getElementById(`num${index + 1}`).textContent = randomNum;
    });

    updateCoinsDisplay();
    updateSpinCountDisplay();
}
window.onload = generateRandomNumbers;
