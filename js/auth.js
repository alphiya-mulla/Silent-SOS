/* ==========================================
   GLOBAL DARK MODE
========================================== */

const currentUser = localStorage.getItem("currentUser");

const savedSettings = JSON.parse(
    localStorage.getItem(`silentSOSSettings_${currentUser}`)
);

if (savedSettings && savedSettings.darkMode) {
    document.body.classList.add("dark-mode");
}

// =======================================
// Show / Hide Password
// =======================================
const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

if(togglePassword && password){

togglePassword.addEventListener("click",()=>{

if(password.type==="password"){

password.type="text";

togglePassword.innerHTML='<i class="fa-solid fa-eye-slash"></i>';

}else{

password.type="password";

togglePassword.innerHTML='<i class="fa-solid fa-eye"></i>';

}

});

}

// =======================================
// Login Form
// =======================================

const form=document.getElementById("loginForm");

if(form){

form.addEventListener("submit",(e)=>{

e.preventDefault();

const email=document.getElementById("email").value.trim();

const pass=document.getElementById("password").value.trim();

if(email==="" || pass===""){

showToast("Please fill all fields!","#DC2626");

return;

}

const btn=document.querySelector(".login-btn");

btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';

btn.disabled=true;

const users = JSON.parse(localStorage.getItem("silentSOSUsers")) || [];

if (users.length === 0) {

    showToast("Please register first!", "#DC2626");

    setTimeout(() => {
        window.location.href = "register.html";
    }, 1800);

    btn.innerHTML = "Login";
    btn.disabled = false;
    return;
}

// Find the matching user
const user = users.find(
    u => u.email === email && u.password === pass
);

if (user) {

    localStorage.setItem("currentUser", user.email);

    showToast("Login Successful! Redirecting...", "#16A34A");

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 1800);

} else {

    showToast("Invalid Email or Password!", "#DC2626");

    btn.innerHTML = "Login";
    btn.disabled = false;
}

});
}



// =======================================
// Toast Function
// =======================================

function showToast(message,color){

const toast=document.getElementById("toast");

const text=document.getElementById("toastMessage");

toast.style.background=color;

text.innerText=message;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},3000);

}

/* ==========================================
   REGISTER PAGE
========================================== */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const emergencyName = document.getElementById("emergencyName").value.trim();
        const emergencyPhone = document.getElementById("emergencyPhone").value.trim();
        const relationship = document.getElementById("relationship").value;

        if (password !== confirmPassword) {

            alert("Passwords do not match!");

            return;

        }

        const user = {

            fullName,
            email,
            phone,
            password,
            emergencyName,
            emergencyPhone,
            relationship

        };

        let users=JSON.parse(localStorage.getItem("silentSOSUsers")) || [];

        const exists=users.find(u => u.email === email);

        if(exists){
            alert("Email already registered!");
            return;
        }

        users.push(user);

        localStorage.setItem("silentSOSUsers", JSON.stringify(users));

        alert("Registration Successful!");

        window.location.href = "login.html";

    });

}