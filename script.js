const cardContainer = document.getElementById('cardContainer');
const startButton = document.getElementById('startButton');
const themeSelector = document.getElementById('themeSelector');
const timeRecords = document.getElementById('timeRecords');
const placeholderImage = document.getElementById('placeholderImage'); // 獲取佔位圖片容器
const themeImage = document.getElementById('themeImage'); // 獲取顯示的圖片

let startTime, endTime;
let matchedPairs = 0;
let totalPairs = 8; // 8對卡片
let canClick = false; // 控制是否可以點擊卡片
// 主題圖片組
const themes = {
    AZUR: {
        images: [
            'azur lane1.png', 'azur lane1.png',
            'azur lane2.png', 'azur lane2.png',
            'azur lane3.png', 'azur lane3.png',
            'azur lane4.png', 'azur lane4.png',
            'azur lane5.png', 'azur lane5.png',
            'azur lane6.png', 'azur lane6.png',
            'azur lane7.png', 'azur lane7.png',
            'azur lane8.png', 'azur lane8.png'
        ],
        frontText: 'AZUR',  // AZUR主題背面顯示的文字
        placeholderImage: 'AZUR_placeholder.jpg'
    },
    HOLO: {
        images: [
            'sticker1.png', 'sticker1.png',
            'sticker2.png', 'sticker2.png',
            'sticker3.png', 'sticker3.png',
            'sticker4.png', 'sticker4.png',
            'sticker5.png', 'sticker5.png',
            'sticker6.png', 'sticker6.png',
            'sticker7.png', 'sticker7.png',
            'sticker8.png', 'sticker8.png'
        ],
        frontText: 'HOLO' , // HOLO主題背面顯示的文字
        placeholderImage: 'HOLO_placeholder.jpg' // 貼紙主題佔位符圖片
    }
};

// 洗牌函數
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 根據選擇的主題更新佔位符圖片
function updatePlaceholderImage() {
    const selectedTheme = themeSelector.value; // 獲取當前選擇的主題
    const theme = themes[selectedTheme];
    themeImage.src = theme.placeholderImage; // 更新佔位符圖片
}

// 創建卡片
function createCards(theme) {
    const { images, frontText } = themes[theme];  // 根據主題選擇圖片和背面文字
    const shuffledImages = shuffle(images);
    shuffledImages.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.image = image;
        card.onclick = () => flipCard(card);

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <span>${frontText}</span>  <!-- 動態顯示不同的背面文字 -->
                </div>
                <div class="card-back">
                    <img src="${image}" alt="正面" />
                </div>
            </div>
        `;

        cardContainer.appendChild(card);
    });
}

// 翻轉卡片的函數
let flippedCards = [];
function flipCard(card) {
    // 檢查是否可以點擊卡片
    if (!canClick || flippedCards.length >= 2 || card.classList.contains('flipped')) {
        return;
    }

    const cardInner = card.querySelector('.card-inner');
    cardInner.style.transform = 'rotateY(180deg)';
    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 1000);
    }
}

// 檢查是否匹配
function checkMatch() {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.dataset.image === secondCard.dataset.image) {
        matchedPairs++;
        flippedCards = [];
        if (matchedPairs === totalPairs) {
            endGame();
        }
    } else {
        firstCard.querySelector('.card-inner').style.transform = 'rotateY(0deg)';
        secondCard.querySelector('.card-inner').style.transform = 'rotateY(0deg)';
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        flippedCards = [];
    }
}
// 結束遊戲
function endGame() {
    endTime = new Date();
    const elapsedTime = ((endTime - startTime) / 1000).toFixed(2); // 計算遊戲時間（秒）

    // 使用 SweetAlert2 顯示通關時間並詢問是否重新開始
    Swal.fire({
        title: '恭喜通關！',
        text: `通關時間: ${elapsedTime} 秒`,
        icon: 'success',
        confirmButtonText: '重新開始',
    }).then((result) => {
        if (result.isConfirmed) {
            startGame();
        }
    });

    // 在右側添加通關時間紀錄
    const recordItem = document.createElement('li');
    recordItem.textContent = `${elapsedTime} 秒`;
    timeRecords.appendChild(recordItem);
}

// 開始遊戲的函數
function startGame() {
    cardContainer.innerHTML = ''; // 清空之前的卡片
    matchedPairs = 0; // 重置匹配對數
    const selectedTheme = themeSelector.value; // 取得選擇的主題
    createCards(selectedTheme); // 根據選擇的主題創建卡片
    startTime = new Date(); // 記錄遊戲開始的時間
    canClick = false; // 遊戲開始時禁用點擊

    placeholderImage.style.display = 'none';
    // 先顯示正面圖片
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        const cardInner = card.querySelector('.card-inner');
        cardInner.style.transform = 'rotateY(180deg)'; // 顯示圖片
    });

    // 在 10 秒後翻轉到正面顯示 "HOLO"
    setTimeout(() => {
        canClick = true; // 啟用點擊
        allCards.forEach(card => {
            const cardInner = card.querySelector('.card-inner');
            cardInner.style.transform = 'rotateY(0deg)'; // 翻轉到正面
        });
    }, 10000); // 10秒後翻轉並啟用點擊
}
// 監聽主題變化
themeSelector.onchange = updatePlaceholderImage;

// 頁面加載時初始化佔位符圖片
updatePlaceholderImage();   
// 為按鈕添加點擊事件
startButton.onclick = startGame;
