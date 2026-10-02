const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const taskCount = document.getElementById("taskCount");
const remainingText = document.getElementById("remainingText");
const clearCompleted = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("codeOrbitTasks")) || [];

let currentFilter = "all";


// Add Task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        taskInput.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    taskInput.value = "";
    taskInput.focus();

    renderTasks();
}


// Display Tasks
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }


    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }


        // Check button
        const checkButton = document.createElement("button");

        checkButton.className = "check";

        if (task.completed) {
            checkButton.classList.add("done");
            checkButton.textContent = "✓";
        }

        checkButton.addEventListener("click", () => {
            toggleTask(task.id);
        });


        // Task text
        const taskText = document.createElement("span");

        taskText.className = "task-text";
        taskText.textContent = task.text;


        // Delete button
        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";
        deleteButton.textContent = "×";
        deleteButton.setAttribute("aria-label", "Delete task");

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });


        li.appendChild(checkButton);
        li.appendChild(taskText);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });


    updateTaskInfo(filteredTasks);
}


// Complete / Uncomplete Task
function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    renderTasks();
}


// Delete Task
function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}


// Clear Completed Tasks
clearCompleted.addEventListener("click", () => {

    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();
});


// Filter Tasks
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});


// Save tasks in localStorage
function saveTasks() {

    localStorage.setItem(
        "codeOrbitTasks",
        JSON.stringify(tasks)
    );
}


// Update task counter
function updateTaskInfo(filteredTasks) {

    const remainingTasks = tasks.filter(
        task => !task.completed
    ).length;

    taskCount.textContent = tasks.length;

    remainingText.textContent =
        `${remainingTasks} ${remainingTasks === 1 ? "task" : "tasks"} remaining`;

    if (filteredTasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }
}


// Add task by button
addTaskBtn.addEventListener("click", addTask);


// Add task by pressing Enter
taskInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {
        addTask();
    }
});


// Initial display
renderTasks();