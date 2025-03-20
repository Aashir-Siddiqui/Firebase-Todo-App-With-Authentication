import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification, googleProvider, GoogleAuthProvider, signInWithPopup, db, doc, setDoc, collection, addDoc, getDocs, increment, onSnapshot, deleteDoc, updateDoc, serverTimestamp } from "./firebase.js";

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


let googleBtn = document.getElementById("googleBtn");
if (googleBtn) {
    googleBtn.addEventListener("click", () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log("Google Sign-In Success!");
                console.log("Token:", token);
                console.log("User:", user);
                Swal.fire({
                    title: "Google Login Successful!",
                    icon: "success",
                    text: `Welcome, ${user.email}!`,
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
                console.log("Google Sign-In Error:", errorCode, errorMessage);
                Swal.fire({
                    icon: "error",
                    title: "Google Sign-In Failed",
                    text: errorMessage,
                });
            });
    });
}

let todoList = document.getElementById('todoList');

let addTodo = document.getElementById('addTodo');
if (addTodo) {
    addTodo.addEventListener("click", async () => {
        let todo = document.getElementById("todo");

        if (!todo || !todo.value) {
            Swal.fire({
                icon: "error",
                title: "Todo Khali Hai",
                text: "Kuch toh likh bhai!",
            });
            return;
        }

        if (!auth.currentUser) {
            Swal.fire({
                icon: "error",
                title: "Login Kar Pehle",
                text: "Todo add karne ke liye login zaroori hai!",
            });
            return;
        }

        const ref = collection(db, "todos");
        try {
            await addDoc(ref, {
                todo: todo.value,
                uid: auth.currentUser.uid,
                createdAt: serverTimestamp()
            });
            console.log("Todo Added");
            Swal.fire({
                icon: "success",
                title: "Todo Add Ho Gaya!",
                text: "Naya todo list mein daal diya.",
            });
            todo.value = "";
        }
        catch (error) {
            console.log("Error adding todo:", error.message);
            Swal.fire({
                icon: "error",
                title: "Todo Add Nahi Hua",
                text: error.message,
            });
        }
    });
}

let getTodos = () => {
    onSnapshot(collection(db, "todos"), (snapshot) => {
        todoList.innerHTML = ""
        snapshot.docChanges().forEach((change) => {
            console.log("change", change.type)
        });
        snapshot.forEach((doc) => {
            let { todo, uid, createdAt } = doc.data();
            console.log("createdAt", new Date(createdAt).toDateString())
            if (auth.currentUser && uid === auth.currentUser.uid) {
                todoList.innerHTML += `
                        <li> 
                            ${todo} 
                            <button class="edit-btn" data-id="${doc.id}" data-todo="${todo}">Edit</button>
                            <button class="delete-btn" data-id="${doc.id}">Del</button>
                        </li>`;
            }
        });
        document.querySelectorAll('.edit-btn').forEach((btn) => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                const currentTodo = btn.getAttribute('data-todo');
                await editTodo(id, currentTodo);
            });
        });
        document.querySelectorAll('.delete-btn').forEach((btn) => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                await delTodo(id);
            });
        });
    });
}
getTodos()

let editTodo = async (id, currentTodo) => {
    const newTodo = prompt("Naya todo kya daalna hai?", currentTodo);
    if (!newTodo) return;

    try {
        await updateDoc(doc(db, "todos", id), {
            todo: newTodo,
            uid: auth.currentUser.uid,
            updatedAt: serverTimestamp()
        });
        console.log("Todo Updated");
        Swal.fire({
            icon: "success",
            title: "Todo Update Ho Gaya!",
            text: "List mein change kar diya.",
        });
    } catch (error) {
        console.log("Error updating todo:", error.message);
        Swal.fire({
            icon: "error",
            title: "Update Nahi Hua",
            text: error.message,
        });
    }
}

let delTodo = async (id) => {
    if (!auth.currentUser) {
        Swal.fire({
            icon: "error",
            title: "Login Kar Pehle",
            text: "Todo delete karne ke liye login zaroori hai!",
        });
        return;
    }
    try {
        await deleteDoc(doc(db, "todos", id));
        console.log("Todo Deleted");
        Swal.fire({
            icon: "success",
            title: "Todo Delete Ho Gaya!",
            text: "List se hata diya.",
        });
    } catch (error) {
        console.log("Error deleting todo:", error.message);
        Swal.fire({
            icon: "error",
            title: "Delete Nahi Hua",
            text: error.message,
        });
    }
}

