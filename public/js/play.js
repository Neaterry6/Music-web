const videoPlayer = document.getElementById("videoPlayer");

function applyEffect(effect) {
    switch (effect) {
        case "normal":
            videoPlayer.playbackRate = 1.0;
            break;
        case "slow":
            videoPlayer.playbackRate = 0.5;
            break;
        case "speedup":
            videoPlayer.playbackRate = 1.5;
            break;
        case "reverb":
            alert("Reverb effect is not yet supported.");
            break;
        default:
            console.error("Unknown effect:", effect);
    }
