// import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "./firebase.js";

// let signupBtn = document.getElementById("signupBtn")

// signupBtn.addEventListener("click", () => {
//     let email = document.getElementById("su-email")
//     let password = document.getElementById("su-password")
//     createUserWithEmailAndPassword(auth, email.value, password.value)
//         .then((userCredential) => {
//             const user = userCredential.user;
//             console.log(user.email)
//         })
//         .catch((error) => {
//             const errorCode = error.code;
//             const errorMessage = error.message;
//             console.log(errorCode, errorMessage)
//         });
// })

// let signinBtn = document.getElementById("signinBtn")
// if (signinBtn) {
//     signinBtn.addEventListener("click", () => {
//         let email = document.getElementById("si-email")
//         let password = document.getElementById("si-password")
//         signInWithEmailAndPassword(auth, email.value, password.value)
//             .then((userCredential) => {
//                 const user = userCredential.user;
//                 Swal.fire({
//                     title: "Login Successfully",
//                     icon: "success"
//                 });
//             })
//             .catch((error) => {
//                 const errorCode = error.code;
//                 const errorMessage = error.message;
//                 Swal.fire({
//                     icon: "error",
//                     title: "Wrong Credentials",
//                     text: "Something went wrong!",
//                     footer: '<a href="./index.html">Sing up</a>'
//                 });
//             });
//     })
// }


import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "./firebase.js";

const signupBtn = document.getElementById("signupBtn");
if (signupBtn) {
    signupBtn.addEventListener("click", () => {
        const email = document.getElementById("su-email");
        const password = document.getElementById("su-password");

        if (!email || !password || !email.value || !password.value) {
            console.log("Please fill in both email and password fields.");
            Swal.fire({
                icon: "error",
                title: "Missing Fields",
                text: "Please enter email and password!",
            });
            return;
        }

        createUserWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("Signed up successfully:", user.email);
                Swal.fire({
                    title: "Signup Successful",
                    icon: "success",
                    text: `Welcome, ${user.email}!`,
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                Swal.fire({
                    icon: "error",
                    title: "Signup Failed",
                    text: errorMessage,
                });
            });
    });
}

const signinBtn = document.getElementById("signinBtn");
if (signinBtn) {
    signinBtn.addEventListener("click", () => {
        const email = document.getElementById("si-email");
        const password = document.getElementById("si-password");

        if (!email || !password || !email.value || !password.value) {
            Swal.fire({
                icon: "error",
                title: "Missing Fields",
                text: "Please enter email and password!",
            });
            return;
        }

        signInWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                const user = userCredential.user;
                Swal.fire({
                    title: "Login Successful",
                    icon: "success",
                    text: `Welcome back, ${user.email}!`,
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                Swal.fire({
                    icon: "error",
                    title: "Wrong Credentials",
                    text: errorMessage,
                    footer: '<a href="./index.html">Sign up</a>',
                });
            });
    });
}