const music = new Audio("uia-uia-uia-cat.mp3");


// plays sound when document clicked on
document.addEventListener('click', playAudioOnClick);
function playAudioOnClick() {
    music.play();
    document.removeEventListener('click', playAudioOnClick);
}

// repeats when music stops
music.onended = () => {
  music.play();
};