import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification, googleProvider, GoogleAuthProvider, signInWithPopup } from "./firebase.js";

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

        if (password.value.length < 6) {
            Swal.fire({
                icon: "error",
                title: "Weak Password",
                text: `Password must be at least 6 characters long! Current length: ${password.value.length}`,
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
                }).then((result) => {
                    if (result.isConfirmed) {
                        setTimeout(() => {
                            window.location.href = '/login.html';
                        }, 1000);
                    }
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

        if (password.value.length < 6) {
            Swal.fire({
                icon: "error",
                title: "Weak Password",
                text: `Password must be at least 6 characters long! Current length: ${password.value.length}`,
            });
            return;
        }

        signInWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("Signed in successfully:", user.email);
                Swal.fire({
                    title: "Login Successful",
                    icon: "success",
                    text: `Welcome back, ${user.email}!`,
                }).then((result) => {
                    if (result.isConfirmed) {
                        setTimeout(() => {
                            window.location.href = '/welcome.html';
                        }, 1000);
                    }
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

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        console.log("user", user);
    } else {
        console.log("user does not exist");
    }
});

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        if (!auth.currentUser) {
            Swal.fire({
                title: "No User Signed In!",
                text: "You need to sign in first to logout.",
                icon: "warning"
            });
            return;
        }
        signOut(auth)
            .then(() => {
                console.log("Logout successful");
                Swal.fire({
                    title: "Logout Successful!",
                    icon: "success"
                }).then((result) => {
                    if (result.isConfirmed) {
                        setTimeout(() => {
                            window.location.href = '/login.html';
                        }, 1000);
                    }
                });
            })
            .catch((error) => {
                console.log("Error during logout:", error);
                Swal.fire({
                    title: "Logout Failed!",
                    text: error.message,
                    icon: "error"
                });
            })
    });
}


let verifyEmail = document.getElementById("verifyEmail")

if (verifyEmail) {
    verifyEmail.addEventListener("click", () => {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                console.log("sent")
            });
    })
}


let googleBtn = document.getElementById("googleBtn")
if (googleBtn) {
    googleBtn.addEventListener("click", () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log("token", token)
                console.log("user", user)
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log("email", email)
                console.log("credential", credential)
            });
    })
}