var button = document.getElementById("klik");
var count = 0;
var specialSoundPlayed = false;

button.onclick = function() {
    count += 1;
    button.innerHTML = "Nappulaa klikattu: " + count;
    playClickSound(); // Kutsuu funktiota, joka soittaa äänen
    
    if (count === 10000 && !specialSoundPlayed) {
        playSpecialSound(); // Kutsuu toista funktiota, joka soittaa erityisen äänen
        specialSoundPlayed = true; // Estää erityisen äänen soittamisen useamman kerran
    }
};

function playClickSound() {
    var audio = new Audio('click.mp3'); // Luo uuden ääniobjektin
    audio.play(); // Soittaa äänen
}

function playSpecialSound() {
    var specialAudio = new Audio('special-sound.mp3'); // Luo uuden erityisen ääniobjektin
    specialAudio.play(); // Soittaa erityisen äänen
}
