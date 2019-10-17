const newRandomTrack = () => {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const url = "http://78.158.206.48:26900/api/v1/tracks/";

    $.get(proxyurl + url + 'random/info', (data, status) => {
        if (status === "success") {
            data = JSON.parse(data);
            $('#trackTitle').html(data.artists.join(', '));
            $('#trackDesc').html(data.name);
            console.log(data.artists);
            $.each(data.genres, (index, value) => $('#genresContainer').html('<div class="genre-wrapper"><p class="genre-title">' + value + '</p></div>'));

            wavesurfer.load(proxyurl + url + data.id + '/preview');

            $.get(proxyurl + url + data.id + '/cover', (dataCov, statusCov) => {
                let img = document.createElement("img");
                img.src = (statusCov === "success") ? url + data.id + "/cover" : "../img/default-release-cd.png";
                img.className = "album-cover";
                $('#coverContainer').html(img);
            });

        }
        else {
            console.error("No data");
        }
    });
};