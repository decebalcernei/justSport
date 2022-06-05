var loggedUser = {}; // contiene dati (token incluso) dell'utente

/*
 * La funzione subscribe viene chiamata ogni volta che si preme il pulsante
 */
async function subscribe(token, id_annuncio) {
    loggedUser.token = token;

    var id_utente = parseJwt(loggedUser.token).id;

    await fetch('../annunci/' + id_annuncio, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-access-token": loggedUser.token
            },
            body: JSON.stringify({
                id_utente: id_utente
            }),
        })
        .then((resp) => resp.json()) // Trasforma i dati della risposta in json
        .then(function (data) { // Data da manipolare come vogliamo
            return;
        })
        .catch(error => console.error(error));
}

// Disiscrivere l'utente dall'annuncio
async function unsubscribe(token, id_annuncio) {
    loggedUser.token = token;

    var id_utente = parseJwt(loggedUser.token).id;

    await fetch('../annunci/' + id_annuncio, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "x-access-token": loggedUser.token
            },
            body: JSON.stringify({
                id_utente: id_utente
            }),
        })
        .then((resp) => resp.json()) // Trasforma i dati della risposta in json
        .then(function (data) { // Data da manipolare come vogliamo
            return;
        })
        .catch(error => console.error(error))
}

function login() {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username == "" || password == "") {
        document.getElementById("conferma").innerHTML = "Non puoi lasciare i campi vuoti";
    } else {
        document.getElementById("conferma").innerHTML = "Login effettuato";
        return fetch("../autenticazione", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            .then((resp) => resp.json()) // Trasforma i dati della risposta in json
            .then(function (data) { // Data da manipolare come vogliamo
                // salviamo i dati dell'utente
                loggedUser.token = data.token;
                loggedUser.username = data.username;
                loggedUser._id = data.id;
            }).then(() => loggedUser.token).catch(error => console.error(error));
    }
}

function registrazione() {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username == "" || password == "") {
        document.getElementById("conferma").innerHTML = "Non puoi lasciare i campi vuoti";
    } else {
        document.getElementById("conferma").innerHTML = "Login effettuato";
        return fetch("../utenti", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
    }
}

/*
 * La funzione add viene chiamata ogni volta che si preme il pulsante
 * questa aggiunge un nuovo annuncio al db 
 */
function add(token) {
    loggedUser.token = token;

    // prendiamo gli elementi del form
    var attrezzatura_necessaria = document.getElementById("attrezzatura_necessaria").value;
    var costo = document.getElementById("costo").value;
    var citta = document.getElementById("citta").value;
    var sport = document.getElementById("sport").value;

    fetch('../annunci', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-access-token": loggedUser.token
            },
            body: JSON.stringify({
                autore: parseJwt(token)._id,
                min_partecipanti: min_partecipanti,
                max_partecipanti: max_partecipanti,
                attrezzatura_necessaria: attrezzatura_necessaria,
                costo: costo,
                citta: citta,
                sport: sport
            }),
        })
        .then((resp) => resp.json()) // Trasforma i dati della risposta in json
        .then(() => {
            window.location.href = "index.html?token=" + loggedUser.token;
        })
        .catch(error => console.error(error));
}

/*
 * La funzione loadAnnunci non fa altro che "richiedere" la lista di tutti 
 * gli annunci che rientrano nei parametri dei filtri e farli vedere.
 */
function loadAnnunci(token) {

    loggedUser.token = token;

    // prendiamo gli elementi del form
    var attrezzatura_necessaria = document.getElementById("attrezzatura_necessaria").value;
    var costo = document.getElementById("costo").value;
    var citta = document.getElementById("citta").value;
    var sport = document.getElementById("sport").value;

    const ul = document.getElementById('annunci'); // Dove andremo a mostrare gli annunci

    ul.textContent = '';

    fetch('../annunci', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': loggedUser.token,
                'attrezzatura_necessaria': attrezzatura_necessaria,
                'costo': costo,
                'citta': citta,
                'sport': sport
            },
        })
        .then((resp) => {
            if (resp.status == 404)
                throw resp.statusText;
            resp.json();
        }) // Trasforma i dati della risposta in json
        .then(function (data) { // Abbiamo data, che possiamo manipolare
            console.log(data);
            return data.map((annuncio) => { // Applichiamo questa funzione anonima ad ogni elemento di `data`
                let li = document.createElement('li');
                let span = document.createElement('span');
                let a = document.createElement('a');
                a.href = "annuncio.html?id_annuncio=" + annuncio._id + "&token=" + loggedUser.token;
                if (!annuncio.sport)
                    a.textContent = annuncio.citta;
                else
                    a.textContent = annuncio.sport;

                // Append all our elements
                span.appendChild(a);
                li.appendChild(span);
                ul.appendChild(li);
            })
        })
        .catch(error => {
            ul.textContent = error;
            console.error(error)
        }); // Catturiamo eventuali errori
    displayNomeUtente();
}

/*
 * La funzione detailAnnuncio mostra informazioni riguardanti l'annuncio scelto 
 */
function detailAnnuncio(id_annuncio, token) {
    loggedUser.token = token;

    var ul = document.getElementById('annuncio');
    var iscrizione_button = document.getElementById("iscrizione");

    ul.textContent = '';

    fetch('../annunci/' + id_annuncio, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': loggedUser.token
            },
        })
        .then((resp) => resp.json())
        .then(function (data) {
            console.log(data);

            let span = document.createElement('span');

            let p_che_si_fa = document.createElement('p');
            let che_si_fa = document.createTextNode("Gioca a " + data.sport + " nella citta' di " + data.citta + "\n");
            p_che_si_fa.appendChild(che_si_fa);

            let p_partecipanti = document.createElement("p");
            let partecipanti;
            if (data.partecipanti.length < data.min_partecipanti)
                partecipanti = document.createTextNode("Servono ancora almeno " + (data.min_partecipanti - data.partecipanti.length) + " partecipanti per soddisfare le richieste dell'autore!")
            else if (data.partecipanti.length < data.max_partecipanti)
                partecipanti = document.createTextNode("Mancano solo " + (data.max_partecipanti - data.partecipanti.length) + " posti!");
            else
                partecipanti = document.createTextNode("I posti di questo annuncio sono esauriti; non ti puoi iscrivere :(");
            p_partecipanti.appendChild(partecipanti);

            let p_attrezzatura = document.createElement("p");
            let attrezzatura;
            if (data.attrezzatura_necessaria)
                attrezzatura = document.createTextNode("Nota che serve l'attrezzatura per partecipare!");
            else
                attrezzatura = document.createTextNode("Non serve attrezzatura per partecipare a questo evento :)");
            p_attrezzatura.appendChild(attrezzatura);

            let p_costo = document.createElement("p");
            let costo;
            if (data.costo > 0)
                costo = document.createTextNode("Per partecipare a questo evento dovrai pagare " + data.costo + "€");
            else
                costo = document.createTextNode("La partecipazione a questo evento e' gratis :)");
            p_costo.appendChild(costo);

            let p_iscritto = document.createElement("p");
            let iscritto;
            if (data.partecipanti.some(e => e === parseJwt(token).id))
                iscritto = document.createTextNode("Sei gia' iscritto a questo annuncio");
            else
                iscritto = document.createTextNode("");
            p_iscritto.appendChild(iscritto);

            span.appendChild(p_che_si_fa);
            span.appendChild(p_partecipanti);
            span.appendChild(p_attrezzatura);
            span.appendChild(p_costo);
            span.appendChild(p_iscritto);

            ul.appendChild(span);

            if (data.partecipanti.some(e => e === parseJwt(token).id)) {
                iscrizione_button.textContent = "disiscriviti";
                iscrizione_button.onclick = async () => {
                    await unsubscribe(token, data._id);
                    window.location.reload();
                };
            } else {
                iscrizione_button.textContent = "iscriviti";
                iscrizione_button.onclick = async () => {
                    await subscribe(token, data._id);
                    window.location.reload();
                };
            }

        })
        .catch(error => console.error(error)); // Catturiamo eventuali errori
    displayNomeUtente();
}

function loadMyAnnunci(arg1) {
    const ul = document.getElementById(arg1); // Dove andremo a mostrare gli annunci
    ul.textContent = '';
    fetch('../utenti/' + parseJwt(loggedUser.token).id)
        .then((resp) => resp.json()) // Trasforma i dati della risposta in json
        .then(function (data) { // Abbiamo data, che possiamo manipolare
            var myAnnunci = '';
            if (arg1 == 'iscrizione_annunci')
                myAnnunci = data.iscrizione_annunci; // myAnnunci = array con annunci ai quali sono iscritto
            else
                myAnnunci = data.annunci_pubblicati;
            if (myAnnunci.length == 0) {
                let li = document.createElement('li');
                let span = document.createElement('span');
                let a = document.createElement('a');
                if (arg1 == 'iscrizione_annunci')
                    a.textContent = "non sei iscritto a nessun annuncio";
                else
                    a.textContent = "non hai pubblicato nessun annuncio";
                // Append all our elements
                span.appendChild(a);
                li.appendChild(span);
                ul.appendChild(li);
            } else {
                for (annuncio in myAnnunci) {
                    let li = document.createElement('li');
                    let span = document.createElement('span');
                    let a = document.createElement('a');
                    a.href = "annuncio.html?id_annuncio=" + myAnnunci[annuncio] + "&token=" + loggedUser.token;
                    fetch('../annunci/' + myAnnunci[annuncio])
                        .then((resp) => resp.json())
                        .then(function (data) {
                            a.textContent = data.citta;

                        })
                        .catch(error => console.error(error)); // Catturiamo eventuali errori
                    // Append all our elements
                    span.appendChild(a);
                    li.appendChild(span);
                    ul.appendChild(li);
                }
            }
        })
        .catch(error => console.error(error)); // Catturiamo eventuali errori
    displayNomeUtente();
}

function loadSezioneUtente(token) {
    loggedUser.token = token;

    loadMyAnnunci('annunci_pubblicati');
    loadMyAnnunci('iscrizione_annunci');
    displayNomeUtente();
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};


function displayNomeUtente() {
    const p = document.getElementById('nome_utente');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get("token");
    if (token != null) {
        nome_utente = parseJwt(token).username;
        p.textContent = 'Ciao, ';
        let a = document.createElement('a');
        a.textContent = nome_utente;
        a.href = "sezione_utente.html?token=" + token;
        p.appendChild(a);
    }
}

function mostraPassword() {
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}