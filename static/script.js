var loggedUser = {}; // contiene dati (token incluso) dell'utente

/*
 * La funzione subscribe viene chiamata ogni volta che si preme il pulsante
 * questa non fa altro che aggiungere un utente al db  
 */
function subscribe(token) {
    loggedUser.token = token;

    var id_utente = document.getElementById("id_utente").value;
    var id_annuncio = document.getElementById("id_annuncio").value;


    fetch('../annunci/' + id_annuncio, {
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

function login() {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    console.log(JSON.stringify({
        username: username,
        password: password
    }));

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
            console.log(loggedUser);
        }).then(() => loggedUser.token).catch(error => console.error(error));
}

/*
 * La funzione add viene chiamata ogni volta che si preme il pulsante
 * questa aggiunge un nuovo annuncio al db 
 */
function add(token) {
    loggedUser.token = token;

    // prendiamo gli elementi del form
    var min_partecipanti = document.getElementById("min_partecipanti").value;
    var max_partecipanti = document.getElementById("max_partecipanti").value;
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
                autore: parseJwt(loggedUser.token).id,
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
            window.location.href = "visualizzazione_annunci.html?token=" + loggedUser.token;
        })
        .catch(error => console.error(error));
}

/*
 * La funzione loadAnnunci non fa altro che "richiedere" la lista di tutti 
 * gli annunci e farli vedere
 */
function loadAnnunci(token) {

    loggedUser.token = token;

    const ul = document.getElementById('annunci'); // Dove andremo a mostrare gli annunci

    ul.textContent = '';

    fetch('../annunci', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': loggedUser.token
            },
        })
        .then((resp) => resp.json()) // Trasforma i dati della risposta in json
        .then(function (data) { // Abbiamo data, che possiamo manipolare
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
        .catch(error => console.error(error)); // Catturiamo eventuali errori

}

/*
 * La funzione detailAnnuncio mostra informazioni riguardanti l'annuncio scelto 
 */
function detailAnnuncio(id_annuncio, token) {
    loggedUser.token = token;

    const ul = document.getElementById('annuncio');

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

            span.appendChild(p_che_si_fa);
            span.appendChild(p_partecipanti);
            span.appendChild(p_attrezzatura);
            span.appendChild(p_costo);

            ul.appendChild(span);

        })
        .catch(error => console.error(error)); // Catturiamo eventuali errori

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

}


function loadSezioneUtente(token) {
    loggedUser.token = token;

    loadMyAnnunci('annunci_pubblicati');
    loadMyAnnunci('iscrizione_annunci');
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};