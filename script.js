const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const deleteListButton = document.querySelector("[data-delete-list-button]");

listsContainer.addEventListener("click", (e) => { // checking if user has clicked on a li item
    if (e.target.tagName.toLowerCase() === "li") {
        selectedListId = e.target.dataset.listId; // if li is clicked the dataset will get the id we created in the render function
        saveAndRender()
    }
})

const LOCAL_STORAGE_LIST_KEY = "task.lists"
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListId" // creates key value pair for local storage to identify the active list

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [] // checks if the key already exists in the local storage and if yes then it gets them if not it uses an empty array
console.log(lists);
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

function saveAndRender() { // saves all the lists to local storage and calls the other functions
    save() 
    render()
}

function save() { // this function saves the list array as a string into local storage 
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists)); //Local... is the key and json stringify is the value
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId); // key is local.. and value is the id we created using the date in the render function
}

function render() { // this function creates the list and makes it a child of the ul
    clearElement(listsContainer)
    lists.forEach( (list) => {
        const listElement = document.createElement("li");
        listElement.dataset.listId = list.id;
        listElement.classList.add("list-name");
        listElement.innerText = list.name;
        if (list.id === selectedListId) {
            listElement.classList.add("active-list"); // gives the selected list the class of active so that the styling is different
        }
        listsContainer.appendChild(listElement);
    }

    )
}

function clearElement(element) { // removes any elements that might have been hardcoded in the html before, also good because it removes all the classes like the selected list id and stuff, 
 while (element.firstChild){
    element.removeChild(element.firstChild);
 }
}

render();
