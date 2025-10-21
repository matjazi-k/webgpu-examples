
// background music
const music = new Audio("uia-uia-uia-cat.mp3");

document.addEventListener('click', playAudioOnClick);

function playAudioOnClick() {
    music.play();
    document.removeEventListener('click', playAudioOnClick);
}

music.onended = () => {
  music.play();
};