/* ==========================================
   TIKIGO JAVASCRIPT
   ========================================== */


let currentPage = 1;

let selectedBus = null;

let tikigoMap = null;


/* ==========================================
   BUS DATA
   ========================================== */

const buses = [

    {
        id: "TKG01",
        name: "Volcano Express",
        type: "Comfort Coach",
        time: "07:30",
        fare: "RWF 5,500",
        seats: 18,
        station: "Nyabugogo Bus Park"
    },

    {
        id: "TKG02",
        name: "Kigali Coach",
        type: "Express Coach",
        time: "09:15",
        fare: "RWF 6,000",
        seats: 9,
        station: "Nyabugogo Bus Park"
    },

    {
        id: "TKG03",
        name: "Horizon Bus",
        type: "Comfort Coach",
        time: "11:45",
        fare: "RWF 5,000",
        seats: 23,
        station: "Nyabugogo Bus Park"
    },

    {
        id: "TKG04",
        name: "Ritco",
        type: "Public Coach",
        time: "14:20",
        fare: "RWF 4,800",
        seats: 31,
        station: "Nyabugogo Bus Park"
    }

];


/* ==========================================
   PAGE LOADING
   ========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const date =
            document.getElementById("travelDate");

        if (date) {

            date.value =
                new Date()
                .toISOString()
                .split("T")[0];

        }


        loadProfile();

        renderBuses();

        initializeMap();

        loadTheme();

    }
);


/* ==========================================
   CHANGE PAGE
   ========================================== */

function showPage(pageNumber) {

    currentPage = pageNumber;


    document
        .querySelectorAll(".page")
        .forEach(function (page) {

            page.classList.remove("active");

        });


    const selectedPage =
        document.getElementById(
            "page" + pageNumber
        );


    if (selectedPage) {

        selectedPage.classList.add("active");

    }


    document
        .querySelectorAll(".page-button")
        .forEach(function (button) {

            button.classList.remove("active");

        });


    const buttons =
        document.querySelectorAll(
            ".page-button"
        );


    if (buttons[pageNumber - 1]) {

        buttons[
            pageNumber - 1
        ].classList.add("active");

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


    if (
        pageNumber === 2 &&
        tikigoMap
    ) {

        setTimeout(function () {

            tikigoMap.invalidateSize();

        }, 300);

    }


    if (pageNumber === 3) {

        updatePaymentPage();

    }

}


/* ==========================================
   FIND BUSES
   ========================================== */

function findBuses() {

    const from =
        document.getElementById(
            "fromDistrict"
        ).value;


    const destination =
        document.getElementById(
            "toDistrict"
        ).value;


    if (from === destination) {

        showToast(
            "Please choose a different destination."
        );

        return;

    }


    document.getElementById(
        "routeSummary"
    ).textContent =
        from + " → " + destination;


    renderBuses();

    showPage(2);

}


/* ==========================================
   DISPLAY BUSES
   ========================================== */

function renderBuses() {

    const container =
        document.getElementById(
            "busList"
        );


    if (!container) return;


    container.innerHTML = "";


    buses.forEach(function (bus) {

        const article =
            document.createElement("article");


        article.className =
            "bus-option";


        if (
            selectedBus &&
            selectedBus.id === bus.id
        ) {

            article.classList.add(
                "selected"
            );

        }


        article.innerHTML = `

            <div>

                <div class="bus-name">
                    ${bus.name}
                </div>

                <div class="bus-meta">

                    <span>
                        🚌 ${bus.type}
                    </span>

                    <span>
                        🕒 ${bus.time}
                    </span>

                    <span>
                        💺 ${bus.seats} seats
                    </span>

                </div>

            </div>


            <div style="text-align:right">

                <div class="bus-price">
                    ${bus.fare}
                </div>

                <button
                    class="small-button"
                    onclick="selectBus('${bus.id}')">

                    ${
                        selectedBus &&
                        selectedBus.id === bus.id
                            ? "Selected ✓"
                            : "Select bus"
                    }

                </button>

            </div>

        `;


        container.appendChild(article);

    });

}


/* ==========================================
   SELECT BUS
   ========================================== */

function selectBus(id) {

    selectedBus =
        buses.find(function (bus) {

            return bus.id === id;

        });


    renderBuses();

    updatePaymentPage();


    showToast(
        selectedBus.name +
        " selected."
    );

}


/* ==========================================
   GO TO PAYMENT
   ========================================== */

function goToPayment() {

    if (!selectedBus) {

        showToast(
            "Please select a bus first."
        );

        return;

    }


    updatePaymentPage();

    showPage(3);

}


/* ==========================================
   UPDATE PAYMENT INFORMATION
   ========================================== */

function updatePaymentPage() {

    const from =
        document.getElementById(
            "fromDistrict"
        ).value;


    const destination =
        document.getElementById(
            "toDistrict"
        ).value;


    document.getElementById(
        "payFrom"
    ).value = from;


    document.getElementById(
        "payTo"
    ).value = destination;


    if (!selectedBus) {

        document.getElementById(
            "payBus"
        ).value = "";

        document.getElementById(
            "previewBus"
        ).textContent =
            "Select a bus";

        document.getElementById(
            "previewTime"
        ).textContent = "—";

        document.getElementById(
            "previewFare"
        ).textContent = "—";

        return;

    }


    document.getElementById(
        "payBus"
    ).value =
        selectedBus.name;


    document.getElementById(
        "previewBus"
    ).textContent =
        selectedBus.name;


    document.getElementById(
        "previewRoute"
    ).textContent =
        from + " → " + destination;


    document.getElementById(
        "previewTime"
    ).textContent =
        selectedBus.time;


    document.getElementById(
        "previewFare"
    ).textContent =
        selectedBus.fare;

}


/* ==========================================
   PROCESS PAYMENT
   ========================================== */

function processPayment(event) {

    event.preventDefault();


    if (!selectedBus) {

        showToast(
            "Please select a bus first."
        );

        showPage(2);

        return;

    }


    const name =
        document.getElementById(
            "payName"
        ).value.trim();


    const phone =
        document.getElementById(
            "payPhone"
        ).value.trim();


    const pin =
        document.getElementById(
            "momoPin"
        ).value.trim();


    if (!name || !phone) {

        showToast(
            "Please enter your name and mobile number."
        );

        return;

    }


    if (!/^[0-9]{4,5}$/.test(pin)) {

        showToast(
            "Enter a 4–5 digit demo MoMo PIN."
        );

        return;

    }


    /*
       IMPORTANT:

       This is only a front-end demonstration.

       The PIN is NOT stored
       and is NOT sent anywhere.
    */


    document.getElementById(
        "momoPin"
    ).value = "";


    const from =
        document.getElementById(
            "fromDistrict"
        ).value;


    const destination =
        document.getElementById(
            "toDistrict"
        ).value;


    const ticketNumber =
        "TKG-" +
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    document.getElementById(
        "ticketName"
    ).textContent = name;


    document.getElementById(
        "ticketPhone"
    ).textContent = phone;


    document.getElementById(
        "ticketBus"
    ).textContent =
        selectedBus.name;


    document.getElementById(
        "ticketRoute"
    ).textContent =
        from + " → " + destination;


    document.getElementById(
        "ticketStation"
    ).textContent =
        selectedBus.station;


    document.getElementById(
        "ticketTime"
    ).textContent =
        selectedBus.time;


    document.getElementById(
        "ticketCode"
    ).textContent =
        ticketNumber;


    document.getElementById(
        "confirmationText"
    ).textContent =

        "Welcome " +
        name +
        ". Your payment to Tikigo services has been done and approved. " +

        "Your " +
        selectedBus.name +
        " ticket is ready for boarding at " +
        selectedBus.station +
        ".";


    showToast(
        "Payment approved."
    );


    showPage(4);

}


/* ==========================================
   PROFILE
   ========================================== */

function saveProfile() {

    const profile = {

        name:
            document.getElementById(
                "profileName"
            ).value.trim(),

        email:
            document.getElementById(
                "profileEmail"
            ).value.trim(),

        phone:
            document.getElementById(
                "profilePhone"
            ).value.trim(),

        location:
            document.getElementById(
                "profileLocation"
            ).value.trim()

    };


    if (
        !profile.name ||
        !profile.email ||
        !profile.phone ||
        !profile.location
    ) {

        showToast(
            "Please complete your profile."
        );

        return;

    }


    localStorage.setItem(
        "tikigoProfile",
        JSON.stringify(profile)
    );


    showToast(
        "Profile saved successfully."
    );

}


/* ==========================================
   LOAD PROFILE
   ========================================== */

function loadProfile() {

    const saved =
        localStorage.getItem(
            "tikigoProfile"
        );


    if (!saved) return;


    const profile =
        JSON.parse(saved);


    document.getElementById(
        "profileName"
    ).value =
        profile.name || "";


    document.getElementById(
        "profileEmail"
    ).value =
        profile.email || "";


    document.getElementById(
        "profilePhone"
    ).value =
        profile.phone || "";


    document.getElementById(
        "profileLocation"
    ).value =
        profile.location || "";

}


/* ==========================================
   SETTINGS
   ========================================== */

function openSettings() {

    const saved =
        localStorage.getItem(
            "tikigoProfile"
        );


    const box =
        document.getElementById(
            "settingsSummary"
        );


    if (!saved) {

        box.textContent =
            "No profile saved yet.";

    }

    else {

        const profile =
            JSON.parse(saved);


        box.innerHTML = `

            <strong>
                ${profile.name}
            </strong>

            <br>

            ${profile.email}

            <br>

            ${profile.phone}

            <br>

            ${profile.location}

        `;

    }


    document
        .getElementById(
            "settingsModal"
        )
        .classList.remove("hidden");

}


function closeSettings() {

    document
        .getElementById(
            "settingsModal"
        )
        .classList.add("hidden");

}


/* ==========================================
   THEMES
   ========================================== */

function changeTheme(theme) {

    document.body.classList.remove(
        "dark"
    );


    if (theme === "dark") {

        document.body.classList.add(
            "dark"
        );

    }


    if (theme === "system") {

        if (
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
        ) {

            document.body.classList.add(
                "dark"
            );

        }

    }


    localStorage.setItem(
        "tikigoTheme",
        theme
    );


    document
        .querySelectorAll(
            ".theme-choice"
        )
        .forEach(function (button) {

            button.classList.remove(
                "selected"
            );

        });


    document
        .querySelectorAll(
            ".theme-choice"
        )
        .forEach(function (button) {

            if (
                button.textContent
                    .toLowerCase()
                    .includes(theme)
            ) {

                button.classList.add(
                    "selected"
                );

            }

        });

}


function loadTheme() {

    const saved =
        localStorage.getItem(
            "tikigoTheme"
        ) || "system";


    changeTheme(saved);

}


/* ==========================================
   MAP
   ========================================== */

function initializeMap() {

    if (!window.L) return;


    const station = [
        -1.94073,
        30.04475
    ];


    const person = [
        -1.9454,
        30.0571
    ];


    tikigoMap =
        L.map("map")
        .setView(
            station,
            14
        );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {

            maxZoom: 19,

            attribution:
                "&copy; OpenStreetMap contributors"

        }
    ).addTo(tikigoMap);


    /* RED STATION */

    const redIcon =
        L.divIcon({

            className:
                "custom-marker",

            html:
                `<div style="
                    width:18px;
                    height:18px;
                    background:#e03131;
                    border:3px solid white;
                    border-radius:50%;
                    box-shadow:0 2px 8px rgba(0,0,0,.35);
                "></div>`,

            iconSize: [
                18,
                18
            ],

            iconAnchor: [
                9,
                9
            ]

        });


    /* BLUE PERSON */

    const blueIcon =
        L.divIcon({

            className:
                "custom-marker",

            html:
                `<div style="
                    width:18px;
                    height:18px;
                    background:#1971ff;
                    border:3px solid white;
                    border-radius:50%;
                    box-shadow:0 2px 8px rgba(0,0,0,.35);
                "></div>`,

            iconSize: [
                18,
                18
            ],

            iconAnchor: [
                9,
                9
            ]

        });


    L.marker(
        station,
        {
            icon: redIcon
        }
    )
    .addTo(tikigoMap)
    .bindPopup(
        "<strong>Nyabugogo Bus Park</strong><br>" +
        "Nyarugenge District · Kigali"
    )
    .openPopup();


    L.marker(
        person,
        {
            icon: blueIcon
        }
    )
    .addTo(tikigoMap)
    .bindPopup(
        "<strong>Your location</strong><br>" +
        "Passenger location"
    );

}


/* ==========================================
   ZOOM TO STATION
   ========================================== */

function zoomStation() {

    if (!tikigoMap) return;


    tikigoMap.setView(

        [
            -1.94073,
            30.04475
        ],

        17,

        {
            animate: true
        }

    );

}


/* ==========================================
   TOAST MESSAGE
   ========================================== */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },

            2800
        );

}

