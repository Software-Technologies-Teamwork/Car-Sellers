function showView(viewName) {
    $('main > section').hide();
    $('#' + viewName).show();
}

function showMenuHideLinks() {
    $('#menu a').hide();
    $('#loggedInUser').hide();
    if (sessionStorage.getItem("authToken")) {
        //Logged in user
        $('#linkHome').show();
        $('#linkListAds').show();
        $('#linkCreateAd').show();
        $('#linkLogout').show();
    } else {
        //No user logged in
        $('#linkHome').show();
        $('#linkListAds').show();
        $('#linkLogin').show();
        $('#linkRegister').show();
    }
}

function showHomeView() {
    showView('viewHome');
}

function showLoginView() {
    showView('viewLogin');
    $('#formLogin').trigger('reset')
}

function showRegisterView() {
    showView('viewRegister');
    $('#formRegister').trigger('reset')
}

function showCreateAdView() {
    showView('viewCreateAd');
    $('#formCreateAd').trigger('reset')
}