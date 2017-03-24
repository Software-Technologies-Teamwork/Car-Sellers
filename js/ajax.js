function listItems() {
    $('#ads').empty();
    showView('viewAds');
    $('#viewHome').show();
    $.ajax({
        method: 'GET',
        url: kinveyBaseUrl + "appdata/" + kinveyAppId + "/listOfAdverts",
        headers: kinveyAdminAuth,
    }).then(loadAdsSuccess)
        .catch(handleAjaxError);
}

function loadAdsSuccess(adverts) {
    $('#ads').empty();
    if (adverts.length == 0) {
        $('#ads').text('No adverts in the list.');
    } else {
        showInfo('Cars loaded.');
        let advertsTable = $('<table>')
            .append($('<tr>')
                .append('<th>Make</th><th>Model</th>',
                    '<th>Km up to</th><th>Fuel type</th>,' +
                    '<th>Date Published</th><th>Publisher</th>',
                    '<th>Price</th><th>Actions</th>'));
        for (let advert of adverts) {
            appendTableRow(advert, advertsTable);
        }
        $('#ads').append(advertsTable);
    }
    function appendTableRow(advert, advertsTable) {
        let links = [];
        let readMoreLink = $('<a href="#">Read More</a>')
            .click(displayAdvert.bind(this, advert._id));
        links = [readMoreLink];
        if (advert._acl.creator == sessionStorage['userId']) {
            let deleteLink = $('<a href="#">Delete</a>')
                .click(deleteAdvert.bind(this, advert));
            let editLink = $('<a href="#">Edit</a>')
                .click(loadAdvertForEdit.bind(this, advert));
            links = [readMoreLink, ' ', deleteLink, ' ', editLink];
        }

        let tr = $('<tr>').append(
            $('<td>').text(advert.make),
            $('<td>').text(advert.model),
            $('<td>').text(advert.km),
            $('<td>').text(advert.fuelType),
            $('<td>').text(advert.datePublished),
            $('<td>').text(advert.publisher),
            $('<td>').text(advert.price + " lv"),
            $('<td>').append(links)
        );
        advertsTable.append(tr);

    }
}
//Delete
function deleteAdvert(advert) {
    let conf = confirm("Are you sure you want to delete this advert!");
    if(conf === true) {
        $.ajax({
            method: 'DELETE',
            url: kinveyBaseUrl + 'appdata/' + kinveyAppId + '/listOfAdverts/' + advert._id,
            headers: getKinveyUserAuthHeaders()
        }).then(deleteAdvertSuccess)
            .catch(handleAjaxError);

        function deleteAdvertSuccess() {
            listItems();
            showInfo('Advert delete.')
        }
    }
}
//Create
function createAdvert(e) {
    e.preventDefault();
    let advertData = {
        make: $('#formCreateAd input[name=make]').val(),
        model: $('#formCreateAd input[name=model]').val(),
        km: $('#formCreateAd input[name=km]').val(),
        fuelType: $('#formCreateAd input[name=fuelType]').val(),
        datePublished: $('#formCreateAd input[name=datePublished]').val(),
        publisher: sessionStorage.getItem('username'),
        price: $('#formCreateAd input[name=price]').val(),
        image: $('#formCreateAd input[name=image]').val()
    };
    $.ajax({
        method: 'POST',
        url: kinveyBaseUrl + 'appdata/' + kinveyAppId + '/listOfAdverts',
        headers: getKinveyUserAuthHeaders(),
        data: advertData
    }).then(successCreateAdvert)
        .catch(handleAjaxError);

    function successCreateAdvert() {
        listItems();
        showInfo('Advert created.')
    }
}
//Edit
function loadAdvertForEdit(advert) {
    $('#formEditAd input[name=id]').val(advert._id);
    $('#formEditAd input[name=make]').val(advert.make);
    $('#formEditAd input[name=model]').val(advert.model);
    $('#formEditAd input[name=km]').val(advert.km);
    $('#formEditAd input[name=fuelType]').val(advert.fuelType);
    $('#formEditAd input[name=datePublished]').val(advert.datePublished);
    $('#formEditAd input[name=price]').val(advert.price);
    $('#formEditAd input[name=image]').val(advert.image);
    showView('viewEditAd');
}
function editAdvert(e) {
    e.preventDefault();
    let advertData = {
        make: $('#formEditAd input[name=make]').val(),
        model: $('#formEditAd input[name=model]').val(),
        km: $('#formEditAd input[name=km]').val(),
        fuelType: $('#formEditAd input[name=fuelType]').val(),
        datePublished: $('#formEditAd input[name=datePublished]').val(),
        publisher: sessionStorage.getItem('username'),
        price: $('#formEditAd input[name=price]').val(),
        image: $('#formEditAd input[name=image]').val(),
    };

    $.ajax({
        method: "PUT",
        url: kinveyBaseUrl + "appdata/" + kinveyAppId +
        "/listOfAdverts/" + $('#formEditAd input[name=id]').val(),
        data: advertData,
        headers: getKinveyUserAuthHeaders()
    }).then(editAdvertSuccess)
        .catch(handleAjaxError);

    function editAdvertSuccess() {
        listItems();
        showInfo('Advert edited.')
    }
}

function displayAdvert(advertId) {
    $.ajax({
        method: 'GET',
        url: kinveyBaseUrl + "appdata/" + kinveyAppId + "/listOfAdverts/" + advertId,
        headers: kinveyAdminAuth,
    }).then(displayAdvertSuccess)
        .catch(handleAjaxError);

    $('#viewDetailsAd').empty();

    function displayAdvertSuccess(advert) {
        let html = $('<div>');
        html.append(
            $('<img>').attr({src: advert.image, width: "120px", height: "120px"}),
            $('<br>'),
            $('<label>').text('Price:'),
            $('<div>').text(advert.price + " lv"),
            $('<label>').text('Title:'),
            $('<h1>').text(advert.make),
            $('<label>').text('Description:'),
            $('<p>').text(advert.model),
            $('<label>').text('Publisher:'),
            $('<div>').text(advert.publisher),
            $('<label>').text('Date:'),
            $('<div>').text(advert.datePublished)
        );
        html.appendTo($('#viewDetailsAd'));
        showView('viewDetailsAd');
    }
}