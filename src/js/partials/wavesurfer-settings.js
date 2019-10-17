let wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#6F2AAA',
    height: "90",
    normalize: true
});

wavesurfer.on('pause', () => $(".fas").removeClass("fa-pause").addClass("fa-play"));
wavesurfer.on('play', () => $(".fas").removeClass("fa-play").addClass("fa-pause"));
wavesurfer.on('ready', () => wavesurfer.play());