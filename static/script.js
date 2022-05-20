/**
 * This variable stores the logged in user
 */
var loggedUser = {};

/**
 * This function is called when login button is pressed.
 * Note that this does not perform an actual authentication of the user.
 * A student is loaded given the specified email,
 * if it exists, the studentId is used in future calls.
 */
function login() {
    //get the form object
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    // console.log(email);

    fetch('../utenti', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
        })
        .then((resp) => resp.json()) // Transform the data into json
        .then(function (data) { // Here you get the data to modify as you please
            console.log(data);
            return;
        })
        .catch(error => console.error(error)); // If there is any error you will catch them here

};


function subscribe() {

    var id_utente = document.getElementById("id_utente").value;
    var id_annuncio = document.getElementById("id_annuncio").value;


    fetch('../annunci/' + id_annuncio, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_utente: id_utente
            }),
        })
        .then((resp) => resp.json()) // Transform the data into json
        .then(function (data) { // Here you get the data to modify as you please
            console.log('Iscrizione effettuata correttamente :)');
            loadAnnunci();
            return;
        })
        .catch(error => console.error(error)); // If there is any error you will catch them here




}


function add() {

    //get the form object
    var min_partecipanti = document.getElementById("min_partecipanti").value;
    var max_partecipanti = document.getElementById("max_partecipanti").value;
    var attrezzatura_necessaria = document.getElementById("attrezzatura_necessaria").value;
    var costo = document.getElementById("costo").value;
    var citta = document.getElementById("citta").value;


    fetch('../annunci', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                min_partecipanti: min_partecipanti,
                max_partecipanti: max_partecipanti,
                attrezzatura_necessaria: attrezzatura_necessaria,
                costo: costo,
                citta: citta
            }),
        })
        .then((resp) => resp.json()) // Transform the data into json
        .then(function (data) { // Here you get the data to modify as you please
            console.log('Annuncio aggiunto correttamente :)');
            loadAnnunci();
            return;
        })
        .catch(error => console.error(error)); // If there is any error you will catch them here

}

/**
 * This function refresh the list of books
 */
function loadAnnunci() {

    const ul = document.getElementById('annunci'); // Get the list where we will place our authors

    ul.textContent = '';

    fetch('../annunci')
        .then((resp) => resp.json()) // Transform the data into json
        .then(function (data) { // Here you get the data to modify as you please

            console.log(data);
            return data.map(function (annuncio) { // Map through the results and for each run the code below


                let li = document.createElement('li');
                let span = document.createElement('span');
                let a = document.createElement('a');
                a.href = annuncio.self
                a.textContent = annuncio.citta;

                // Append all our elements
                span.appendChild(a);
                li.appendChild(span);
                ul.appendChild(li);
            })

        })
        .catch(error => console.error(error)); // If there is any error you will catch them here

}
loadAnnunci();