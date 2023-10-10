const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");


const LOCAL_STORAGE_LIST_KEY = "task.lists"

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [] // checks if the key already exists in the local storage and if yes then it gets them if not it uses an empty array
console.log(lists);


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
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
}

function render() { // this function creates the list and makes it a child of the ul
    clearElement(listsContainer)
    lists.forEach( (list) => {
        const listElement = document.createElement("li");
        listElement.dataset.listId = list.id;
        listElement.classList.add("list-name");
        listElement.innerText = list.name;
        listsContainer.appendChild(listElement);
    }

    )
}

function clearElement(element) { // removes any elements that might have been hardcoded in the html before
 while (element.firstChild){
    element.removeChild(element.firstChild);
 }
}

render();
