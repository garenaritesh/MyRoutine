// Get DOM Elements
const routineList = document.getElementById("routine-list");
const completedCountDisplay = document.getElementById("completed-count");
const uncompletedCountDisplay = document.getElementById("uncompleted-count");
const streakCountDisplay = document.getElementById("streak-count");
const messageDisplay = document.getElementById("message");

// Variables to track tasks
let completedCount = 0;
let totalTasks = routineList.children.length;

// Initialize App
function init() {
    checkNewDay();
    loadTasks();
    updateTaskCounts();
}

// Check if it's a new day and refresh tasks
function checkNewDay() {
    const lastUpdatedDate = localStorage.getItem("lastUpdatedDate");
    const currentDate = new Date().toDateString();

    if (lastUpdatedDate !== currentDate) {
        if (completedCount === totalTasks) {
            incrementStreak();
        } else {
            resetStreak();
        }
        localStorage.clear();
        localStorage.setItem("lastUpdatedDate", currentDate);
        completedCount = 0;
        messageDisplay.textContent = "";
    }
}

// Increment streak and show motivational messages
function incrementStreak() {
    let streak = parseInt(localStorage.getItem("streakCount")) || 0;
    streak++;
    localStorage.setItem("streakCount", streak);
    streakCountDisplay.textContent = streak;

    if (streak === 30 || streak === 50) {
        const motivationalMessages = [
            "Amazing! Keep up the great work!",
            "You're unstoppable! Keep the streak alive!",
            "You're an inspiration! Stay consistent!",
        ];
        messageDisplay.textContent =
            motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    }
}

// Reset streak and show regret messages
function resetStreak() {
    localStorage.setItem("streakCount", 0);
    streakCountDisplay.textContent = 0;
    const regretMessages = [
        "Oh no! Try again tomorrow!",
        "Don't give up! Tomorrow is a new day!",
        "Failure is the stepping stone to success!",
    ];
    messageDisplay.textContent =
        regretMessages[Math.floor(Math.random() * regretMessages.length)];
}

// Load Tasks from Local Storage
function loadTasks() {
    const storedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
    storedTasks.forEach((task) => {
        markTaskCompleted(task.taskName, task.time);
    });
}

// Mark Task as Completed
function markTaskCompleted(taskName, time = null) {
    const listItems = Array.from(routineList.children);
    listItems.forEach((item) => {
        if (item.textContent.includes(taskName)) {
            const button = item.querySelector(".complete-btn");
            button.textContent = `Completed at ${time || new Date().toLocaleTimeString()}`;
            button.classList.add("completed");
            button.disabled = true;
            completedCount++;
        }
    });
}

// Complete Task
routineList.addEventListener("click", (e) => {
    if (e.target.classList.contains("complete-btn") && !e.target.classList.contains("completed")) {
        const taskName = e.target.parentElement.textContent.trim();
        const time = new Date().toLocaleTimeString();
        e.target.textContent = `Completed at ${time}`;
        e.target.classList.add("completed");
        e.target.disabled = true;

        saveTaskToLocalStorage(taskName, time);
        completedCount++;
        updateTaskCounts();
    }
});

// Save Task to Local Storage
function saveTaskToLocalStorage(taskName, time) {
    const tasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
    tasks.push({ taskName, time });
    localStorage.setItem("completedTasks", JSON.stringify(tasks));
}

// Update Task Counts
function updateTaskCounts() {
    completedCountDisplay.textContent = completedCount;
    uncompletedCountDisplay.textContent = totalTasks - completedCount;
}

// Initialize the App
init();
