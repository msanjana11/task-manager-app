
console.log("TOKEN FROM STORAGE:", localStorage.getItem("token"));
const API = "https://task-manager-app-hnuy.onrender.com/api";

/* ================= TOKEN ================= */
function getToken() {
    return localStorage.getItem("token");
}

/* ================= REDIRECT IF NOT LOGGED IN ================= */
if (!getToken()) {
    alert("Please login first");
    window.location.href = "login.html";
}

/* ================= LOAD TASKS ================= */
async function loadTasks() {
    try {
        const token = getToken();

        const res = await fetch(`${API}/tasks`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const tasks = await res.json();

        const container = document.getElementById("taskList");
        container.innerHTML = "";

        tasks.forEach(task => {
            const div = document.createElement("div");
            div.className = `task ${task.status}`;

            div.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>Status: ${task.status}</p>

                <button onclick="toggleTask('${task._id}','${task.status}')">Toggle</button>
                <button onclick="deleteTask('${task._id}')">Delete</button>
            `;

            container.appendChild(div);
        });

    } catch (err) {
        console.log("LOAD ERROR:", err);
    }
}

/* ================= ADD TASK ================= */
async function addTask() {
    try {
        const token = getToken();

        if (!token) {
            alert("Session expired. Please login again");
            window.location.href = "login.html";
            return;
        }

        const title = document.getElementById("title").value;
        const desc = document.getElementById("desc").value;
        const status = document.getElementById("status").value;

        const res = await fetch(`${API}/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                description: desc,
                status
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Add failed");
            return;
        }

        document.getElementById("title").value = "";
        document.getElementById("desc").value = "";

        loadTasks();

    } catch (err) {
        console.log("ADD ERROR:", err);
    }
}

/* ================= DELETE TASK ================= */
async function deleteTask(id) {
    try {
        const token = getToken();

        const res = await fetch(`${API}/tasks/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Delete failed");
            return;
        }

        loadTasks();

    } catch (err) {
        console.log("DELETE ERROR:", err);
    }
}

/* ================= TOGGLE TASK ================= */
async function toggleTask(id, status) {
    try {
        const token = getToken();

        const newStatus = status === "pending" ? "completed" : "pending";

        await fetch(`${API}/tasks/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });

        loadTasks();

    } catch (err) {
        console.log("TOGGLE ERROR:", err);
    }
}

/* ================= INIT ================= */
loadTasks();

/* ================= MAKE FUNCTIONS GLOBAL ================= */
window.addTask = addTask;
window.deleteTask = deleteTask;
window.toggleTask = toggleTask;
window.loadTasks = loadTasks;