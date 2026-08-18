// =======================================
// Silent SOS Dashboard JavaScript
// =======================================

// ======================================
// LOGIN PROTECTION
// ======================================

const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
    window.location.href = "login.html";
}

/* ==========================================
   GLOBAL DARK MODE
========================================== */


const savedSettings = JSON.parse(
    localStorage.getItem(`silentSOSSettings_${currentUser}`)
);

if (savedSettings && savedSettings.darkMode) {
    document.body.classList.add("dark-mode");
}

// Welcome Message

const welcomeTitle = document.querySelector(".welcome h1");

const hour = new Date().getHours();

let greeting = "Welcome";

if (hour < 12) {

    greeting = "Good Morning";

} else if (hour < 18) {

    greeting = "Good Afternoon";

} else {

    greeting = "Good Evening";

}

const currentUserEmail = localStorage.getItem("currentUser");
const users = JSON.parse(localStorage.getItem("silentSOSUsers")) || [];

const user = users.find(u => u.email === currentUserEmail);

const userName = user ? user.fullName : "User";

if (welcomeTitle) {

    welcomeTitle.innerHTML =
        `${greeting}, <span>${userName} 👋</span>`;

}

const profileName = document.getElementById("userName");

if (profileName) {

    profileName.textContent = userName;

}


// =======================================
// Active Sidebar Menu
// =======================================

const menuItems = document.querySelectorAll(".menu li");

menuItems.forEach(item => {

    item.addEventListener("click", () => {

        menuItems.forEach(i => i.classList.remove("active"));

        item.classList.add("active");

    });

});



// =======================================
// Statistics Counter
// =======================================

const counters = document.querySelectorAll(".info h2");

counters.forEach(counter => {

    const targetText = counter.innerText;

    const target = parseInt(targetText.replace(/\D/g, ""));

    let count = 0;

    const speed = Math.max(1, Math.ceil(target / 60));

    function updateCounter() {

        if (count < target) {

            count += speed;

            if (count > target) count = target;

            if (targetText.includes("%")) {

                counter.innerText = count + "%";

            } else {

                counter.innerText = count;

            }

            requestAnimationFrame(updateCounter);

        } else {

            counter.innerText = targetText;

        }

    }

    updateCounter();

});

// =======================================
// Search Box
// =======================================

const searchInput = document.querySelector(".search-box input");

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const searchText = this.value.toLowerCase().trim();

        const searchableCards = document.querySelectorAll(
            ".action-card, .service-card, .contact-card, .history-card, .stat-card, .dashboard-contact-item"
        );

        searchableCards.forEach(card => {

            const text = card.textContent.toLowerCase();

            if (text.includes(searchText)) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }

        });

    });

}

// =======================================
// Quick Action Animation
// =======================================

const actionCards = document.querySelectorAll(".action-card");

actionCards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transform = "translateY(-10px) scale(1.02)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});



// =======================================
// Toast Notification
// =======================================

function showToast(message) {

    let toast = document.getElementById("dashboard-toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "dashboard-toast";

        toast.style.position = "fixed";
        toast.style.top = "25px";
        toast.style.right = "25px";
        toast.style.background = "#16A34A";
        toast.style.color = "#fff";
        toast.style.padding = "15px 22px";
        toast.style.borderRadius = "12px";
        toast.style.boxShadow = "0 10px 25px rgba(0,0,0,.15)";
        toast.style.zIndex = "9999";
        toast.style.fontWeight = "600";
        toast.style.opacity = "0";
        toast.style.transition = ".3s";

        document.body.appendChild(toast);

    }

    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;

    toast.style.opacity = "1";

    setTimeout(() => {

        toast.style.opacity = "0";

    }, 2500);

}



// =======================================
// SOS Button
// =======================================

const sosButton = document.querySelector(".sos-btn");

if (sosButton) {

    sosButton.addEventListener("click", function (e) {

        e.preventDefault();

        showToast("Redirecting to Emergency SOS...");

        setTimeout(() => {

            window.location.href = "sos.html";

        }, 1200);

    });

}



// =======================================
// Page Loaded
// =======================================

window.addEventListener("load", () => {

    showToast("Welcome to Silent SOS Dashboard!");

});

// =======================================
// SOS EMERGENCY SYSTEM
// =======================================

const sosBtn = document.getElementById("sosButton");
const countdown = document.getElementById("countdown");

if (sosBtn && countdown) {

    sosBtn.addEventListener("click", startSOS);

}

function startSOS() {

    let time = 5;

    sosBtn.disabled = true;

    sosBtn.style.animation = "pulse .8s infinite";

    countdown.innerHTML =
        `<span style="color:#DC2626;">Sending SOS in ${time}...</span>`;

    const timer = setInterval(() => {

        time--;

        if (time > 0) {

            countdown.innerHTML =
                `<span style="color:#DC2626;">Sending SOS in ${time}...</span>`;

        } else {

            clearInterval(timer);

            sendSOS();

        }

    }, 1000);

}

function sendSOS() {

    const currentUser = localStorage.getItem("currentUser");

const contacts = JSON.parse(
    localStorage.getItem(`emergencyContacts_${currentUser}`)
) || [];

    countdown.innerHTML =
    `<span style="color:#16A34A;">✔ SOS Alert Sent to ${contacts.length} Emergency Contact(s)</span>`;

    showToast("SOS Alert sent to " + contacts.length + " emergency contact(s)!");

    addNotification(
    "SOS Alert Sent",
    `Emergency alert sent to ${contacts.length} contact(s).`
);

    let sosCount = parseInt(localStorage.getItem("sosCount")) || 0;

    sosCount++;

    localStorage.setItem("sosCount", sosCount);

    sosBtn.innerHTML =
        '<i class="fa-solid fa-check"></i>';

    sosBtn.style.background = "#16A34A";

    setTimeout(() => {

        resetSOS();

    }, 4000);

}


function resetSOS() {

    sosBtn.disabled = false;

    sosBtn.innerHTML = "SOS";

    sosBtn.style.background = "#DC2626";

    sosBtn.style.animation = "pulse 2s infinite";

    countdown.innerHTML = "Ready";

}



// =======================================
// EMERGENCY SERVICE BUTTONS
// =======================================

const serviceButtons = document.querySelectorAll(".service-card button");

serviceButtons.forEach(button => {

    button.addEventListener("click", () => {

        const service =
            button.parentElement.querySelector("h3").innerText;

        showToast(`Connecting to ${service}...`);

    });

});



// =======================================
// UPDATE LOCATION
// =======================================

const locationBtn = document.querySelector(".location-btn");

if (locationBtn) {

    locationBtn.addEventListener("click", () => {

        showToast("Updating your current location...");

    });

}



// =======================================
// CALL CONTACTS
// =======================================

const contactButtons = document.querySelectorAll(".contact-card button");

contactButtons.forEach(button => {

    button.addEventListener("click", () => {

        const name =
            button.parentElement.querySelector("h3").innerText;

        showToast(`Calling ${name}...`);

    });

});



// =======================================
// PAGE ANIMATION
// =======================================

window.addEventListener("load", () => {

    const cards = document.querySelectorAll(
        ".service-card,.contact-card,.tip-card,.location-card,.sos-container"
    );

    cards.forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";

        setTimeout(() => {

            card.style.transition = ".6s ease";

            card.style.opacity = "1";

            card.style.transform = "translateY(0)";

        }, index * 120);

    });

});

/* ==========================================
   GET CURRENT LOCATION
========================================== */

const locationButton = document.getElementById("getLocation");
const locationInput = document.getElementById("currentLocation");

if(locationButton && locationInput){

locationButton.addEventListener("click",()=>{

if(navigator.geolocation){

locationInput.value="Fetching location...";

navigator.geolocation.getCurrentPosition(

(position)=>{

currentLatitude=position.coords.latitude;
currentLongitude=position.coords.longitude;

locationInput.value=
`Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`;

},

()=>{

locationInput.value="Unable to fetch location.";

}

);

}else{

locationInput.value="Geolocation is not supported.";

}

});

}

/* ==========================================
   REPORT INCIDENT
========================================== */

const reportForm = document.getElementById("reportForm");

if(reportForm){

reportForm.addEventListener("submit",function(e){

e.preventDefault();

const report={

incidentType:document.getElementById("incidentType").value,

severity:document.getElementById("severity").value,

location:document.getElementById("incidentLocation").value,

description:document.getElementById("description").value,

date:document.getElementById("incidentDate").value,

time:document.getElementById("incidentTime").value,

gps:document.getElementById("currentLocation").value,

notify:document.getElementById("notifyContact").value,

status:"Active"

};

const currentUser = localStorage.getItem("currentUser");

let reports = JSON.parse(
    localStorage.getItem(`incidentReports_${currentUser}`)
) || [];

reports.unshift(report);

localStorage.setItem(
    `incidentReports_${currentUser}`,
    JSON.stringify(reports)
);

alert("Incident Report Submitted Successfully!");

addNotification(
    "Incident Report Submitted",
    "your emergency incident report has been saved successfully."
);

reportForm.reset();

});

}

/* ==========================================
   ALERT HISTORY
========================================== */

const alertHistory = document.getElementById("alertHistory");

if(alertHistory){

const currentUser = localStorage.getItem("currentUser");

const reports = JSON.parse(
    localStorage.getItem(`incidentReports_${currentUser}`)
) || [];

if(reports.length===0){

alertHistory.innerHTML = `
<div class="history-card">
<div class="history-details">
<h3>No Incident Reports</h3>
<p>No emergency reports have been submitted yet.</p>
</div>
</div>
`;

}else{

reports.forEach(report=>{

alertHistory.innerHTML += `

<div class="history-card">

<div class="history-icon active">

<i class="fa-solid fa-triangle-exclamation"></i>

</div>

<div class="history-details">

<h3>${report.incidentType}</h3>

<p><i class="fa-solid fa-location-dot"></i> ${report.location}</p>

<p><i class="fa-solid fa-calendar"></i> ${report.date} ${report.time}</p>

<p><strong>Severity:</strong> ${report.severity}</p>

</div>

<div class="history-status">

<span class="status active">

${report.status}

</span>

</div>

</div>

`;

});

}

}

/* ==========================================
   EMERGENCY CONTACTS
========================================== */

const contactForm = document.getElementById("contactForm");
const contactList = document.getElementById("contactList");

if (contactForm) {

contactForm.addEventListener("submit", function (e) {

e.preventDefault();

const contact = {

name: document.getElementById("contactName").value,

phone: document.getElementById("contactPhone").value,

relationship: document.getElementById("contactRelation").value

};

const currentUser = localStorage.getItem("currentUser");

let contacts = JSON.parse(
    localStorage.getItem(`emergencyContacts_${currentUser}`)
) || [];

contacts.push(contact);

localStorage.setItem(
    `emergencyContacts_${currentUser}`,
    JSON.stringify(contacts)
);

addNotification(
    "Emergency Contact Added",
    `${contact.name} has been added to your emergency contacts.`
);

loadContacts();

contactForm.reset();

});

}

function loadContacts() {

if (!contactList) return;
const currentUser = localStorage.getItem("currentUser");

const contacts = JSON.parse(
    localStorage.getItem(`emergencyContacts_${currentUser}`)
) || [];

contactList.innerHTML = "";

if (contacts.length === 0) {

contactList.innerHTML = "<p>No emergency contacts added yet.</p>";

return;

}

contacts.forEach((contact, index) => {

contactList.innerHTML += `

<div class="history-card">

<div class="history-icon resolved">

<i class="fa-solid fa-user"></i>

</div>

<div class="history-details">

<h3>${contact.name}</h3>

<p><strong>Phone:</strong> ${contact.phone}</p>

<p><strong>Relationship:</strong> ${contact.relationship}</p>

</div>

<div class="history-status">

<button
class="view-btn"
onclick="deleteContact(${index})">

Delete

</button>

</div>

</div>

`;

});

}

function deleteContact(index) {

const currentUser = localStorage.getItem("currentUser");

let contacts = JSON.parse(
    localStorage.getItem(`emergencyContacts_${currentUser}`)
) || [];

contacts.splice(index,1);

localStorage.setItem(
    `emergencyContacts_${currentUser}`,
    JSON.stringify(contacts)
);
loadContacts();

}

loadContacts();

/* ==========================================
   SOS PAGE CONTACTS
========================================== */

const sosContactList = document.getElementById("sosContactList");

if(sosContactList){

const currentUser = localStorage.getItem("currentUser");

const contacts = JSON.parse(
    localStorage.getItem(`emergencyContacts_${currentUser}`)
) || [];

if(contacts.length===0){

sosContactList.innerHTML="<p>No emergency contacts added.</p>";

}else{

contacts.forEach(contact=>{

sosContactList.innerHTML += `

<div class="contact-card">

<img src="images/profile.jpg">

<div>

<h3>${contact.name}</h3>

<p>${contact.relationship}</p>

</div>

<button>

<i class="fa-solid fa-phone"></i>

</button>

</div>

`;

});

}

}



/* ==========================================
   SETTINGS
========================================== */

const settingsForm = document.getElementById("settingsForm");

if (settingsForm) {

const displayName = document.getElementById("displayName");
const settingsEmail = document.getElementById("settingsEmail");
const notificationToggle = document.getElementById("notificationToggle");
const locationToggle = document.getElementById("locationToggle");
const darkModeToggle = document.getElementById("darkModeToggle");

// Load Saved Settings
const currentUser = localStorage.getItem("currentUser");

const savedSettings = JSON.parse(
    localStorage.getItem(`silentSOSSettings_${currentUser}`)
);

if (savedSettings) {

displayName.value = savedSettings.displayName || "";
settingsEmail.value = savedSettings.email || "";
notificationToggle.checked = savedSettings.notifications;
locationToggle.checked = savedSettings.location;
darkModeToggle.checked = savedSettings.darkMode;

if (savedSettings.darkMode) {

document.body.classList.add("dark-mode");

}

}

// Save Settings
settingsForm.addEventListener("submit", function (e) {

e.preventDefault();

const settings = {

displayName: displayName.value,
email: settingsEmail.value,
notifications: notificationToggle.checked,
location: locationToggle.checked,
darkMode: darkModeToggle.checked

};

localStorage.setItem(
    `silentSOSSettings_${currentUser}`,
    JSON.stringify(settings)
);
if (darkModeToggle.checked) {

document.body.classList.add("dark-mode");

} else {

document.body.classList.remove("dark-mode");

}

showToast("Settings saved successfully!");

});

}

/* ==========================================
   ADMIN DASHBOARD
========================================== */

const totalSOS = document.getElementById("totalSOS");
const totalReports = document.getElementById("totalReports");
const totalContacts = document.getElementById("totalContacts");
const totalUsers = document.getElementById("totalUsers");
const adminReportList = document.getElementById("adminReportList");

if (totalSOS && totalReports && totalContacts && totalUsers) {

    // Get data from localStorage
    const reports = JSON.parse(localStorage.getItem("incidentReports")) || [];
    const contacts = JSON.parse(localStorage.getItem("emergencyContacts")) || [];
    const user = JSON.parse(localStorage.getItem("silentSOSUser"));

    // Count SOS alerts
    const sosCount = parseInt(localStorage.getItem("sosCount")) || 0;

    totalSOS.innerText = sosCount;
    totalReports.innerText = reports.length;
    totalContacts.innerText = contacts.length;
    totalUsers.innerText = user ? 1 : 0;

    // Show recent reports
    if (adminReportList) {

        if (reports.length === 0) {

            adminReportList.innerHTML = `
            <div class="history-card">
                <div class="history-details">
                    <h3>No Incident Reports Found</h3>
                    <p>No reports have been submitted yet.</p>
                </div>
            </div>
            `;

        } else {

            reports.forEach(report => {

                adminReportList.innerHTML += `

                <div class="history-card">

                    <div class="history-icon active">

                        <i class="fa-solid fa-triangle-exclamation"></i>

                    </div>

                    <div class="history-details">

                        <h3>${report.incidentType}</h3>

                        <p><strong>Location:</strong> ${report.location}</p>

                        <p><strong>Severity:</strong> ${report.severity}</p>

                        <p>${report.date} ${report.time}</p>

                    </div>

                    <div class="history-status">

                        <span class="status active">

                            ${report.status}

                        </span>

                    </div>

                </div>

                `;

            });

        }

    }

}

/* ==========================================
   LOAD USER PROFILE
========================================== */

const profileUser = users.find(
    u => u.email === currentUser
);

if (profileUser) {

    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    const profilePhone = document.getElementById("profilePhone");

    if (profileName) {
        profileName.textContent = profileUser.fullName;
    }

    if (profileEmail) {
        profileEmail.textContent = profileUser.email;
    }

    if (profilePhone) {
        profilePhone.textContent = profileUser.phone;
    }

}

const profileData = JSON.parse(
    localStorage.getItem(`profileData_${currentUser}`)
);


if (contactList) {

    contactList.innerHTML = "";

    if (profileData && profileData.emergencyContacts && profileData.emergencyContacts.length > 0) {

        profileData.emergencyContacts.forEach(contact => {

            contactList.innerHTML += `
                <div class="contact-item">

                    <div class="profile-icon">
                        <i class="fa-solid fa-user"></i>
                    </div>

                    <div>
                        <h4>${contact.name}</h4>
                        <p>${contact.relation}</p>
                    </div>

                    <button onclick="window.location.href='tel:${contact.phone}'">
                        <i class="fa-solid fa-phone"></i>
                    </button>

                </div>
            `;

        });

    } else {

        contactList.innerHTML = "<p>No emergency contacts added.</p>";

    }

}

/* ==========================================
   DASHBOARD EMERGENCY CONTACT DISPLAY
========================================== */


function loadDashboardContacts(){

const dashboardContactList =
document.getElementById("dashboardContactList");


if(!dashboardContactList) return;


// Get logged in user
const currentUser=
localStorage.getItem("currentUser");



if(!user){

dashboardContactList.innerHTML =
"<p>Please login first.</p>";

return;

}


// User specific storage key

const contactKey =
`emergencyContacts_${currentUser}`;



const contacts = JSON.parse(
localStorage.getItem(contactKey)
) || [];



dashboardContactList.innerHTML = "";



if(contacts.length === 0){

dashboardContactList.innerHTML = `

<div class="empty-contact">

<i class="fa-solid fa-user-plus"></i>

<p>No emergency contacts added yet.</p>

</div>

`;

return;

}




// Show only first 3 contacts on dashboard

contacts.slice(0,3).forEach(contact=>{


dashboardContactList.innerHTML += `

<div class="dashboard-contact-item">


<div class="contact-icon">

<i class="fa-solid fa-user"></i>

</div>


<div class="contact-info">

<h4>${contact.name}</h4>

<p>${contact.relationship}</p>

<span>${contact.phone}</span>

</div>


<button onclick="callContact('${contact.phone}')">

<i class="fa-solid fa-phone"></i>

</button>


</div>

`;


});


}



function callContact(phone){

window.location.href = `tel:${phone}`;

}



// Load when dashboard opens

loadDashboardContacts();


const notificationUser = localStorage.getItem("currentUser");

let notificationKey = "";

if (notificationUser) {

    notificationKey = `notifications_${notificationUser}`;

}

function getNotifications(){

    if(!notificationKey) return [];

    return JSON.parse(localStorage.getItem(notificationKey)) || [];

}

function addNotification(title,message){

    const notifications=getNotifications();

    notifications.unshift({

        title,

        message,

        time:new Date().toLocaleString(),

        read:false

    });

    localStorage.setItem(notificationKey,JSON.stringify(notifications));

    updateNotificationBadge();

}

function updateNotificationBadge(){

    const notifications = getNotifications();

    const unread = notifications.filter(n => !n.read).length;

    const badge = document.querySelector(".badge");

    if(!badge) return;

    badge.textContent = unread;

    badge.style.display = unread > 0 ? "flex" : "none";

}

const bell = document.querySelector(".notification");
const dropdown = document.getElementById("notificationDropdown");
const list = document.getElementById("notificationList");


if(bell && dropdown && list){

bell.addEventListener("click",(e)=>{

    e.stopPropagation();

    dropdown.classList.toggle("show");

    loadNotifications();

});

}


function loadNotifications(){

    const notifications=getNotifications();

    list.innerHTML="";

    if(notifications.length===0){

        list.innerHTML=`
        <div class="empty-notification">

            <i class="fa-solid fa-bell-slash"></i>

            <p>No notifications yet.</p>

        </div>
        `;

        return;

    }

    notifications.forEach((n,index)=>{

        list.innerHTML+=`

        <div class="notification-item ${n.read ? "" : "unread"}"
             style="animation-delay:${index*0.08}s">

            <div class="notification-icon">

                <i class="fa-solid fa-bell"></i>

            </div>

            <div class="notification-text">

                <h4>${n.title}</h4>

                <p>${n.message}</p>

                <small>${n.time}</small>

            </div>

        </div>

        `;

    });

    notifications.forEach(n=>n.read=true);

    localStorage.setItem(notificationKey,JSON.stringify(notifications));

    updateNotificationBadge();

}

document.addEventListener("click",()=>{
    if(dropdown){

    dropdown.classList.remove("show");

    }

});






updateNotificationBadge();

// ======================================
// LOGOUT
// ======================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function (e) {

        e.preventDefault();

        localStorage.removeItem("currentUser");

        window.location.href = "index.html";

    });

}

// ======================================
// EMERGENCY SERVICE FUNCTIONS
// ======================================

function callService(number){

    showToast("Opening phone dialer...");

    setTimeout(()=>{

        window.location.href=`tel:${number}`;

    },500);

}

function openDirections(location){

window.open(

`https://www.google.com/maps/dir/?api=1&destination=${location}`,

"_blank"

);

}

function openNearbyMap(){

    showToast("Finding nearby emergency services...");

    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition((position)=>{

            const lat=position.coords.latitude;
            const lng=position.coords.longitude;

            window.open(
`https://www.google.com/maps/search/hospitals/@${lat},${lng},15z`,
"_blank"
);

        });

    }

}

const nearbyCards=document.querySelectorAll(".nearby-card");

nearbyCards.forEach(card=>{

    card.addEventListener("mouseenter",()=>{

        card.style.transform="translateY(-8px)";
        card.style.boxShadow="0 18px 40px rgba(0,0,0,.15)";

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform="";
        card.style.boxShadow="";

    });

});

const servicesContainer =
document.getElementById("servicesContainer");

if(servicesContainer){

    displayServices();

}



function displayServices() {

    if (!servicesContainer) return;

    servicesContainer.innerHTML = `

    <div class="service-card">
        <div class="service-left">
            <h3><i class="fa-solid fa-hospital"></i> Nearby Hospitals</h3>
            <p>Find the nearest hospitals around your location.</p>
        </div>

        <div class="service-buttons">
            <button onclick="searchNearby('hospital')">
                View Nearby
            </button>
        </div>
    </div>

    <div class="service-card">
        <div class="service-left">
            <h3><i class="fa-solid fa-shield-halved"></i> Nearby Police</h3>
            <p>Locate nearby police stations instantly.</p>
        </div>

        <div class="service-buttons">
            <button onclick="searchNearby('police station')">
                View Nearby
            </button>
        </div>
    </div>

    <div class="service-card">
        <div class="service-left">
            <h3><i class="fa-solid fa-fire-extinguisher"></i> Nearby Fire Stations</h3>
            <p>Find nearby fire stations for emergencies.</p>
        </div>

        <div class="service-buttons">
            <button onclick="searchNearby('fire station')">
                View Nearby
            </button>
        </div>
    </div>

    `;

}

function searchNearby(place){

    navigator.geolocation.getCurrentPosition(function(position){

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const url =
        `https://www.google.com/maps/search/${encodeURIComponent(place)}/@${lat},${lng},15z`;

        window.open(url,"_blank");

    },function(){

        alert("Unable to access your location.");

    });

}



if (searchInput) {

    searchInput.addEventListener("input", function () {

        const searchText = this.value.toLowerCase().trim();

        const searchableCards = document.querySelectorAll(
            ".action-card, .service-card, .contact-card, .history-card, .stat-card, .dashboard-contact-item"
        );

        searchableCards.forEach(card => {

            const text = card.textContent.toLowerCase();

            if (text.includes(searchText)) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }

        });

    });

}

function changePassword(){

    const current = document.getElementById("currentPassword").value;

    const newPass = document.getElementById("newPassword").value;

    const confirm = document.getElementById("confirmPassword").value;

    if(current === "" || newPass === "" || confirm === ""){

        alert("Please fill all password fields.");

        return;

    }

    const currentUser = localStorage.getItem("currentUser");

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const index = users.findIndex(user => user.email === currentUser);

    if(index === -1){

        alert("User not found.");

        return;

    }

    if(users[index].password !== current){

        alert("Current password is incorrect.");

        return;

    }

    if(newPass.length < 6){

        alert("Password must contain at least 6 characters.");

        return;

    }

    if(newPass !== confirm){

        alert("New password and confirm password do not match.");

        return;

    }

    users[index].password = newPass;

    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("currentPassword").value = "";

    document.getElementById("newPassword").value = "";

    document.getElementById("confirmPassword").value = "";

    showToast("Password updated successfully.");

}

// ==========================================
// EDIT PROFILE FUNCTIONALITY
// ==========================================

const openEditProfile = document.getElementById("openEditProfile");
const profileModal = document.getElementById("profileModal");
const closeEditProfile = document.getElementById("closeEditProfile");
const cancelEditProfile = document.getElementById("cancelEditProfile");


// Open modal
if(openEditProfile){

    openEditProfile.addEventListener("click", function(){

        profileModal.style.display = "flex";

        loadEditProfile();

    });

}

// Close modal
function closeProfileModal(){

    profileModal.style.display = "none";

}


if(closeEditProfile){

    closeEditProfile.addEventListener("click", closeProfileModal);

}


if(cancelEditProfile){

    cancelEditProfile.addEventListener("click", closeProfileModal);

}

// Load user data into form

function loadEditProfile(){

    const user = JSON.parse(localStorage.getItem("silentSOSUser")) || {};


    document.getElementById("editName").value = user.name || "";

    document.getElementById("editEmail").value = user.email || "";

    document.getElementById("editPhone").value = user.phone || "";

    document.getElementById("editDob").value = user.dob || "";

    document.getElementById("editGender").value = user.gender || "";

    document.getElementById("editBlood").value = user.blood || "";

    document.getElementById("editAddress").value = user.address || "";

}

// Save profile

function saveProfile(){

    let user = JSON.parse(localStorage.getItem("silentSOSUsers")) || {};


    user.name = document.getElementById("editName").value;

    user.phone = document.getElementById("editPhone").value;

    user.dob = document.getElementById("editDob").value;

    user.gender = document.getElementById("editGender").value;

    user.blood = document.getElementById("editBlood").value;

    user.address = document.getElementById("editAddress").value;


    localStorage.setItem(
        "silentSOSUsers",
        JSON.stringify(user)
    );

    changePassword();

    alert("Profile Updated Successfully");


    closeProfileModal();

    location.reload();

}