var createPageHTML = '<button id = "createList">Create a new list</button><script src = "list_of_things.js"></script>';

var controller = {
	createList : function(name) {
		model.createList(name);
	}
}

var model = {
	lists : [],

	createList : function(name) {
		if(this.listAlreadyExists(name)) {
			view.displayError('List ' + name + ' already exists. Please choose another name for your list.');
		} else {
			newList = new List(name);
			this.lists.push(newList);
			view.displayList(newList);
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
	}
}

function List(name) {
	this.name = name;
	this.items = [];
}

List.prototype.writeList = function() {
	// write the list to a file
	console.log(JSON.stringify(this));
}

var view = {
	displayList : function(list) {
		// show the list page
		var body = document.getElementsByTagName("body");
		var bodyList = '<h1>' + list.name + '</h1>' + createPageHTML;
		body.item(0).innerHTML = bodyList;
		init();
	},

	displayError : function(msg) {
		alert(msg);
	}
}

function init() {
	console.log('In init()');
	// model.loadLists();

	var createListButton = document.getElementById("createList");
	createListButton.onclick = handleCreateList;
}

function handleCreateList() {
	var listInputName = prompt('Please enter the list name: ');
	controller.createList(listInputName);
}

window.onload = init;
