const API = "https://task-manager-app-hnuy.onrender.com/api";

const token = localStorage.getItem("token");

// LOAD
async function loadTasks() {
    const res = await fetch(`${API}/tasks`, {
        headers: { "Authorization": token }
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
}

// ADD
async function addTask() {
    await fetch(`${API}/tasks`, {
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":token
        },
        body:JSON.stringify({
            title: title.value,
            description: desc.value,
            status: status.value
        })
    });

    loadTasks();
}

// DELETE
async function deleteTask(id){
    await fetch(`${API}/tasks/${id}`,{
        method:"DELETE",
        headers:{ "Authorization":token }
    });

    loadTasks();
}

// TOGGLE
async function toggleTask(id,status){
    const newStatus = status==="pending"?"completed":"pending";

    await fetch(`${API}/tasks/${id}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
            "Authorization":token
        },
        body:JSON.stringify({status:newStatus})
    });

    loadTasks();
}

loadTasks();