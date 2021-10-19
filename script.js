const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const ListColumns= document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays =[];
// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}
 getSavedColumns();
 updateSavedColumns();
// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray , progressListArray , completeListArray , onHoldListArray];
  const arrayNames = ['backlog' , 'progress' , 'complete' , 'onHold'];
  arrayNames.forEach((element , index) => {
    localStorage.setItem(`${element}Items` , JSON.stringify(listArrays[index]));
  });
}


// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log('columnEl:', columnEl);
  // console.log('column:', column);
  // console.log('item:', item);
  // console.log('index:', index);
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable =true;
  listEl.setAttribute('ondragstart' , 'drag(event)');
  listEl.contentEditable = 'true';
  listEl.id = index;
  listEl.setAttribute('onfocusout' , `updateItem(${index} , ${column});`)
  // append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if(!updatedOnLoad)
  {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogitem , index)=>
  {
    createItemEl(backlogList , 0 , backlogitem , index);
  })

  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((backlogitem, index) => {
    createItemEl(progressList, 1, backlogitem, index);
  });
  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((backlogitem, index) => {
    createItemEl(completeList, 2, backlogitem, index);
  });
  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((backlogitem, index) => {
    createItemEl(onHoldList, 3, backlogitem, index);
  });
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// update or delete value
function updateItem(id , column)
{
  const selectedArray = listArrays[column];
  const selectedColumnEl = ListColumns[column].children;
  if (!dragging) {
      if (!selectedColumnEl[id].textContent) {
        delete selectedArray[id];
        selectedArray.pop(id);
      } else {
        selectedArray[id] = selectedColumnEl[id].textContent;
      }
      // console.log(selectedArray);

      // console.log(selectedArray);
      updateDOM();
  }
}

function addtocolumn(column)
{
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent ='';
  updateDOM();
}

// show input box
function showinputbox(column)
{
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}
// Hide input box
function hideinputbox(column)
{
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addtocolumn(column);
}
// Rebuil;ting arrays 
function rebuildarray()
{
  console.log(backlogList.children);
  console.log(progressList.children);
  backlogListArray = [];
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  }
  progressListArray =[];
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }
  completeListArray = [];
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }
  onHoldListArray =[];
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }
  updateDOM();
}
function drag(event)
{
  draggedItem = event.target;
  dragging = true;
  console.log(draggedItem)
}

function allowdrop(e)
{
  e.preventDefault();
  
}

function drop(e)
{
  e.preventDefault();
  ListColumns.forEach(column=>
    {
      column.classList.remove('over')
    });
  const parent  = ListColumns[currentColumn];
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildarray();
}

function dragEnter(column)
{
  // console.log(ListColumns[column]);
  ListColumns[column].classList.add('over');
  currentColumn = column;

}
// Onload 
updateDOM();