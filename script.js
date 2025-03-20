import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification, googleProvider, GoogleAuthProvider, signInWithPopup, db, doc, collection, addDoc, onSnapshot, deleteDoc, updateDoc, serverTimestamp } from "./firebase.js";

const showError = (title, text) => Swal.fire({ icon: "error", title, text });
const showSuccess = (title, text) => Swal.fire({ icon: "success", title, text });
const showWarning = (title, text) => Swal.fire({ icon: "warning", title, text });

const signupBtn = document.getElementById("signupBtn");
if (signupBtn) {
    signupBtn.addEventListener("click", () => {
        const email = document.getElementById("su-email");
        const password = document.getElementById("su-password");

        if (!email || !password || !email.value || !password.value) {
            return showError("Missing Fields", "Please enter email and password!")
        }

        if (password.value.length < 6) {
            return showError("Weak Password", `Password must be at least 6 characters long! Current length: ${password.value.length}`)
        }

        createUserWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                const user = userCredential.user;
                showSuccess("Signup Successful", `Welcome, ${user.email}!`)
                    .then((result) => {
                        if (result.isConfirmed) { setTimeout(() => { window.location.href = '/login.html'; }, 1000); }
                    });
            })
            .catch((error) => {
                showError("Signup Failed", error.message);
            });
    });
}

const signinBtn = document.getElementById("signinBtn");
if (signinBtn) {
    signinBtn.addEventListener("click", () => {
        const email = document.getElementById("si-email");
        const password = document.getElementById("si-password");

        if (!email || !password || !email.value || !password.value) {
            return showError("Missing Fields", "Please enter email and password!")
        }

        if (password.value.length < 6) {
            return showError("Weak Password", `Password must be at least 6 characters long! Current length: ${password.value.length}`)
        }

        signInWithEmailAndPassword(auth, email.value, password.value)
            .then((userCredential) => {
                const user = userCredential.user;
                showSuccess("Login Successful", `Welcome back, ${user.email}!`)
                    .then((result) => {
                        if (result.isConfirmed) { setTimeout(() => { window.location.href = '/welcome.html'; }, 1000); }
                    });

            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Wrong Credentials",
                    text: errorMessage,
                    footer: '<a href="./index.html">Sign up</a>',
                });
            });
    });
}


const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        if (!auth.currentUser) {
            return showWarning("No User Signed In!", "You need to sign in first to logout.")
        }
        signOut(auth)
            .then(() => {
                showSuccess("Logout Successful")
                    .then((result) => {
                        if (result.isConfirmed) { setTimeout(() => { window.location.href = '/login.html' }, 1000) }
                    });
            })
            .catch((error) => {
                showError("Logout Failed", error.message);
            })
    });
}


const verifyEmail = document.getElementById("verifyEmail")
if (verifyEmail) {
    verifyEmail.addEventListener("click", () => {
        if (!auth.currentUser) return showError("No User");
        sendEmailVerification(auth.currentUser)
            .then(() => {
                showSuccess("Verification Sent", "Check email");
            })
            .catch((error) => {
                showError("Verification Failed", error.message);
            })
    })
}


const googleBtn = document.getElementById("googleBtn");
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
                    if (result.isConfirmed) { setTimeout(() => { window.location.href = '/welcome.html' }, 1000) }
                });
            })
            .catch((error) => {
                showError("Google Sign-In Failed", error.message);
            });
    });
}


const todoList = document.getElementById('todoList');

const addTodo = document.getElementById('addTodo');
if (addTodo) {
    addTodo.addEventListener("click", async () => {

        const todo = document.getElementById("todo");

        if (!todo || !todo.value) return showError("Todo is empty", "Write something!");

        if (!auth.currentUser) { return showError("Log in first", "Login is required to add a todo!") }

        const ref = collection(db, "todos");
        try {
            await addDoc(ref, {
                todo: todo.value,
                uid: auth.currentUser.uid,
                createdAt: serverTimestamp()
            });
            todo.value = "";
        }
        catch (error) {
            showError("Todo is not added", error.message)
        }
    });
}


const getTodos = () => {
    onSnapshot(collection(db, "todos"), (snapshot) => {
        todoList.innerHTML = "";
        let todos = [];
        snapshot.forEach((doc) => {
            let { todo, uid, createdAt } = doc.data();
            if (auth.currentUser && uid === auth.currentUser.uid) {
                todos.push({ id: doc.id, todo, createdAt });
            }
        });
        todos.sort((a, b) => b.createdAt - a.createdAt);
        todos.forEach(({ id, todo, createdAt }) => {
            todoList.innerHTML += `
            <div><span class="timestamp">${new Date(createdAt.toDate()).toLocaleString()}</span></div>
                <li>
                    <span>${todo}</span>
                    <button class="edit-btn" data-id="${id}" data-todo="${todo}">Edit</button>
                    <button class="delete-btn" data-id="${id}">Del</button>
                </li>`;
        });

        document.querySelectorAll('.edit-btn').forEach(btn => btn.removeEventListener('click', editTodo));
        document.querySelectorAll('.delete-btn').forEach(btn => btn.removeEventListener('click', delTodo));

        document.querySelectorAll('.edit-btn').forEach((btn) => {
            btn.addEventListener('click', () => editTodo(btn.getAttribute('data-id'), btn.getAttribute('data-todo')));
        });
        document.querySelectorAll('.delete-btn').forEach((btn) => {
            btn.addEventListener('click', () => delTodo(btn.getAttribute('data-id')));
        });
    });
}
getTodos()


const editTodo = async (id, currentTodo) => {
    Swal.fire({
        title: "Edit Todo",
        input: "text",
        inputValue: currentTodo,
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) return "Write something!";
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await updateDoc(doc(db, "todos", id), {
                    todo: result.value,
                    uid: auth.currentUser.uid,
                    updatedAt: serverTimestamp()
                });
                showSuccess("Todo Updated", "The list has changed!");
            } catch (error) {
                showError("Update Nahi Hua", error.message);
            }
        }
    });
}


const delTodo = async (id) => {
    if (!auth.currentUser) { return showError("Log in first", "Login is required to delete a todo!") }
    try {
        await deleteDoc(doc(db, "todos", id));
        showSuccess("Todo Deleted", "Removed from the list");
    } catch (error) {
        showError("Not deleted", error.message);
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User logged in:", user);
        if (window.location.pathname === "/welcome.html") {
            getTodos();
        }
    } else {
        console.log("User does not exist");
    }
});