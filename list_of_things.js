var createPageHTML = '<button id = "createList">Create a new list</button><br><button id = "addItem">Add item</button><script src = "list_of_things.js"></script>';

/* -------------- */
/* the Controller */
/* -------------- */
var controller = {
	createList : function(name) {
		model.createList(name);
	},
	createItem : function(name) {
		model.createItem(name);
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
	displayList : function(list) {
		// show the list page
		var body = document.getElementsByTagName("body");
		var bodyList = '<h1>' + list.name + '</h1>' + '<p>'
		for(var i = 0; i < list.items.length; i++) {
			var itemName = list.items[i].getName();
			console.log(itemName);
			bodyList = bodyList + '<input type = "checkbox" name = "' + itemName + '">' + itemName + '</br>';
		}
		bodyList = bodyList + '</p>' + createPageHTML;
		body.item(0).innerHTML = bodyList;
		init();
	},

	displayError : function(msg) {
		alert(msg);
	}
}

function init() {
	var createListButton = document.getElementById("createList");
	createListButton.onclick = handleCreateList;

	var addItemButton = document.getElementById("addItem");
	if(addItemButton) {
		addItemButton.onclick = handleAddItem;
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

window.onload = init;
