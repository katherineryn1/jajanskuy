window.onload = function() {
    const useNodeJS = false; // if not using node server, set to false
    // defaultLiffId fill with LIFF ID yang ada di LIFF URL channel LIFF LINE Developer
    const defaultLiffId = "1655326002-2bjWZRMX"; // change if  not using node server

    // DO NOT CHANGE THIS
    let myLiffId = "";

    // if node is used, fetch the environment variable and pass it to LIFF method
    // otherwise, pass defaultLiffId
    if (useNodeJS) {
        fetch('/send-id')
        .then(function(reqResponse){
            return reqResponse.json();
        })
        .then(function(jsonResponse){
            myLiffId = jsonResponse.id;
            initializeLiffOrDie(myLiffId);
        })
        .catch(function(error){
            document.getElementById("liffAppContent").classList.add('hidden');
            document.getElementById("nodeLiffIdErrorMessage").classList.remove('hidden');
        });
    } else {
        myLiffId = defaultLiffId;
        initializeLiffOrDie(myLiffId);
    }
};

/**
 * Check if myLiffId is null. If nul do not initiate liff.
 * @param {string} myLiffId the LIFF OD of the selected element
 */
function initializeLiffOrDie(myLiffId){
    if (!myLiffId) {
        document.getElementById("liffAppContent").classList.add('hidden');
        document.getElementById("liffIdErrorMessage").classList.remove('hidden');
    } else {
        initializeLiff(myLiffId);
    }
}

/**
* Initialize LIFF
* @param {string} myLiffId The LIFF ID of the selected element
*/
function initializeLiff(myLiffId){
    liff
    .init({
        liffId: myLiffId
    })
    .then(() => {
        // start to ise LIFF's api
        initializeApp();
    })
    .catch((err) => {
        document.getElementById("liffAppContent").classList.add('hidden');
        document.getElementById("liffInitErrorMessage").classList.remove('hidden');
    });
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp(){
    // displayLiffData();
    displayIsInClientInfo();
    registerButtonHandlers();
    
    // Check if user is logged in/out and disable inappropriate button
    if (liff.isLoggedIn()) {
        liff.getProfile()
        .then(profile => {
            document.getElementById('customer').innerHTML = profile.displayName;
            var pict = profile.pictureUrl;
            if (pict != "") {
                document.getElementById('profile-picture').src = pict;
            }
        })
        .catch((err) => {
            console.log('error', err);
        });
    } else {
        document.getElementById("logout").classList.add('hidden');
        login();
    }
}

/**
* Display data generated by invoking LIFF methods
*/
// function displayLiffData() {
//     document.getElementById('isInClient').textContent = liff.isInClient();
//     document.getElementById('isLoggedIn').textContent = liff.isLoggedIn();
// }

/**
* Toggle the login/logout buttons based on the isInClient status, and display a message accordingly
*/
function displayIsInClientInfo() {
    if (liff.isInClient()) {
        document.getElementById("logout").classList.add('hidden');
        document.getElementById("open-browser").classList.remove('hidden');
    } else {
        document.getElementById("logout").classList.remove('hidden');
    }
}

/**
 * To open URL in external or LINE browser
 */
function registerButtonHandlers(){
    document.getElementById('open-browser').addEventListener('click', function(){
        liff.openWindow({
            url: 'https://jajanskuyliff.herokuapp.com/', // fill with Endpoint URL of web app
            external: true
        });
    });

    document.getElementById('logout').addEventListener('click', function() {
        if (liff.isLoggedIn()) {
            liff.logout();
            window.location.reload();
        }
    });

    // Check use LINE or external browser
    document.getElementById('liffLoginButton').addEventListener('click', function() {
        if (!liff.isLoggedIn()) {
            liff.login();
            modal.style.display = "none";
        }
    });
    
    // Send message
    // see simpanOrder function in jajan-config
}

// Login Popup Function
function login() {
    var modal = document.getElementById("login-modal");
    var close = document.getElementById("close");

    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    close.onclick = function () {
        alert("Please... login dulu ya kak~");
    };
}

// Send alert if using external browser
function sendAlertIfNotInClient(){
    alert('Maaf, fitur tidak tersedia karena dibuka melalui external browser');
}

/**
* Toggle specified element
* @param {string} elementId The ID of the selected element
*/
function toggleElement(elementId) {
    const elem = document.getElementById(elementId);
    if (elem.offsetWidth > 0 && elem.offsetHeight > 0) {
        elem.style.display = 'none';
    } else {
        elem.style.display = 'block';
    }
}