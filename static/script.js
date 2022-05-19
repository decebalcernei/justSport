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
function login()
{
    //get the form object
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    // console.log(email);

    fetch('../api/v1/utenti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { username: username, password: password } ),
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        console.log(data);
        return;
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here

};

/**
 * This function refresh the list of books
 */
function loadBooks() {

    const ul = document.getElementById('annunci'); // Get the list where we will place our authors

    ul.textContent = '';

    fetch('../api/v1/annunci')
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(data) { // Here you get the data to modify as you please
        
        console.log(data);

    })
    .catch( error => console.error(error) );// If there is any error you will catch them here
    
}
loadBooks();
