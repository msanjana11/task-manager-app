const API = "https://task-manager-app-hnuy.onrender.com/api";

// token
const token = localStorage.getItem("token");

// ================= LOAD TASKS =================
async function loadTasks() {
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
            <p>${task.status}</p>

            <button onclick="toggleTask('${task._id}', '${task.status}')">Toggle</button>
            <button onclick="deleteTask('${task._id}')">Delete</button>
        `;

        container.appendChild(div);
    });
}

// ================= ADD TASK =================
async function addTask() {
    const title = document.getElementById("title").value;
    const desc = document.getElementById("desc").value;
    const status = document.getElementById("status").value;

    await fetch(`${API}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({ title, description: desc, status })
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

// INIT
if (document.getElementById("taskList")) {
    loadTasks();
}