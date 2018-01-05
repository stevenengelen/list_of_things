/* -------------- */
/* the Controller */
/* -------------- */
var controller = {
	createList : function(name) {
		model.createList(name);
	},
	createItem : function(name) {
		model.createItem(name);
	},
	deleteItem : function(index) {
		model.deleteItem(index);
	},
	tickItem : function(index, state) {
		model.tickItem(index, state);
	},
	resetList : function() {
		model.resetList();
	},
	deleteList : function() {
		model.deleteList();
	},
	selectList : function(listName) {
		model.selectList(listName);
	}
}

/* ---------- */
/* the Model  */
/* ---------- */

var model = {
	lists : [],
	activeList : null,

	createList : function(name) {
		if(this.listAlreadyExists(name)) {
			view.displayError('List ' + name + ' already exists. Please choose another name for your list.');
		} else if(name === null) {
			view.displayError('The list must have a name.');
		}
		else {
			newList = new List(name);
			this.lists.push(newList);
			view.displayPage(newList);
			this.activeList = newList;
			this.writeListToLocalStorage();
		}
	}, 

	loadLists : function(name) {
		if(typeof(Storage) !== "undefined") {
			for(var i = 0; i < localStorage.length; i++) {
				var listData = JSON.parse(localStorage.getItem(localStorage.key(i)));
				var list = new List(listData["name"]);
				var items = listData["items"];
				for(var j = 0; j < items.length; j++) {
					var item = new Item(items[j]["name"]);
					item.setState(items[j]["state"]);
					// console.log("model.loadLists name " + item.getName() + " state " + item.getState());
					list.items.push(item);
				}
				this.lists.push(list);
			}
			if(this.lists.length > 0) {
				this.activeList = this.lists[0];
				view.displayPage(this.activeList);
			}
			else {
				view.displayPage(this.activeList);
			}
		} else {
			alert("Sorry, no local storage available");
		}
	},
	
	writeListToLocalStorage : function() {
		localStorage.setItem(this.activeList.name, JSON.stringify(this.activeList));
	},

	removeListFromLocalStorage : function() {
		localStorage.removeItem(this.activeList.name);
	},

	listAlreadyExists : function(name) {
		for(var i = 0; i < this.lists.length; i++) {
			if(this.lists[i].name == name) {
				return true;
			}
		}
		return false;
	},

	createItem : function(name) {
		this.activeList.createItem(name);
		view.displayPage(this.activeList);
		this.writeListToLocalStorage();
	},

	deleteItem : function(index) {
		this.activeList.deleteItem(index);
		view.displayPage(this.activeList);
		this.writeListToLocalStorage();
	},

	tickItem : function(index, state) {
		this.activeList.tickItem(index, state)
		this.writeListToLocalStorage();
		console.log("model.tickItem at " + index + " is in state " + state);
	},

	resetList : function() {
		this.activeList.resetList();
		view.displayPage(this.activeList);
		this.writeListToLocalStorage();
	},

	deleteList : function() {
		var index = this.lists.indexOf(this.activeList);
		if(index > -1) {
			this.lists.splice(index, 1);
			this.removeListFromLocalStorage();
			this.activeList = null;
			view.displayPage(this.activeList);
		} else {
			view.displayError('This list does not seem to exist. Strange.');
		}
	},

	selectList : function(listName) {
		var indexOfListName = -1;
		this.lists.find(function(value, index) {
			if(value.getName() == this) {
				indexOfListName = index;
			}
		}, listName);
		if(indexOfListName > -1) {
			this.activeList = this.lists[indexOfListName];
		};
		view.displayPage(this.activeList);
	}
}

/* --------------- */
/* the List object */
/* --------------- */
function List(name) {
	this.name = name;
	this.items = [];
}

List.prototype.createItem = function(name) {
	this.items.push(new Item(name));
}

List.prototype.deleteItem = function(index) {
	this.items.splice(index, 1);
}

List.prototype.tickItem = function(index, state) {
	this.items[index].setState(state);
}

List.prototype.resetList = function() {
	for(var i =0; i < this.items.length; i++) {
		this.items[i].setState(false);
	}
}

List.prototype.getName = function() {
	return this.name;
}

/* --------------- */
/* the Item object */
/* --------------- */
function Item(name) {
	this.name = name;
	this.state = false;
}

Item.prototype.getName = function() {
	return this.name;
}

Item.prototype.setName = function(name) {
	this.name = name;
}

Item.prototype.getState = function() {
	return this.state;
}

Item.prototype.setState = function(state) {
	this.state = state;
}

/* -------- */
/* the View */
/* -------- */
var view = {
	createListHTML : '<nav><ul class = "menu"><li id = "createList"><i>+ New list</i></li></ul></nav>',
	endOfPageHTML : '<script src = "list_of_things.js"></script><script src = "list_of_things_data.js></script>',

	listOperationsHTML : '<div class = "listOperations"><span class = "listOperation" id = "resetList">Reset list</span><span class = "listOperation" id = "deleteList">Delete list</span></div>',

	displayListButtons : function(list) {
		var output = '<nav><ul class = "menu">';
		for(var i = 0; i < model.lists.length; i++) {
			var list_classes = 'class = "list"';
			if(model.lists[i] == list) {
				list_classes = 'class = "list, active"';
			}
			output = output + '<li ' + list_classes + ' id = "' + model.lists[i].getName() + '">' + model.lists[i].getName() + '</li>';	
		}
		return output = output + '<li>+<input type = "text" id = "createList" value = "New list"></li></ul></nav>';	
	},
	
	displayList : function(list) {
		var output = '';
		if(list) {
			output = output + '<h1>' + list.getName() + '</h1>' + '<p>'
			for(var i = 0; i < list.items.length; i++) {
				var itemName = list.items[i].getName();
				var checkedString = '';
				if(list.items[i].getState()) {
					checkedString = 'checked';
				}
				// with the edit item option
				/*
				output = output + '<div class = "dropdown"><input type = "checkbox" class = "checkboxItem" name = "' + i + '" ' + checkedString + '><span class = "checkboxItemText" name = "' + i +'">' + itemName + '</span><br><div id = "popupContent' + i + '" class = "popupContent"><span class = "popupItem" id = "editItem">Edit Item</span><span class = "popupItem" id = "deleteItem">Delete item</span></div></div><br>';
				*/
				// without the edit item option
				output = output + '<div class = "dropdown"><input type = "checkbox" class = "checkboxItem" name = "' + i + '" ' + checkedString + '><span class = "checkboxItemText" name = "' + i +'">' + itemName + '</span><br><div id = "popupContent' + i + '" class = "popupContent"><span class = "popupItem" id = "deleteItem">Delete item</span></div></div><br>';
			}
		}
		return output + '<span> +<input type = "text" id = "addItem" value = "New item"><br></span>';
	},

	displayPage : function(list) {
		var body = document.getElementsByTagName("body");
		var output = this.listOperationsHTML + this.displayListButtons(list) + this.displayList(list) + this.endOfPageHTML;
		// console.log(output);
		body.item(0).innerHTML = output;
		init();
	},
	
	displayError : function(msg) {
		alert(msg);
	}
}

function init() {
	var createListInput = document.getElementById("createList");
	if(createListInput) {
		createListInput.onchange = handleCreateList;
		createListInput.onclick = handleClearFieldOnClick;
	}

	var addItemInput = document.getElementById("addItem");
	if(addItemInput) {
		addItemInput.onchange = handleAddItem;
		addItemInput.onclick = handleClearFieldOnClick;
	}

	var checkboxes = document.getElementsByClassName("checkboxItem");
	for(var i = 0; i < checkboxes.length; i++) {
		checkboxes.item(i).onclick = handleTickItem;
	}
	
	var resetListButton = document.getElementById("resetList");
	if(resetListButton) {
		resetListButton.onclick = handleResetList;
	}

	var deleteListButton = document.getElementById("deleteList");
	if(deleteListButton) {
		deleteListButton.onclick = handleDeleteList;
	}

	var selectListButtons = document.getElementsByClassName("list");
	if(selectListButtons) {
		for(var i = 0; i < selectListButtons.length; i++ ){
			selectListButtons[i].onclick = handleSelectList;
		}
	}

	var checkboxItemTexts = document.getElementsByClassName("checkboxItemText");
	for(var i = 0; i < checkboxItemTexts.length; i++) {
		checkboxItemTexts.item(i).onclick = initPopup;
	}


	function initPopup(eventObj) {
		var checkboxItemText = eventObj.target;
		var index = checkboxItemText.getAttribute("name");
		console.log("popupContent" + index);
		document.getElementById("popupContent" + index).classList.toggle("show");

		var deleteItemObject = document.getElementById("deleteItem");
		if(deleteItemObject) {
			console.log("deleteItemObject found");
			deleteItemObject.onclick = handleDeleteItem;
		}
	}
}

/* -------- */
/* handlers */
/* -------- */
function handleCreateList(eventObj) {
	var createListTextBox = eventObj.target;
	var newListName = createListTextBox.value;
	if(newListName != null) {
		controller.createList(newListName);
	}
}

function handleAddItem(eventObj) {
	var addItemTextBox = eventObj.target;
	var itemName = addItemTextBox.value;
	if(itemName != null) {
		controller.createItem(itemName);
	}
}

function handleDeleteItem(eventObj) {
	console.log("in handleDeleteItem");
	var deleteButton = eventObj.target;
	var index = deleteButton.getAttribute("name");

	controller.deleteItem(index)
}

function handleTickItem(eventObj) {
	var tickItem = eventObj.target;
	var index = tickItem.getAttribute("name");

	controller.tickItem(index, tickItem.checked)
}

function handleClearFieldOnClick(eventObj) {
	var field = eventObj.target;
	field.value = "";
}

function handleResetList() {
	controller.resetList();
}

function handleDeleteList() {
	controller.deleteList();
}

function handleSelectList(eventObj) {
	var selectListButton = eventObj.target;
	var selectedListName = selectListButton.getAttribute('id');
	controller.selectList(selectedListName);
}

model.loadLists();
window.onload = init;
window.onclick = function(event) {
	if (!event.target.matches('.checkboxItemText')) {

		var dropdowns = document.getElementsByClassName("popupContent");
		var i;
		for (i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
}
