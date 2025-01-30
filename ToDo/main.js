// const tasks = [
//     {
//         id: 1,
//         name: 'Task 1',
//         completed: false
//     },
//     {
//         id: 2,
//         name: 'Task 2',
//         completed: true
//     }
// ];
// let lastTaskId = 2;

const ACCESS_TOKEN = "pcQp4GgUZrSudbS5fb0GyShn3U8Yayfu";
const API_BASE_URL = "https://demo2.z-bit.ee";
const USER_NAME = "KalaRasmus"

async function apiRequest(endpoint, method = 'GET', data = null) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
    };
    
    const options = { method, headers };
    if (data) {
        options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return response.json();
}

// function fetchTasks(){
//     return apiRequest('/tasks');
// }

async function fetchTasks() {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + ACCESS_TOKEN
        }
    });

    return response.json();
}

// function createTaskOnServer(task) {
//     return apiRequest('/tasks/', 'POST', task);
// }

async function createTaskOnServer(title = 'New Task', desc = '', marked_as_done = false){
    const response = await fetch(`${API_BASE_URL}/tasks`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + ACCESS_TOKEN
        },
        body: JSON.stringify({
            title: 'New Task',
            desc: '',
            marked_as_done: false,
        })
    });

    return response.json();
}

async function fetchCurrentUser() {
    try {
        document.getElementById("username").textContent = USER_NAME;
    } catch (error) {
        console.error("Error fetching user:", error);
        document.getElementById("username").textContent = "Guest";
    }
};

// function updateTaskOnServer (id, updates) {
//     return apiRequest(`/tasks/${id}`, 'PUT', updates);
// }

async function updateTaskOnServer(taskId, data) {
    await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + ACCESS_TOKEN
        },
        body: JSON.stringify(data)
    });
}

// function deleteTaskOnServer(id) {
//     return apiRequest(`/tasks/${id}`, 'DELETE');
// }

async function deleteTaskOnServer(taskId) {
    await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + ACCESS_TOKEN
        }
    });
}



let taskList;
let addTask;


// async function changeCurrentUser() {

// };


window.addEventListener('load', async () => {
    taskList = document.querySelector('#task-list');
    addTask = document.querySelector('#add-task');

    await fetchCurrentUser();

    const tasks = await fetchTasks();
    console.log('Fetched tasks:', tasks);

    tasks.forEach(renderTask);

    // kui nuppu vajutatakse siis lisatakse uus task
    addTask.addEventListener('click', async () => {
        const newTask = await createTaskOnServer();
        renderTask(newTask);
    });
        
});

function renderTask(task) {
    const taskRow = createTaskRow(task);
    taskList.appendChild(taskRow);
}

function createTaskRow(task) {
    const taskRow = document.querySelector('[data-template="task-row"]').cloneNode(true);
    taskRow.removeAttribute('data-template');

    const name = taskRow.querySelector("[name='name']");
    name.value = task.title;

    name.addEventListener('input', async () => {
        await updateTaskOnServer(task.id, { title: name.value });
    });

    const checkbox = taskRow.querySelector("[name='completed']");
    checkbox.checked = task.marked_as_done;
    checkbox.addEventListener('change', async () => {
        await updateTaskOnServer(task.id, { marked_as_done: checkbox.checked });
    });

    const deleteButton = taskRow.querySelector('.delete-task');
    deleteButton.addEventListener('click', async () => {
        await deleteTaskOnServer(task.id);
        taskList.removeChild(taskRow);

        const updatedTasks = await fetchTasks();
        taskList.innerHTML = '';
        updatedTasks.forEach(renderTask);
    });

    hydrateAntCheckboxes(taskRow);

    return taskRow;
}


// function createAntCheckbox() {
//     const checkbox = document.querySelector('[data-template="ant-checkbox"]').cloneNode(true);
//     checkbox.removeAttribute('data-template');
//     hydrateAntCheckboxes(checkbox);
//     return checkbox;
// }

/**
 * See funktsioon aitab lisada eridisainiga checkboxile vajalikud event listenerid
 * @param {HTMLElement} element Checkboxi wrapper element või konteiner element mis sisaldab mitut checkboxi
 */
function hydrateAntCheckboxes(element) {
    const elements = element.querySelectorAll('.ant-checkbox-wrapper');
    for (let i = 0; i < elements.length; i++) {
        let wrapper = elements[i];

        // Kui element on juba töödeldud siis jäta vahele
        if (wrapper.__hydrated)
            continue;
        wrapper.__hydrated = true;


        const checkbox = wrapper.querySelector('.ant-checkbox');

        // Kontrollime kas checkbox peaks juba olema checked, see on ainult erikujundusega checkboxi jaoks
        const input = wrapper.querySelector('.ant-checkbox-input');
        if (input.checked) {
            checkbox.classList.add('ant-checkbox-checked');
        }
        
        // Kui inputi peale vajutatakse siis uuendatakse checkboxi kujundust
        input.addEventListener('change', () => {
            checkbox.classList.toggle('ant-checkbox-checked');
        });
    }
}
