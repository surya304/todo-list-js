// Function to set item in local storage
const setItemInLocalStorage = (key, value) => {
    return localStorage.setItem(key, value);
}

// Function to get item from local storage
const getItemFromLocalStorage = (key) => {
    return localStorage.getItem(key);
}

// Function to remove item from local storage
const removeItemFromLocalStorage = (key) => {
    return localStorage.removeItem(key);
}

// Function to generate unique number
const generateUniqNumber = (array, key) => {
    // Function to generate random number between min and max
    const randomNumBetween = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    const random = randomNumBetween(1_000, 9_999);
    const item = array.find(item => item[key] === random);
    if (!item) return random;
    return generateUniqNumber(array, key);
}

// Class to define a task
class Tasks {
    title;
    taskInfo;
    date;
    status;
    priority;
    category;
    id;

    constructor(task, tasksArray = []) {
        const { title, taskInfo, date, priority, category, status } = task

        this.date = date;
        this.taskInfo = taskInfo;
        this.title = title;
        this.priority = priority;
        this.category = category;
        this.status = status;
        this.id = generateUniqNumber(tasksArray, 'id')
    }
}

// DOM elements
const NEW_TITLE = document.querySelector('#newTaskTitle');
const NEW_DATE = document.querySelector('#newdate');
const NEW_TASK_INFO = document.querySelector('#newTaskInfo');
const priority1 = document.querySelector('#priority1');
const category1 = document.querySelector('#category1');
const NEW_ADD_BTN = document.querySelector('#addNewTaskBtn');
const task_error_name = document.querySelector('#task-error-name');
const task_error_description = document.querySelector('#task-error-description');
const TASKLIST = document.querySelector('#taskList');
const FILTER_BTN = document.querySelector('#Filter');
const ERROR_DIV = document.querySelector('#errorDiv');
const CLEAR_BTN = document.querySelector('#ClearAll');
const H3 = document.querySelector('#h3');
const SEARCH = document.querySelector('#searchTasks');
const SEARCH_SPAN = document.querySelector('#spanForSearch');

// Function to add task to local storage
const addTaskToLocal = tasks => {
    try {
        let newTasksArray = [...tasks];
        const task = new Tasks({
            title: NEW_TITLE.value,
            taskInfo: NEW_TASK_INFO.value,
            date: NEW_DATE.value,
            priority: priority1.value,
            category: category1.value,
            status: false,
        }, newTasksArray)

        newTasksArray.push(task);

        setItemInLocalStorage('tasks', JSON.stringify(newTasksArray));

        return newTasksArray;
    }
    catch (e) {
        console.log(e);
        return [];
    }
}

// Class to manage tasks
class TasksManeget {
    // Method to render tasks
    renderTasks = (tasks) => {
        TASKLIST.innerHTML = '';

        if (tasks.length > 0) {
            tasks.reverse().forEach(task => {

                if (task.category == 'Select Category') {
                    task.category = 'None'
                }

                if (task.priority == 'Select Priority Level') {
                    task.priority = 'None'
                }

                document.getElementById('taskList').innerHTML += ` <div class="card-body" >
            <h5 class="card-title">Title : ${task.title}</h5>
            <p class="card-text">Description : ${task.taskInfo}</p>
            <p class="card-text">Date : ${task.date}</p>
            <p class="card-text">Priority : ${task.priority}</p>
            <p class="card-text">Category : ${task.category}</p>
            <a href="#" class="btn btn-success task-EditBtn" data-id=${task.id} onclick="editTask(${task.id})" >Edit </a>
            <a class="btn btn-danger " data-id=${task.id} onclick="deleteTask(${task.id})">Delete</a>

          </div>
     `;
            });
        }

        if (tasks.length == 0) {
            H3.textContent = ` you have no tasks`
        } else {
            H3.textContent = `You have ${tasks.length} tasks`
        }
    }

    // Method to handle event for new button
    eventForNewBtn = () =>
        NEW_ADD_BTN.addEventListener("click", (e) => {

            if (e.target.dataset.type == 'edit') {
                editData(e.target.dataset.id);
                return;
            }

            const tasksManeget = new TasksManeget();

            if (NEW_TITLE.value == '') {
                task_error_name.classList.remove('hidden');
            } else {
                if (!task_error_name.classList.contains('hidden')) {
                    task_error_name.classList.add('hidden');
                }
            }

            if (NEW_TASK_INFO.value == '') {
                task_error_description.classList.remove('hidden');
            }
            else {
                if (!task_error_description.classList.contains('hidden')) {
                    task_error_description.classList.add('hidden');
                }
            }

            if (NEW_TITLE.value !== '' && NEW_TASK_INFO.value !== '') {
                let updateTasks = JSON.parse(getItemFromLocalStorage('tasks'));

                if (updateTasks == null) {
                    updateTasks = []
                }

                addTaskToLocal(updateTasks);
                const updatedTasks = addTaskToLocal(updateTasks);
                tasksManeget.renderTasks(updatedTasks);

                clearfn();
            }
        });

    // Method to handle event for filter
    eventForFilter = () => {
        FILTER_BTN.addEventListener("click", () => {
            const tasksManeget = new TasksManeget();
            let updateTasks = JSON.parse(getItemFromLocalStorage('tasks'));
            const AfterFilterTasksArray = [...updateTasks];
            const taskObjectForFilter = AfterFilterTasksArray.filter(task => task.status == status);
            setItemInLocalStorage('tasks', JSON.stringify(taskObjectForFilter));
            tasksManeget.renderTasks(taskObjectForFilter);
        });
    }


       // Method to handle event for search

    eventForSearch = () => {
        SEARCH.addEventListener("input", () => {

            let array = JSON.parse(getItemFromLocalStorage('tasks'));

            const tasksManeget = new TasksManeget();
            const ObjectForSearch = array.filter(task => task.title.toLowerCase().includes(SEARCH.value.toLowerCase()) || task.taskInfo.toLowerCase().includes(SEARCH.value.toLowerCase()) || task.priority.toLowerCase().includes(SEARCH.value.toLowerCase()) || task.category.toLowerCase().includes(SEARCH.value.toLowerCase()));

            if (ObjectForSearch.length >= 1) {
                SEARCH_SPAN.textContent = "";
                tasksManeget.renderTasks(ObjectForSearch)
            } else if (SEARCH.value === '') {
                SEARCH_SPAN.textContent = "";
                tasksManeget.renderTasks(array)
            } else if (ObjectForSearch.length < 1) {
                TASKLIST.innerHTML = "";
                document.getElementById('taskList').innerHTML += ` <h1 class="text-center"> Sorry!! There Are No Tasks with this Field </h1> `;

            }

        })
    }

}

// Create a new instance of TasksManeget
const tasksManeget = new TasksManeget();

// Try to get tasks from local storage and parse them
let updateTasks = JSON.parse(getItemFromLocalStorage('tasks'));

// If there are no tasks, display a message in the 'taskList' element
if (!updateTasks) {
    document.getElementById('taskList').innerHTML += ` <h1 class="text-center">Please Enter some Tasks </h1> `;
} else {
    // If tasks exist, render them using tasksManeget
    tasksManeget.renderTasks(updateTasks);
}

// Call the eventForSearch function in tasksManeget
tasksManeget.eventForSearch();

// Define a function for editing a task
function editTask(id) {
    // Parse tasks from local storage
    let updateTasks = JSON.parse(getItemFromLocalStorage('tasks'));
    // Create a copy of the tasks array
    const AfterDoneTasksArray = [...updateTasks];
    // Filter the task to be edited by its ID
    const taskObjectForDone = AfterDoneTasksArray.filter(task => task.id == id);
    // Set form input values to the task properties
    NEW_TITLE.value = taskObjectForDone[0].title;
    NEW_TASK_INFO.value = taskObjectForDone[0].taskInfo;
    NEW_DATE.value = taskObjectForDone[0].date;
    priority1.value = taskObjectForDone[0].priority;
    category1.value = taskObjectForDone[0].category;
    // Update the button label and attributes for editing
    document.getElementById("addNewTaskBtn").value = "Edit Task";
    document.getElementById("addNewTaskBtn").setAttribute("data-id", taskObjectForDone[0].id);
    document.getElementById("addNewTaskBtn").setAttribute("data-type", "edit");
}

// Call the eventForNewBtn function in tasksManeget
tasksManeget.eventForNewBtn();

// Define a function for editing task data
function editData(id) {
    // Parse tasks from local storage
    let finalid = parseInt(id);
    let updateTasksForRender = JSON.parse(getItemFromLocalStorage('tasks'));
    const tasksManeget = new TasksManeget();
    // Create a copy of the tasks array
    const AfterRemoveTasksArray = [...updateTasksForRender];
    // Update the task with the specified ID
    AfterRemoveTasksArray.forEach(task => {
        if (task.id == finalid) {
            task.title = NEW_TITLE.value;
            task.taskInfo = NEW_TASK_INFO.value;
            task.date = NEW_DATE.value;
            task.priority = priority1.value;
            task.category = category1.value;
            task.status = false;
        }
    })
    // Store the updated tasks in local storage
    setItemInLocalStorage('tasks', JSON.stringify(AfterRemoveTasksArray));
    // Render the updated tasks
    tasksManeget.renderTasks(AfterRemoveTasksArray)
    // Clear the form inputs
    clearfn();
}

// Add a click event listener to the CLEAR_BTN element
CLEAR_BTN.addEventListener("click", () => {
    clearAllTasks();
});

// Define a function to clear all tasks
function clearAllTasks() {
    clearfn();
}

// Define a function to clear the form inputs and reset button attributes
function clearfn() {
    NEW_TITLE.value = '';
    NEW_TASK_INFO.value = '';
    NEW_DATE.value = '';
    priority1.value = 'Select Priority Level';
    category1.value = 'Select Category';
    document.getElementById("addNewTaskBtn").value = "Add New Task";
    document.getElementById("addNewTaskBtn").removeAttribute("data-id");
    document.getElementById("addNewTaskBtn").removeAttribute("data-type");
    task_error_name.classList.add('hidden');
    task_error_description.classList.add('hidden');
    SEARCH.value = '';
}

// Define a function to delete a task by its ID
const deleteTask = (id) => {
    let updateTasksForRender = JSON.parse(getItemFromLocalStorage('tasks'));
    const tasksManeget = new TasksManeget();
    // Create a copy of the tasks array without the task to be deleted
    const AfterRemoveTasksArray = [...updateTasksForRender];
    const taskObjectForRemove = AfterRemoveTasksArray.filter(task => task.id !== parseInt(id));
    // Store the updated tasks in local storage
    setItemInLocalStorage('tasks', JSON.stringify(taskObjectForRemove));
    // Render the updated tasks
    tasksManeget.renderTasks(taskObjectForRemove)
}

