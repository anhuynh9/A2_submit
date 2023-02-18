var page = 1;

var perPage = 10;


// load data from movie api
function loadMovieData(title = null) {

    var uri = "";
    if (title == null) {
        uri = "http://localhost:8080/api/movies/?page=" + page + "&perPage=" + perPage;
    } else {
        uri = "http://localhost:8080/api/movies/?page=" + page + "&perPage=5" + "&title=" + title;
    }

    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", uri, false);
    xhReq.send(null);
    var movie_data = JSON.parse(xhReq.responseText);

    populateTable(movie_data);

}

function populateTable(movie_data) {
    var tdata = "";

    // creating tr elements
    for (var i = 0; i < movie_data.length; i++) {
        tdata += '<tr data-bs-toggle="modal" data-bs-target = "#detailsModal" data_id="' + movie_data[i]._id + '">' +
            '<td>' + movie_data[i].year + '</td>' +
            '<td>' + movie_data[i].title + '</td>';

        // plot data
        if (movie_data[i].plot != null) {
            tdata += '<td>' + movie_data[i].plot + '</td>';
        } else {
            tdata += '<td>' + 'N/A' + '</td>'
        }

        // rating data
        if (movie_data[i].rated != null) {
            tdata += '<td>' + movie_data[i].rated + '</td>';
        } else {
            tdata += '<td>' + 'N/A' + '</td>'
        }

        // runtime data
        const runtime = movie_data[i].runtime;
        const hr = Math.floor(runtime / 60);
        const min = (runtime % 60).toString().padStart(2, '0');
        tdata += '<td>' + hr + ':' + min + '</td>' + '</tr>';
    }

    // append tr element data to table body
    var table = document.getElementById('moviesTable');
    const t_body = table.querySelector("#table_body");
    table_body.innerHTML = tdata;
    //table.appendChild(table_body);

    // updating pagination
    var curr_page = document.querySelector("#current-page");
    curr_page.innerHTML = page;

    addClickEvent();
}

function addClickEvent() {
    var table = document.getElementById('moviesTable');
    const trElements = table.querySelectorAll('tr');

    // adding event listener to every <tr> element
    for (var i = 0; i < trElements.length; i++) {
        const data_id = trElements[i].getAttribute('data_id');
        trElements[i].addEventListener('click', function () {
            displayModal(data_id);
        });
    }
}

function displayModal(data_id) {

    // fetch modal data using data id
    var uri = 'http://localhost:8080/api/movies/' + data_id;
    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", uri , false);
    xhReq.send(null);
    var model_data = JSON.parse(xhReq.responseText);

    console.log(model_data);
    // format modal data
    const modalDetail = document.querySelector("#detailsModal");
    const modalTitle = modalDetail.querySelector(".modal-title");
    modalTitle.innerHTML = model_data.title;

    const modalBody = modalDetail.querySelector(".modal-body");

    // create modal body
    var poster = model_data.poster;
    if(poster == null){
        poster = "no-image.jpg";
    }
    var displayFormat = '<img class="img-fluid w-100" src="' + poster + '"><br><br>' +
        '<strong>Directed By:</strong>' + model_data.directors.join(",") + '<br><br>' +
        '<p>' + model_data.fullplot + '</p>' +
        '<strong>Cast:</strong> ' + model_data.cast.join(",") + ' <br><br>' +
        '<strong>Awards:</strong>' + model_data.awards.text + '<br>' +
        '<strong>IMDB Rating:</strong> ' +model_data.imdb.rating + ' ( ' +model_data.imdb.votes + ' votes)';

    modalBody.innerHTML = displayFormat;
}

function pagination() {
    const prev_page = document.querySelector("#previous-page");

    prev_page.addEventListener('click', function () {
        if (page > 1) {
            page--;
            loadMovieData();
        }
        else {
            loadMovieData();
        }
    });

    const next_page = document.querySelector("#next-page");
    next_page.addEventListener('click', function () {
        page++;
        loadMovieData();
    });
}


// form search by title
function searchByTitle() {
    const form = document.querySelector("#searchForm");
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const title = form.querySelector("#title").value;
        loadMovieData(title);
    });

    const clearForm = form.querySelector("#clearForm");

    clearForm.addEventListener('click', function (event) {
        event.preventDefault();
        form.querySelector("#title").value = '';
        loadMovieData();
    });


}

function loadJs() {
    loadMovieData();
    pagination();
    searchByTitle();
}
