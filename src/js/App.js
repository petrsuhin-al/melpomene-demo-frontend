/* подключение зависимостей */
//= ../../bower_components/jquery/dist/jquery.js
//= ../../bower_components/wavesurfer.js/dist/wavesurfer.min.js
//= ../../node_modules/three/three.js

/* мои скрипты */
//= partials/background-3d.js
//= partials/wavesurfer-settings.js
//= partials/routes.js

newRandomTrack();
$('.main-button').click(() => newRandomTrack());