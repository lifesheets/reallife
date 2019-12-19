var toggledInto = [];
var nonStandartContainer = [];
var storageContainers = [];
var style = getComputedStyle(document.body);
const cell_size = parseInt(style.getPropertyValue('--cell_size').replace("px", ""));
const padding = parseInt(style.getPropertyValue('--padding').replace("px", ""));
var mouseDown = 0;
var shiftDown = 0;
var controlDown = 0;
var lastInteraction = 0;
document.body.onmousedown = function(e) {
	if (e.which == 1) {
		mouseDown = 1;
	};
}
document.body.onmouseup = function(e) {
	if (e.which == 1) {
		mouseDown = 0;
	};
}
$(window).keydown(function(e) {
	if (e.originalEvent.key == "Control") {
		controlDown = 1;
	}
	if (e.originalEvent.key == "Shift") {
		shiftDown = 1;
	}
});
$(window).keyup(function(e) {
	if (e.originalEvent.key == "Control") {
		controlDown = 0;
	}
	if (e.originalEvent.key == "Shift") {
		shiftDown = 0;
	}
});
var ContextHandler = new class {
	constructor() {
		let self = this;
		self._busy = false;
		self._contextItemData = {};
		self._origin = "";
		$(window).on("click", function(event) {
			if (event.which != 1) return;
			if (self.busy != true) return;
			event.preventDefault();
			event.stopPropagation();
			self.closeOutOfBounds(event);
		});
		$(window).on('contextmenu', function(event) {
			if (self.busy != true) return;
			event.preventDefault();
			event.stopPropagation();
			self.closeOutOfBounds(event);
		});
	}
	action(what) {
		console.log("do action", what);
		let item = this._contextItemData;
		if (item) {
			console.log("item", item);
			mp.trigger("Storage:Action", what, this._origin, item.id)
			this._busy = false;
			this.close();
		}
	}
	close() {
		$("#context_menu").hide();
		$("#context_menu").html("");
		$("#context_menu").css({
			top: -1000,
			left: -1000
		})
		this._busy = false;
		lastInteraction = Date.now();
	}
	closeOutOfBounds(event) {
		console.log("event", event);
		console.log("parents", $(event.target));
		if ($(event.target).hasClass("option")) {
			console.log("Is Option")
		} else {
			this.close();
		}
	}
	get busy() {
		return this._busy;
	}
	getOptions(item_) {
		let options = "";
		options += `<div onclick="ContextHandler.action('drop')" class="option">Drop</div>`
		if (item_.indexOf("Food") > -1) {
			options += `<div onclick="ContextHandler.action('eat')" class="option">Consume</div>`
		}
		if (item_.indexOf("Drink") > -1) {
			options += `<div onclick="ContextHandler.action('drink')" class="option">Consume</div>`
		}
		if (item_.indexOf("Tool") > -1) {
			options += `<div onclick="ContextHandler.action('use')" class="option">Use</div>`
		}
		if (item_.indexOf("Prop") > -1) {
			options += `<div onclick="ContextHandler.action('build')" class="option">Build</div>`
		}
		return options;
	}
	open(event, item, source) {
		let self = this;
		//TODO EXTEND!!!
		let item_data = $(item).data("item");
		self._contextItemData = item_data.item;
		self._origin = source;
		$("#context_menu").css({
			top: event.clientY,
			left: event.clientX
		})
		console.log(self._contextItemData);
		console.log(self.getOptions(self._contextItemData.mask));
		$("#context_menu").html(self.getOptions(self._contextItemData.mask))
		$("#context_menu").show();
		setTimeout(function() {
			self._busy = true;
		}, 1)
	}
}

