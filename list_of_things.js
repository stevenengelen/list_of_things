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
	}
}

/* ---------- */
/* the Model  */
/* ---------- */
var model = {
	lists : [],

	createList : function(name) {
		if(this.listAlreadyExists(name)) {
			view.displayError('List ' + name + ' already exists. Please choose another name for your list.');
		} else {
			newList = new List(name);
			this.lists.push(newList);
			view.displayList(newList);
			this.activeList = newList;
		}
	}, 

	loadLists : function(name) {
		// get the json file and load a list
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
		view.displayList(this.activeList);
	},

	deleteItem : function(index) {
		this.activeList.deleteItem(index);
		view.displayList(this.activeList);
	},

	tickItem : function(index, state) {
		this.activeList.tickItem(index, state)
	},

	resetList : function() {
		this.activeList.resetList();
		view.displayList(this.activeList);
	},

	deleteList : function() {
		var index = this.lists.indexOf(this.activeList);
		if(index > -1) {
			this.lists.splice(index, 1);
			this.activeList = null;
			view.displayCreatePage();
		} else {
			view.displayError('This list does not seem to exist. Strange.');
		}
	}
}

/* --------------- */
/* the List object */
/* --------------- */
function List(name) {
	this.name = name;
	this.items = [];
}

List.prototype.writeList = function() {
	// write the list to a file
	console.log(JSON.stringify(this));
}

List.prototype.createItem = function(name) {
	this.items.push(new Item(name));
}

List.prototype.deleteItem = function(index) {
	this.items.splice(index);
}

List.prototype.tickItem = function(index, state) {
	this.items[index].setState(state);
}

List.prototype.resetList = function() {
	for(var i =0; i < this.items.length; i++) {
		this.items[i].setState(false);
	}
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
		createPageHTML : '<button id = "createList">Create a new list</button><br><script src = "list_of_things.js"></script>',
	
	displayList : function(list) {
		// show the list page
		var body = document.getElementsByTagName("body");
		var bodyList = '<h1>' + list.name + '</h1>' + '<p>'
		for(var i = 0; i < list.items.length; i++) {
			var itemName = list.items[i].getName();
			var checkedString = '';
			if(list.items[i].getState()) {
				checkedString = 'checked';
			}
			bodyList = bodyList + '<input type = "checkbox" class = "checkboxItem" name = "' + i + '" ' + checkedString + '>' + itemName + '<button class = "deleteItemButton" name = "' + i + '">Delete</button></br>';
		}
		bodyList = bodyList + '</p><button id = "addItem">Add item</button><br><button id = "resetList">Reset list</button><br><button id = "deleteListButton">Delete list</button><br>' + this.createPageHTML;
		body.item(0).innerHTML = bodyList;
		init();
	},
	
	displayError : function(msg) {
		alert(msg);
	},

	displayCreatePage : function() {
		var body = document.getElementsByTagName("body");
		body.item(0).innerHTML = this.createPageHTML;
		init();
	}
}

function init() {
	var createListButton = document.getElementById("createList");
	createListButton.onclick = handleCreateList;

	var addItemButton = document.getElementById("addItem");
	if(addItemButton) {
		addItemButton.onclick = handleAddItem;
	}

	var deleteItemButtons = document.getElementsByClassName("deleteItemButton");
	for(var i = 0; i < deleteItemButtons.length; i++) {
		deleteItemButtons.item(i).onclick = handleDeleteItem;
	}

	var checkboxes = document.getElementsByClassName("checkboxItem");
	for(var i = 0; i < checkboxes.length; i++) {
		checkboxes.item(i).onclick = handleTickItem;
	}

	var resetListButton = document.getElementById("resetList");
	if(resetListButton) {
		resetListButton.onclick = handleResetList;
	}

	var deleteListButton = document.getElementById("deleteListButton");
	if(deleteListButton) {
		deleteListButton.onclick = handleDeleteList;
	}
}

/* -------- */
/* handlers */
/* -------- */
function handleCreateList() {
	var listInputName = prompt('Please enter the list name: ');
	controller.createList(listInputName);
}

function handleAddItem() {
	var itemName = prompt('Please enter the description of the entry in the list: ');
	controller.createItem(itemName);
}

function handleDeleteItem(eventObj) {
	var deleteButton = eventObj.target;
	var index = deleteButton.getAttribute("name");

	controller.deleteItem(index)
}

function handleTickItem(eventObj) {
	var tickItem = eventObj.target;
	var index = tickItem.getAttribute("name");

	controller.tickItem(index, tickItem.checked)
}

function handleResetList() {
	controller.resetList();
}

function handleDeleteList() {
	controller.deleteList();
}

window.onload = init;
