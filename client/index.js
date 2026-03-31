
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

function createTaskHTML(name) {
    return `
        <input type="checkbox" class="checktask">
        <span class="task_name">${name}</span>
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
        newtask.setAttribute("id", data.id);
        newtask.innerHTML = `
        <input type="checkbox" class="checktask">
        <span class="task_name">${data.taskName}</span>
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
            if (reqRemoveTask(newtask)) newtask.remove();
            console.log("Removed Successfuly..");
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

async function loadTasks() {
    const taskDB = fetch(`${BaseURL}/tasks`);
    const tasksObj = (await taskDB).json();


    for (const task of await tasksObj){
        try{
            let newtask = document.createElement("div");
            newtask.classList.add("task");
            newtask.setAttribute("id", task.id);
            newtask.innerHTML = `
            <input type="checkbox" class="checktask">
            <span class="task_name">${task.taskName}</span>
            <button type="button" class="remove"></button>
            `;
            tasks.appendChild(newtask);
            input.value = "";
            updateTaskCounter();

            // remove
            newtask.querySelector(".remove").addEventListener("click", (e) => {
                e.preventDefault();
                if (reqRemoveTask(newtask)) newtask.remove();
                console.log("Removed Successfuly..");
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
        }
        catch(e){
            console.log("Error: ", e);
        }
        
    }
}

async function reqRemoveTask(task) {
    try{
        const res = fetch(
            `${BaseURL}/deleteTask/${task.getAttribute("id")}`,
        {
            method: "DELETE"
        });
        if (!res.ok) return false;

        return true;
    }
    catch(e){
        console.error(e);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    console.log("Js caricato..");

    loadTasks();

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

    clean.addEventListener("click", (e) => {
        e.preventDefault();
        const allTasks = tasks.querySelectorAll(".task");
        console.log(allTasks);
        allTasks.forEach(task => {
            if (reqRemoveTask(task)) {
                task.remove();
            }
        });
        updateTaskCounter();
    });
    
});