
// server URL
const BaseURL = "http://localhost:5000/taskManager/api";

// input field
const input = document.querySelector("#taskInput");
// button
const addTask = document.querySelector("#addTask");
const clean = document.querySelector("#clean");
// tasks list div
const tasks = document.querySelector(".tasks");

// counter
let taskCounter = 0;

class Task {
    constructor(name) {
        this.id = 0;
        this.taskName = name;
        this.isChecked = false;
    }
}

function createTaskHTML(id, name) {
    return `
        <input type="checkbox" class="checktask">
        <span class="task_name" id="${id}">${name}</span>
        <button type="button" class="remove">Remove</button>
    `;
}

function updateTaskCounter() {
    let taskCount = document.getElementById("taskCount");
    let taskDone = document.getElementById("taskDone");
    let taskRemaining = document.getElementById("taskRemaining");
    let allTasks = document.querySelectorAll(".task");
    let doneTasks = document.querySelectorAll(".task .checktask:checked");

    taskCount.textContent = allTasks.length;
    taskDone.textContent = doneTasks.length;
    taskRemaining.textContent = allTasks.length - doneTasks.length;
}

function changeTaskStatus(task) {
    if (task.querySelector(".checktask").checked) {
        task.style.color ="#6cacff";
        task.style.backgroundColor = "rgb(215, 251, 138)";
        task.style.borderColor = "rgb(210, 255, 113)";
    }else {
        task.style.color = "#1673ed";
        task.style.backgroundColor = "rgb(241, 241, 241)";
        task.style.borderColor = "#1673ed";
    }
}

function addNewTask(){
    if (input.value.trim() === "") {
        alert("Please enter a task.");
        return;
    }
    
    console.log("Clickato su addTask");
    // Send post req to the server
    // with taskName and checked -> ret id, taskName, isChecked
    fetch(`${BaseURL}/addTask`, {
        method: "POST",
        headers: {
            // Corretto: Content senza la 's'
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({
            taskName: input.value,
            isChecked: false
        })
    })
    .then(res => {
        if (!res.ok) {
            // Se il server risponde con un errore (es. 400), lo catturiamo qui
            throw new Error("Errore durante l'aggiunta del task");
        }
        return res.json();
    })
    .then(data => {
        console.log("Task salvato con successo:", data);
        let newtask = document.createElement("div");
        newtask.classList.add("task");

        newtask.innerHTML = `
        <input type="checkbox" class="checktask">
        <span class="task_name" id="${data.id}">${data.taskName}</span>
        <button type="button" class="remove"></button>
        `;

        console.log("Prima di aggiungere la chiled");
        tasks.appendChild(newtask);
        console.log("Dopo di aggiungere la chiled");
        input.value = "";
        updateTaskCounter();

        // remove
        newtask.querySelector(".remove").addEventListener("click", (e) => {
            e.preventDefault();
            newtask.remove();
            updateTaskCounter();
        });

        // click su task
        newtask.addEventListener("click", (e) => {
            if (e.target.classList.contains("remove")) return;

            const checkbox = newtask.querySelector(".checktask");
            checkbox.checked = !checkbox.checked;

            changeTaskStatus(newtask);
            updateTaskCounter();
        });

        // checkbox
        newtask.querySelector(".checktask").addEventListener("click", (e) => {
            e.stopPropagation();
            changeTaskStatus(newtask);
            updateTaskCounter();
        });
    })
    .catch(error => {
        console.log("errore: ", error);
        //console.error("Si è verificato un problema:", error);
    });
}

function removeAllTasks() {
    if (taskCounter === 0) return;
    clean.addEventListener("click", (e) => {
        e.preventDefault();

        document.querySelectorAll(".task").forEach(task => {
            task.remove();
        });

        updateTaskCounter();
    });
}


document.addEventListener("DOMContentLoaded", () => {
    console.log("Js caricato..");
    // on click add task
    addTask.addEventListener("click", (e) => {
        e.preventDefault(); // <--- FONDAMENTALE
        e.stopPropagation(); // <--- AGGIUNGI QUESTO
        console.log("cliccato");
        addNewTask();
    });
    // on enter add task
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            addNewTask();
        }
    });

    window.addEventListener("beforeunload", () => {
        console.log("REFRESH!!!");
    });

    //removeAllTasks();
});