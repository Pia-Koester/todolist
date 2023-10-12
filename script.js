
// add function to delete task item 

const listsContainer = document.querySelector(".task-list");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const deleteListButton = document.querySelector("[data-delete-list-button]");
const listDisplayContainer = document.querySelector("[data-list-display-container]");
const listTitleElement = document.querySelector("[data-list-title");
const tasksContainer = document.querySelector("[data-tasks]");
const taskTemplate = document.getElementById("task-template");
const newTaskForm = document.querySelector("[data-new-task-forms]");
const newTaskInput = document.querySelector("[data-new-task-input]");


listsContainer.addEventListener("click", (e) => { // checking if user has clicked on a li item
    if (e.target.tagName.toLowerCase() === "li") {
        selectedListId = e.target.dataset.listId; // if li is clicked the dataset will get the id we created in the render function
        saveAndRender()
    }
})

const LOCAL_STORAGE_LIST_KEY = "task.lists" // task is the namespace to prevent overwriting
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId" // creates key value pair for local storage to identify the active list

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [] // checks if the key already exists in the local storage and if yes then it gets them if not it uses an empty array
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY) // checks local storage for the active list id

deleteListButton.addEventListener("click", (e) => {
    lists = lists.filter(list => list.id !== selectedListId); // lists array gets overwritten with an array which is filtert to not contain the currently selected list
    selectedListId = null; 
    saveAndRender();
})



newListForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const listName = newListInput.value; // listName is the content the user wrote in the input field 
    if (listName == null || listName === "") return // if the person did not enter any information the function returns and therefore stopps
    const list = createList(listName) // the function which creates a new list object with the date as id is called with the value of the input as parameter
    newListInput.value = null // after submitting the input area is going to be empty
    lists.push(list) // the new created listobject will be pushed to the lists array
    saveAndRender() // saves to local storage and recreates the list names to be shown from the array
})
function createList(name) { // this function creates a new list name and gives it a unique ID using the date
    return {id: Date.now().toString(), name: name, tasks: []}
}

newTaskForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const taskName = newTaskInput.value; 
    if (taskName == null || taskName === "") return // if the person did not enter any information the function returns and therefore stopps
    const task = createTask(taskName) // the function which creates a new list object with the date as id is called with the value of the input as parameter
    newTaskInput.value = null // after submitting the input area is going to be empty
    const selectedList = lists.find((list) => list.id === selectedListId);
    selectedList.tasks.push(task);
    saveAndRender();
})




function createTask(name) {
    return {id: Date.now().toString(), name: name}
}


function saveAndRender() { // saves all the lists to local storage and calls the other functions
    save() 
    render()
}

function save() { // this function saves the list array as a string into local storage 
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists)); //Local... is the key and json stringify is the value
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId); // key is local.. and value is the id we created using the date in the render function
}

function render() { // this function creates the list and makes it a child of the ul
    clearElement(listsContainer); 
    renderLists(); // creates the Lists overview with all the different to do lists containing tasks
    const selectedList = lists.find(list => list.id === selectedListId ); //define the list which is selected
    // check if any list is selected, if not there should be no task container visible
    if (selectedListId == null) {
        listDisplayContainer.style.display = "none";
    } else {
        listDisplayContainer.style.display = ""; // if a list is selected it should be visible 
        listTitleElement.innerText = selectedList.name; // setting the title of the container to the name of the object with the id which is the selcted id
    }
    clearElement(tasksContainer); // remove all the hardcoded and not locally stored tasks 
    renderTasks(selectedList);
}

function renderTasks (selectedList) {
selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector("input");
    checkbox.id = task.id;
    const label = taskElement.querySelector("label");
    label.append(task.name); 
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.classList.add("btn", "delete-btn")
    taskElement.querySelector(".task").appendChild(deleteButton);

    deleteButton.addEventListener("click", () => {
      // Remove the task from the selected list
      selectedList.tasks = selectedList.tasks.filter((t) => t.id !== task.id);
      saveAndRender();
    });
    
    tasksContainer.appendChild(taskElement);
    // neuer Eventlistener auf double click und dann checkbox checked setzen

    label.addEventListener("dblclick", (e) => {
    const checkbox = e.target.previousSibling.previousSibling;  // selecting the checkbox because it is the sibling next to the lable
       checkbox.checked =  checkbox.checked ? false : true; // controls whether or not the value checked is set to true - if it is true then set it to false and uncheck it. if it is false then check the box 

    } )
    label.addEventListener("blur", () => {
        task.name = label.innerText;
        saveAndRender();
    });
})
}


function renderLists(){
    lists.forEach( (list) => {
        const listElement = document.createElement("li");
        listElement.dataset.listId = list.id;
        listElement.classList.add("list-name");
        listElement.innerText = list.name;
        if (list.id === selectedListId) {
            listElement.classList.add("active-list"); // gives the selected list the class of active so that the styling is different
        }
        listsContainer.appendChild(listElement);
    })
}

function clearElement(element) { // removes any elements that might have been hardcoded in the html before, also good because it removes all the classes like the selected list id and stuff, 
 while (element.firstChild){
    element.removeChild(element.firstChild);
 }
}

render();
