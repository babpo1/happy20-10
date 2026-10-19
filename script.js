
const opening = document.getElementById("opening");
const openButton = document.getElementById("openButton");
const card = document.getElementById("card");

const music = document.getElementById("backgroundMusic");
const playButton = document.getElementById("playButton");
const musicStatus = document.getElementById("musicStatus");
const seekBar = document.getElementById("seekBar");
const volumeBar = document.getElementById("volumeBar");
const currentTimeText = document.getElementById("currentTime");
const durationText = document.getElementById("duration");

const effects = document.getElementById("effects");
const flowerButton = document.getElementById("flowerButton");

const flowers = ["🌹", "🌸", "🌷", "💮", "🌺", "💗", "💕"];

let flowerTimer = null;
let opened = false;

// Đổi số giây thành phút:giây
function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return minutes + ":" + String(secs).padStart(2, "0");
}

// Tạo một bông hoa rơi
function createFlower() {
    const flower = document.createElement("span");

    flower.className = "petal";
    flower.textContent =
        flowers[Math.floor(Math.random() * flowers.length)];

    const left = Math.random() * 100;
    const duration = 5 + Math.random() * 5;
    const size = 18 + Math.random() * 25;

    flower.style.left = left + "vw";
    flower.style.fontSize = size + "px";
    flower.style.animationDuration = duration + "s";

    effects.appendChild(flower);

    setTimeout(() => {
        flower.remove();
    }, duration * 1000 + 500);
}

// Tạo nhiều hoa
function startFlowerRain(amount = 5) {
    for (let i = 0; i < amount; i++) {
        setTimeout(createFlower, i * 120);
    }
}

// Cập nhật nút phát nhạc
function updatePlayButton() {
    playButton.textContent = music.paused ? "▶" : "Ⅱ";
    playButton.setAttribute(
        "aria-label",
        music.paused ? "Phát nhạc" : "Tạm dừng nhạc"
    );
}

// Phát nhạc
async function playMusic() {
    try {
        await music.play();
        musicStatus.textContent = "Đang phát nhạc 🎵";
    } catch (error) {
        musicStatus.textContent =
            "Chưa phát được nhạc. Hãy kiểm tra file MP3.";
    }

    updatePlayButton();
}

// Tạm dừng hoặc phát lại
playButton.addEventListener("click", () => {
    if (music.paused) {
        playMusic();
    } else {
        music.pause();
    }
});

// Mở món quà và bắt đầu phát nhạc
openButton.addEventListener("click", () => {
    if (opened) return;
    opened = true;

    opening.classList.add("hide");

    setTimeout(() => {
        card.classList.add("show");
    }, 250);

    startFlowerRain(35);

    if (!flowerTimer) {
        flowerTimer = setInterval(() => {
            startFlowerRain(3);
        }, 1000);
    }

    playMusic();
});

// Cập nhật thời lượng khi tải được thông tin bài hát
music.addEventListener("loadedmetadata", () => {
    durationText.textContent = formatTime(music.duration);
    seekBar.value = 0;
});

// Cập nhật thời gian hiện tại và thanh tua
music.addEventListener("timeupdate", () => {
    currentTimeText.textContent = formatTime(music.currentTime);

    if (Number.isFinite(music.duration) && music.duration > 0) {
        seekBar.value = (music.currentTime / music.duration) * 100;
    }
});

// Tua đến đoạn nhạc mong muốn
seekBar.addEventListener("input", () => {
    if (Number.isFinite(music.duration) && music.duration > 0) {
        music.currentTime =
            (Number(seekBar.value) / 100) * music.duration;
    }
});

// Chỉnh âm lượng
music.volume = 0.5;
volumeBar.value = 0.5;

volumeBar.addEventListener("input", () => {
    music.volume = Number(volumeBar.value);
});

// Cập nhật trạng thái khi phát hoặc tạm dừng
music.addEventListener("play", () => {
    musicStatus.textContent = "Đang phát nhạc 🎵";
    updatePlayButton();
});

music.addEventListener("pause", () => {
    musicStatus.textContent = "Nhạc đã tạm dừng";
    updatePlayButton();
});

music.addEventListener("error", () => {
    musicStatus.textContent =
        "Không tìm thấy nhạc. Kiểm tra music/me-yeu.mp3";
    updatePlayButton();
});

// Gửi thêm hoa cho mẹ
flowerButton.addEventListener("click", () => {
    startFlowerRain(35);
});
