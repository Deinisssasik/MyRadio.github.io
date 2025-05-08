document.addEventListener('DOMContentLoaded', function() {
    const russianStations = [
        {
            id: "1",
            name: "Европа Плюс",
            url: "http://ep128.hostingradio.ru:8030/ep128",
            genre: "Поп-музыка",
            region: "Москва",
            logo: "img/Europa_plus.png"
        },
        {
            id: "2",
            name: "DFM",
            url: "https://5.restream.one/1964_1",
            genre: "Танцевальная",
            region: "Москва",
            logo: "img/DFM.png"
        },
        {
            id: "3",
            name: "Дорожное Радио",
            url: "http://dorognoe.hostingradio.ru:8000/dorognoe",
            genre: "Авторская музыка",
            region: "Москва",
            logo: "img/Dorognoe_Radio.png"
        },
        {
            id: "4",
            name: "ENERGY",
            url: "http://ic7.101.ru:8000/stream/air/aac/64/99",
            genre: "Танцевальная",
            region: "Москва",
            logo: "img/Radio_ENERGY.png"
        },
        {
            id: "5",
            name: "Радио Шансон",
            url: "http://chanson.hostingradio.ru:8041/chanson128.mp3",
            genre: "Шансон",
            region: "Москва",
            logo: "img/shanson.png"
        },
        {
            id: "6",
            name: "Радио Маяк",
            url: "https://radio.promedia.ru/love-simf",
            genre: "Разговорное",
            region: "Череповец",
            logo: "img/Radio_Mayak.png"
        },
        {
            id: "7",
            name: "Вести FM",
            url: "http://icecast.vgtrk.cdnvideo.ru/vestifm",
            genre: "Новости",
            region: "Москва",
            logo: "img/vesti.webp"
        },
        {
            id: "8",
            name: "Радио Дача",
            url: "http://listen.vdfm.ru:8000/dacha",
            genre: "Русские хиты",
            region: "Россия",
            logo: "img/dacha.png"
        },
        {
            id: "9",
            name: "Русское Радио",
            url: "https://rusradio.hostingradio.ru/rusradio128.mp3",
            genre: "Русская поп-музыка",
            region: "Россия",
            logo: "img/Russkoe_radio.png"
        },
        {
            id: "10",
            name: "Новое Радио",
            url: "https://icecast-newradio.cdnvideo.ru/newradio3",
            genre: "Русская поп-музыка",
            region: "Москва",
            logo: "img/Novoe.png"
        },
        {
            id: "11",
            name: "Love Radio",
            url: "https://radio.promedia.ru/love-simf",
            genre: "Поп-музыка",
            region: "Симферополь",
            logo: "img/love.png"
        },
        {
            id: "12",
            name: "Радио Монте-Карло",
            url: "https://mc-mcgold.hostingradio.ru/mcgold96.aacp",
            genre: "Поп-музыка",
            region: "Москва",
            logo: "img/Monte.jpg"
        },
        {
            id: "13",
            name: "Рекорд (Radio Record)",
            url: "https://icecast-record.cdnvideo.ru/record",
            genre: "Танцевальная",
            region: "Москва",
            logo: "img/record.png"
        },
        {
            id: "14",
            name: "Авторадио",
            url: "https://pub0301.101.ru:8000/stream/air/aac/64/99",
            genre: "Автомобильная музыка",
            region: "Россия",
            logo: "img/avto_radio.webp"
        },
        {
            id: "15",
            name: "НАШЕ Радио",
            url: "https://nashe1.hostingradio.ru/nashe-256",
            genre: "Русский рок",
            region: "Москва",
            logo: "img/nashe.jpg"
        },
    ];

    // Полный список из 60 станций доступен здесь (ссылка не рабочая):
    // https://pastebin.com/raw/YourPastebinLink

    // DOM элементы(не ебу че это)
    const stationsContainer = document.getElementById('stations-container');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const playerSection = document.getElementById('player-section');
    const currentLogo = document.getElementById('current-logo');
    const currentName = document.getElementById('current-name');
    const currentGenre = document.getElementById('current-genre');
    const playBtn = document.getElementById('play-btn');
    const stopBtn = document.getElementById('stop-btn');
    const favoriteBtn = document.getElementById('favorite-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const tabButtons = document.querySelectorAll('.tab-btn');

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then(registration => {
              console.log('ServiceWorker registration successful');
            })
            .catch(err => {
              console.log('ServiceWorker registration failed: ', err);
            });
        });
      }

    // Состояние приложения(как это работает и для чего это?)
    let allStations = [];
    let filteredStations = [];
    let currentStation = null;
    let currentSound = null;
    let isPlaying = false;
    let favorites = JSON.parse(localStorage.getItem('radio_favorites')) || [];
    let activeTab = 'all';

    // Инициализация(как это происходит?)
    init();

    function init() {
        loadStations();
        setupEventListeners();
    }

    function loadStations() {
        allStations = russianStations;
        filteredStations = [...allStations];
        renderStations();
    }

    function renderStations() {
        stationsContainer.innerHTML = '';

        const stationsToShow = activeTab === 'favorites' 
            ? filteredStations.filter(station => favorites.includes(station.id))
            : filteredStations;

        if (stationsToShow.length === 0) {
            stationsContainer.innerHTML = `
                <div class="empty">
                    <i class="fas fa-radio"></i>
                    <p>Станции не найдены</p>
                </div>
            `;
            return;
        }

        stationsContainer.innerHTML = stationsToShow.map(station => `
            <div class="station-card ${favorites.includes(station.id) ? 'favorite' : ''}" data-id="${station.id}">
                <img src="${station.logo}" alt="${station.name}" class="station-logo">
                <h3 class="station-name">${station.name}</h3>
                <p class="station-genre">${station.genre} • ${station.region}</p>
                <i class="fas fa-star fav-icon"></i>
            </div>
        `).join('');
    }

    function playStation(station) {
        if (currentSound) {
            currentSound.unload();
        }

        currentStation = station;
        currentName.textContent = station.name;
        currentGenre.textContent = `${station.genre} • ${station.region}`;
        currentLogo.src = station.logo;
        playerSection.style.display = 'block';

        updateFavoriteButton();

        currentSound = new Howl({
            src: [station.url],
            html5: true,
            format: ['mp3', 'aac'],
            volume: volumeSlider.value,
            onplay: () => {
                isPlaying = true;
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                stopBtn.disabled = false;
            },
            onpause: () => {
                isPlaying = false;
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            },
            onstop: () => {
                isPlaying = false;
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });

        currentSound.play();
    }

    function toggleFavorite() {
        if (!currentStation) return;

        const index = favorites.indexOf(currentStation.id);
        if (index === -1) {
            favorites.push(currentStation.id);
        } else {
            favorites.splice(index, 1);
        }

        localStorage.setItem('radio_favorites', JSON.stringify(favorites));
        updateFavoriteButton();
        renderStations();
    }

    function updateFavoriteButton() {
        if (!currentStation) return;

        const isFavorite = favorites.includes(currentStation.id);
        favoriteBtn.className = isFavorite ? 'favorite' : '';
        favoriteBtn.innerHTML = isFavorite 
            ? '<i class="fas fa-star"></i>' 
            : '<i class="far fa-star"></i>';
    }

    function filterStations() {
        const searchTerm = searchInput.value.toLowerCase();
        filteredStations = allStations.filter(station => 
            station.name.toLowerCase().includes(searchTerm) ||
            station.genre.toLowerCase().includes(searchTerm) ||
            station.region.toLowerCase().includes(searchTerm)
        );
        renderStations();
    }

    function setupEventListeners() {
        // Поиск(это и все ниже вроже понятно)
        searchInput.addEventListener('input', filterStations);
        searchBtn.addEventListener('click', filterStations);

        // Вкладки
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeTab = btn.dataset.tab;
                renderStations();
            });
        });

        // Плеер
        playBtn.addEventListener('click', () => {
            if (!currentSound) return;
            
            if (isPlaying) {
                currentSound.pause();
            } else {
                currentSound.play();
            }
        });

        stopBtn.addEventListener('click', () => {
            if (currentSound) {
                currentSound.stop();
            }
        });

        favoriteBtn.addEventListener('click', toggleFavorite);

        volumeSlider.addEventListener('input', () => {
            if (currentSound) {
                currentSound.volume(volumeSlider.value);
            }
        });

        // Клик по станции
        stationsContainer.addEventListener('touchstart', handleStationTap, {passive: true});
stationsContainer.addEventListener('click', handleStationTap);

function handleStationTap(e) {
    if (e.cancelable) e.preventDefault();
    
    const card = e.target.closest('.station-card');
    if (!card) return;
    
    // Добавляем визуальную обратную связь
    card.style.transform = 'scale(0.98)';
    card.style.opacity = '0.8';
    
    // Восстанавливаем стиль через 200мс
    setTimeout(() => {
        card.style.transform = '';
        card.style.opacity = '';
    }, 200);
    
    // Для мобильных: проверяем, было ли это именно нажатие (а не прокрутка)
    if (e.type === 'touchstart') {
        const touch = e.touches[0] || e.changedTouches[0];
        const startX = touch.pageX;
        const startY = touch.pageY;
        let moved = false;
        
        const moveHandler = (moveEvent) => {
            const touch = moveEvent.touches[0] || moveEvent.changedTouches[0];
            if (Math.abs(touch.pageX - startX) > 10 || Math.abs(touch.pageY - startY) > 10) {
                moved = true;
            }
        };
        
        const endHandler = (endEvent) => {
            document.removeEventListener('touchmove', moveHandler);
            document.removeEventListener('touchend', endHandler);
            
            if (!moved) {
                const stationId = card.dataset.id;
                const station = allStations.find(s => s.id === stationId);
                if (station) playStation(station);
            }
        };
        
        document.addEventListener('touchmove', moveHandler, {passive: true});
        document.addEventListener('touchend', endHandler, {passive: true});
    } else {
        // Для десктопов обычный клик
        const stationId = card.dataset.id;
        const station = allStations.find(s => s.id === stationId);
        if (station) playStation(station);
    }
}
    }
});
