const API = "https://task-manager-app-hnuy.onrender.com/api";

// token
const token = localStorage.getItem("token");

// ================= LOGIN PROTECTION =================
if (!token && window.location.pathname.includes("task")) {
    window.location.href = "index.html";
}

// ================= LOAD TASKS =================
async function loadTasks() {
    try {
        const res = await fetch(`${API}/tasks`, {
            headers: {
                "Authorization": token
            }
        });

        const tasks = await res.json();

        const container = document.getElementById("taskList");
        container.innerHTML = "";

        tasks.forEach(task => {
            const div = document.createElement("div");

            div.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>Status: ${task.status}</p>

                <button onclick="toggleTask('${task._id}', '${task.status}')">Toggle</button>
                <button onclick="deleteTask('${task._id}')">Delete</button>
            `;

            container.appendChild(div);
        });

    } catch (err) {
        console.log("Error loading tasks", err);
    }
}

// ================= ADD TASK =================
async function addTask() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("desc").value;
    const status = document.getElementById("status").value;

    if (!title || !description) {
        alert("Fill all fields");
        return;
    }

    await fetch(`${API}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ title, description, status })
    });

    loadTasks();
}

// ================= DELETE =================
async function deleteTask(id) {
    await fetch(`${API}/tasks/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": token
        }
    });

    loadTasks();
}

// ================= TOGGLE =================
async function toggleTask(id, currentStatus) {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";

    await fetch(`${API}/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ status: newStatus })
    });

    loadTasks();
}

// ================= INIT =================
if (document.getElementById("taskList")) {
    loadTasks();
}