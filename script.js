const songs = [

    { artist: 'Adele', song: 'Someone Like You' },
    { artist: 'Ariana Grande', song: 'Thank U, Next' },
    { artist: 'Ariana Grande', song: '7 Rings' },
    { artist: 'Ed Sheeran', song: 'Shape of You' },
    { artist: 'Ed Sheeran', song: 'Perfect' },
    { artist: 'Taylor Swift', song: 'Love Story' },
    { artist: 'Taylor Swift', song: 'Shake It Off' },
    { artist: 'Drake', song: 'Hotline Bling' },
    { artist: 'Drake', song: 'God’s Plan' },
    { artist: 'The Weeknd', song: 'Blinding Lights' },
    { artist: 'The Weeknd', song: 'Save Your Tears' }
];

const artistInput = document.getElementById('artist');
const songInput = document.getElementById('song');
const artistSuggestions = document.getElementById('artist-suggestions');
const songSuggestions = document.getElementById('song-suggestions');
const lyricsContainer = document.getElementById('lyrics-container');

let selectedArtist = '';
let selectedSong = '';



function filterArtistSuggestions(input) {
    const inputValue = input.value.toLowerCase();
    artistSuggestions.innerHTML = '';

    if (inputValue.length === 0) {
        artistSuggestions.style.display = 'none';
        return;
    }

    const uniqueArtists = [...new Set(songs.filter(song => song.artist.toLowerCase().includes(inputValue)).map(song => song.artist))];

    uniqueArtists.forEach(artist => {
        const option = document.createElement('li');
        option.textContent = artist;
        option.style.padding = '5px';
        option.style.cursor = 'pointer';
        option.addEventListener('click', function () {
            artistInput.value = artist;
            selectedArtist = artist;
            artistSuggestions.innerHTML = '';
            showSongSuggestions();
        });
        artistSuggestions.appendChild(option);
    });

    artistSuggestions.style.display = uniqueArtists.length > 0 ? 'block' : 'none';
}

function showSongSuggestions() {
    songSuggestions.innerHTML = '';
    if (!selectedArtist) return;

    const filteredSongs = songs.filter(song => song.artist === selectedArtist);

    filteredSongs.forEach(item => {
        const option = document.createElement('li');
        option.textContent = item.song;
        option.style.padding = '5px';
        option.style.cursor = 'pointer';
        option.addEventListener('click', function () {
            songInput.value = item.song;
            selectedSong = item.song;
            songSuggestions.innerHTML = '';
            songSuggestions.style.display = 'none';
            getLyrics();
        });
        songSuggestions.appendChild(option);
    });

    songSuggestions.style.display = filteredSongs.length > 0 ? 'block' : 'none';
}

function getLyrics() {


    let artist = artistInput.value.trim();
    let song = songInput.value.trim();

    if (!artist || !song) {
        alert('Lütfen sanatçı ve şarkı adı girin!');
        return;
    }

    if (selectedArtist) artist = selectedArtist;
    if (selectedSong) song = selectedSong;

    fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`)
        .then(response => response.json())
        .then(data => {
            if (data.lyrics) {
                lyricsContainer.style.color = '#ffffff';
                lyricsContainer.innerText = data.lyrics;
            } else {
                lyricsContainer.style.color = 'red';
                lyricsContainer.innerHTML = '😢 Şarkı sözleri bulunamadı.';
            }
        })
        .catch(error => {
            console.error('Hata:', error);
            lyricsContainer.style.color = 'red';
            lyricsContainer.innerHTML = '😢 Bir hata oluştu.';
        });

    artistSuggestions.innerHTML = '';
    songSuggestions.innerHTML = '';
    artistSuggestions.style.display = 'none';
    songSuggestions.style.display = 'none';
}





artistInput.addEventListener('input', () => filterArtistSuggestions(artistInput));

document.getElementById('get-lyrics').addEventListener('click', getLyrics);
