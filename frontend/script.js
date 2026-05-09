const API = "http://localhost:5000/api/tasks";
const token = localStorage.getItem("token");

fetch(API, {
    headers: {
        "Content-Type": "application/json",
        "Authorization": token
    }
});
// LOAD TASKS
async function loadTasks() {
    const res = await fetch(API);
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

            <div class="actions">
                <button onclick="toggleTask('${task._id}', '${task.status}')">Toggle</button>
                <button onclick="deleteTask('${task._id}')">Delete</button>
            </div>
        `;

        container.appendChild(div);
    });
}

// ADD TASK
async function addTask() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("desc").value;
    const status = document.getElementById("status").value;

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, status })
    });

    document.getElementById("title").value = "";
    document.getElementById("desc").value = "";

    loadTasks();
}

// DELETE
async function deleteTask(id) {
    await fetch(`${API}/${id}`, {
        method: "DELETE"
    });

    loadTasks();
}

// TOGGLE STATUS
async function toggleTask(id, currentStatus) {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";

    await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
    });

    loadTasks();
}

loadTasks();