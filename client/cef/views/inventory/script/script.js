var toggledInto = [];
var nonStandartContainer = [];
var storageContainers = [];
var mouseDown = 0;
var shiftDown = 0;
var controlDown = 0;
var lastInteraction = 0;
document.onmousedown = function(e) {
	if (e.which == 1) {
		mouseDown = 1;
	};
}
document.onmouseup = function(e) {
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

function generateName(data) {
	let name = data.id !== undefined ? data.name + "[" + data.id + "]" : data.name;
	return name;
}
var ContextHandler = new class extends EventTarget{

	constructor() {
		super();
		this._setup();
	}

	emit(event, data) {
		document.dispatchEvent(new CustomEvent(event, {
			'detail': data
		}));
	}
	_setup() {
		var self = this;
		self.descItem = $("#descitem")
		$("#descitem").insertAfter($("body"));
		self.contextmenu_Div = $("#context_menu")
		$("#context_menu").insertAfter($("body"));
		self._registeredTargets = [];
		self._lastTarget = undefined;
		$(window).mousemove((event) => {
			if (DragHandler._dragging == 1) return;
			window.requestAnimationFrame(() => {
				this.move(event);
			});
		});$(window).on("click", (event) =>{
			if (event.which != 1) return;
			if (this.busy != true) return;
			event.preventDefault();
			event.stopPropagation();
			this.closeOutOfBounds(event);
		});
		$(window).on('contextmenu', (event) => {
			if (this.busy != true) return;
			event.preventDefault();
			event.stopPropagation();
			this.closeOutOfBounds(event);
		});
		this._busy = false;
	}
	get busy() {
		return this._busy;
	}
	deleteDropable(selector) {
		selector = selector.replace("#", "");
		//console.log("deleteDropable", selector)
		if (this._registeredTargets[selector]) {
			//console.log("dropable exists and is registered");
			this._registeredTargets[selector] = null;
			delete this._registeredTargets[selector];
		}
	}
	registerDropable(source, selector) {
		selector = selector.replace("#", "");
		if (!this._registeredTargets[selector]) {
			$("#" + selector).addClass("dropable")
			this._registeredTargets[selector] = source
		}
	}
	mouseenter(event) {
		var self = this;
		let isInArea = undefined;
		Object.keys(self._registeredTargets).forEach(function(key) {
			let bounds = $("#" + key)[0].getBoundingClientRect();
			if (self._registeredTargets[key].type == "storage") {
				bounds = $("#" + key).find(".grid")[0].getBoundingClientRect();
			}
			if ((event.clientY >= bounds.top) && (event.clientY <= bounds.bottom)) {
				if ((event.clientX >= bounds.left) && (event.clientX <= bounds.right)) {
					isInArea = key;
				}
			}
		});
		if (isInArea != undefined) {
			if (self._registeredTargets[isInArea]) {
				self._lastTarget = self._registeredTargets[isInArea];
			}
		}
	}
	generateDescription(slot_data) {
		let html = "";
		if (slot_data.id) {
			html += `<div class="field large">${slot_data.name}</div>`
			html += `<div class="field small">${slot_data.id}</div>`
			html += `<div class="field tiny">${slot_data.type}</div>`
			html += `<div class="field weight">${((slot_data.weight || 1)*slot_data.count).toFixed(2)} kg (${slot_data.weight || (1).toFixed(2)} kg)</div>`
		} else {
			html += `<div class="field large">(${slot_data.count}x)${slot_data.name}</div>`
			html += `<div class="field tiny">${slot_data.type}</div>`
			html += `<div class="field weight">${((slot_data.weight || 1)*slot_data.count).toFixed(2)} kg (${slot_data.weight || (1).toFixed(2)} kg)</div>`
		}
		//$(this.descItem)
		return html
	}
	move(event) {
		var self = this;
		self.mouseenter(event);
		this.delta_offset = {
			top: 0,
			left: 0
		}
		if (this._contextItemData) {
			let pos = $(this.contextmenu_Div).offset();
			var a = pos.left - event.clientX;
			var b = pos.top - event.clientY;
			var dist = Math.sqrt( a*a + b*b );
			if (dist > 400) {
				this.close();
			}
		}
		if (this._lastTarget) {
			let slot = this._lastTarget.getSlotByAbsolute(event.clientY, event.clientX);
			if (slot) {
				var cell = $(slot).data("cell");
				var row = $(slot).data("row");
				let slot_data = this._lastTarget.getSlot(cell, row);
				if (slot_data) {
					if (this.busy) return;
					$(this.descItem).html(this.generateDescription(slot_data));
					$(this.descItem).css({
						top: ($(slot).offset().top - this.delta_offset.top) + $(slot).height() * 0.95 + 'px',
						left: (($(slot).offset().left - this.delta_offset.left) - self.descItem.width() / 2 + $(slot).width() / 2) + 'px',
						'opacity': 1
					});
					return;
				}
			}
		}
		$(this.descItem).css({
			top: '0px',
			left: '0px',
			'opacity': 1
		});
	}
	action(what) {
		//console.log("do action", what);
		let item = this._contextItemData;
		if (item) {
			//console.log("item", item);
			//mp.trigger("Storage:Action", what, this._origin, item.id)

			this.emit("onItemAction", {
				origin: this._origin,
				data: item
			})


			this._contextItemData = undefined;
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
		this._contextItemData = undefined;
		this._origin = undefined;
		lastInteraction = Date.now();
	}
	closeOutOfBounds(event) {
		//console.log("event", event);
		//console.log("parents", $(event.target));
		if ($(event.target).hasClass("option")) {
			//console.log("Is Option")
		} else {
			this.close();
		}
	}
	getOptions(item_) {
		let options = "";
		if (item_.type.indexOf("Nahrung") > -1) {
			options += `<div onclick="ContextHandler.action('eat')" class="option">Essen</div>`
		}
		if (item_.type.indexOf("Werkzeug") > -1) {
			options += `<div onclick="ContextHandler.action('use')" class="option">Nutzen</div>`
		}
		if ((item_.type.indexOf("Waffe") > -1) && (!item_.equipped)) {
			options += `<div onclick="ContextHandler.action('build')" class="option">Ausrüsten</div>`
		}
		if ((item_.type.indexOf("Waffe") > -1) && (item_.equipped)) {
			options += `<div onclick="ContextHandler.action('build')" class="option">Abrüsten</div>`
		}
		options += `<div onclick="ContextHandler.action('drop')" class="option">Wegwerfen</div>`
		return options;
	}
	open(event, item, origin) {
		//TODO EXTEND!!!
		let item_data = $(item).data("item");
		this._contextItemData = item_data;
		this._origin = origin;
		this.contextmenu_Div.css({
			top: event.clientY,
			left: event.clientX
		})
		//console.log(this.getOptions(item_data));
		this.contextmenu_Div.html(this.getOptions(item_data))
		this.contextmenu_Div.show();
		setTimeout(() => {
			this._busy = true;
		}, 1)
	}
}
var DragHandler = new class {
	constructor() {
		this._setup();
	}
	_setup() {
		var self = this;
		self._sampleItem = $("#dragitem")
		$("#dragitem").insertAfter($("body"));
		self._sampleShadow = $("#dragShadow")
		$("#dragShadow").insertAfter($("body"));
		self._item_data = null;
		self._dragging = false;
		self._offset = {
			top: 0,
			left: 0
		}
		self._registeredTargets = [];
		self._lastTarget = null;
		self._originSource = null;
		self._dragSource = null;
		self._inTimeout = false;
		$(window).mousemove((event) => {
			if (this._dragging == 0) return;
			window.requestAnimationFrame(function() {
				self.move(event);
			});
		});
		$(window).mouseup((event) => {
			if (this._dragging == 0) return;
			if (event.which != 1) return;
			self.mouseup(event)
		});
	}
	clear() {
		var self = this;
		self._dragging = false;
		self._inTimeout = true;
		$(self._sampleItem).css({
			'top': 0,
			'left': 0,
			'opacity': 0,
			'display': "none"
		});
		$(self._sampleShadow).css({
			'top': 0,
			'left': 0,
			'opacity': 0,
			'display': "none"
		});
		$(self._sampleItem).removeClass("smooth");
	}
	move(event) {
		var self = this;
		if (self._dragging == true) {
			$(self._sampleItem).css({
				top: (event.clientY - self._offset.top) + 'px',
				left: (event.clientX - self._offset.left) + 'px',
				'opacity': 1
			});
			if ($(self._sampleItem).hasClass("smooth") == false) {
				$(self._sampleItem).addClass("smooth");
			}
			self.shadow(event);
			self.mouseenter(event);
			if (mouseDown <= 0) {
				self.mouseup(event);
			}
		}
	}
	mouseenter(event) {
		var self = this;
		if (self._dragging) {
			let isInArea = undefined;
			Object.keys(self._registeredTargets).forEach(function(key) {
				let bounds = $("#" + key)[0].getBoundingClientRect();
				if (self._registeredTargets[key].type == "storage") {
					bounds = $("#" + key).find(".grid")[0].getBoundingClientRect();
				}
				if ((event.clientY >= bounds.top) && (event.clientY <= bounds.bottom)) {
					if ((event.clientX >= bounds.left) && (event.clientX <= bounds.right)) {
						isInArea = key;
					}
				}
			});
			if (isInArea != undefined) {
				if (self._registeredTargets[isInArea]) {
					self._lastTarget = self._registeredTargets[isInArea];
				}
			}
		}
	}
	mouseup(event) {
		var self = this;
		if (self._dragging) {
			if (self._lastTarget != undefined) {
				let slot = self._lastTarget.getSlotByAbsolute(event.clientY, event.clientX)
				if (slot) {
					var cell = $(slot).data("cell");
					var row = $(slot).data("row");
					//canFit(cell, row, item_data)
					let item_origin = this._lastTarget.hasItem(this._item_data);
					if (item_origin) {
						let slot = this._lastTarget.getSlotByGrid(item_origin.cell, item_origin.row);
						cell = $(slot).data("cell");
						row = $(slot).data("row");
					}
					if (self._lastTarget.canFit(cell, row, this._item_data)) {
						this._item_data.row = row;
						this._item_data.cell = cell;
						this._lastTarget.addItem(this._item_data);
						this.clear();
						return;
					}
				}
			}
		}
	}
	get busy() {
		return this._dragging && this._inTimeout;
	}
	isDragging() {
		return this._dragging && this._inTimeout;
	}
	isDraggable(item) {
		if (!this._dragging && !this._inTimeout) {
			return true;
		}
		return false;
	}
	deleteDropable(selector) {
		selector = selector.replace("#", "");
		//console.log("deleteDropable", selector)
		if (this._registeredTargets[selector]) {
			//console.log("dropable exists and is registered");
			this._registeredTargets[selector] = null;
			delete this._registeredTargets[selector];
		}
	}
	registerDropable(source, selector) {
		selector = selector.replace("#", "");
		if (!this._registeredTargets[selector]) {
			$("#" + selector).addClass("dropable")
			this._registeredTargets[selector] = source
		}
	}
	prep(event, item, origin) {
		//this.delta_offset = {
		//	top: $("body").offset().top,
		//	left: $("body").offset().left
		//}
		//if (!$(event.currentTarget).parents("body")) {
		this.delta_offset = {
			top: 0,
			left: 0
		}
		//}
		//console.log("event", $(event.currentTarget).parents("body"))
		$(this._sampleItem).html($(item).html());
		$(this._sampleItem).addClass("drag")
		$(this._sampleItem).css({
			'top': ($(item).offset().top - this.delta_offset.top) + "px",
			'left': ($(item).offset().left - this.delta_offset.left) + "px",
			'opacity': "1",
			'display': "block"
		});
		$(this._sampleItem).find("img").css({
			'opacity': "1"
		});
		this._sampleShadow.css({
			'display': "block"
		});
		//console.log("Prep");
	}
	Handle(event, item, origin) {
		let self = this;
		//console.log("receive Handle Job", event, item, origin)
		let cursor = {
			top: event.clientY,
			left: event.clientX
		}
		let offset_top = this.delta_offset.top + $(item).height() / 2;
		let offset_left = this.delta_offset.left + $(item).width() / 2;
		// item mouse offset
		//let offset_top = cursor.top - ($(item).offset().top - this.delta_offset.top);
		//let offset_left = cursor.left - ($(item).offset().left - this.delta_offset.left);
		//console.log("offset_top", offset_top);
		//console.log("offset_left", offset_left);
		this._item_data = $(item).data("item");
		//console.log("itemData", this._item_data)
		this._offset.top = offset_top;
		this._offset.left = offset_left;
		//console.log($(item).attr("style"));
		$(this._sampleItem).html($(item).html());
		this._dragging = true;
		$(this._sampleItem).addClass("drag")
		$(this._sampleItem).css({
			'top': ($(item).offset().top - this.delta_offset.top) + "px",
			'left': ($(item).offset().left - this.delta_offset.left) + "px",
			'opacity': "1"
		});
		//console.log("origin", origin);
		let remainCount = 0;
		//console.log("isCTRL", controlDown) // Half
		//console.log("isShift", shiftDown) // One
		if ((this._item_data.count > 1) && (shiftDown)) {
			remainCount = this._item_data.count - 1;
			this._item_data.count = 1;
		}
		if ((this._item_data.count > 1) && (controlDown)) {
			remainCount = Math.ceil(this._item_data.count / 2);
			this._item_data.count = Math.floor(this._item_data.count / 2);
		}
		//console.log("remainCount", remainCount);
		if (remainCount != 0) {
			origin.modifyItem(this._item_data, {
				count: Math.floor(remainCount)
			})
			//console.log("x");
			$(this._sampleItem).find(".c").html(this._item_data.count)
		} else {
			origin.removeItem(this._item_data)
		}
	}
	shadow(event) {
		let self = this;
		let cursor = {
			top: event.clientY,
			left: event.clientX
		}
		if (this._lastTarget) {
			let item_origin = this._lastTarget.hasItem(this._item_data);
			if (item_origin) {
				let slot = this._lastTarget.getSlotByGrid(item_origin.cell, item_origin.row);
				let cell = $(slot).data("cell");
				let row = $(slot).data("row");
				this._sampleShadow.css({
					top: ($(slot).offset().top - this.delta_offset.top) + "px",
					left: ($(slot).offset().left - this.delta_offset.left) + "px",
					"width": $(slot).width(),
					"height": $(slot).height(),
					"opacity": 1,
					"z-index": 100
				});
				this._sampleShadow.css({
					"background": "rgba(50,150,50,0.3)"
				});
			} else {
				let slot = this._lastTarget.getSlotByAbsolute(cursor.top, cursor.left);
				if (slot) {
					let cell = $(slot).data("cell");
					let row = $(slot).data("row");
					this._sampleShadow.css({
						top: ($(slot).offset().top - this.delta_offset.top) + "px",
						left: ($(slot).offset().left - this.delta_offset.left) + "px",
						"width": $(slot).width(),
						"height": $(slot).height(),
						"opacity": 1,
						"z-index": 14
					});
					if (this._lastTarget.isSlotFree(cell, row)) {
						this._sampleShadow.css({
							"background": "rgba(150,150,150,0.3)"
						});
						return;
					} else if (generateName(this._lastTarget.getSlot(cell, row)) == generateName(this._item_data)) {
						this._sampleShadow.css({
							"background": "rgba(50,150,50,0.3)"
						});
						return;
					} else {
						this._sampleShadow.css({
							"background": "rgba(150,50,50,0.3)"
						});
						return;
					}
				} else {
					this._sampleShadow.css({
						"background": "rgba(150,50,50,0)"
					});
					return;
				}
			}
		}
	}
}
var cell_size = $("body").width() / 20;
var StorageHandler = class extends EventTarget {
	constructor(selector, name, rows = 0) {
		super();
		this.maxRows = rows;
		this.items = [];
		this.name = name;
		this._max_weight = 100;
		this.type = "storage"
		this.selector = selector;
		this.element = $(this.selector).append(`<div id="${this.name.toLowerCase()}" class="window storage">
	        <div class="head">${this.name}</div>
	        <div class="grid"></div>
	        <div class="items"></div>
	        <div class="weight"></div>
	    </div>`)
		//console.log("this.element", this.element);
		this._rows = 0;
		this._cells = 0;
		this._wasDown = 0;
		this.cells();
		/*$("#" + this.name.toLowerCase()).on('mousedown', ".head", (event) => {
			if (this.isToggled == false) return;
			if (ContextHandler.busy == true) return;
			if (DragHandler.busy == true) return;
			let cursor = {
				top: event.clientY,
				left: event.clientX
			}
			let offset_top = cursor.top - $(event.currentTarget).offset().top;
			let offset_left = cursor.left - $(event.currentTarget).offset().left;
			//console.log("offset_top", offset_top);
			//console.log("offset_left", offset_left);
			$(document).find(".storage").each(function(t, e) {
				$(e).css({
					"z-index": 1
				})
			})
			$("#" + this.name.toLowerCase()).css({
				"z-index": 15
			})
			this.dragWindow(offset_top, offset_left);
		});*/
		//ContextHandler.open(event, cTarget, self._rawSelector);
		$("#" + this.name.toLowerCase() + ">.items").on('contextmenu', ".item, img", (event) => {
			if (self.isToggled == false) return;
			if (ContextHandler.busy == true) return;
			if (DragHandler.busy == true) return;
			event.preventDefault();
			if ((Date.now() - lastInteraction) < 200) return;
			//event.stopPropagation();
			let cTarget = event.currentTarget;
			if ($(event.currentTarget).hasClass("item") == false) {
				cTarget = $(event.currentTarget).parents(".item")[0];
			}
			if (cTarget) {
				//console.log("f");
				let data = $(cTarget).data("item");
				if (data) {
					//ContextHandler.open(event, cTarget, self._rawSelector);
					this.emit("onItemContextMenu", {
						eventData: event,
						origin: this,
						data: data,
						target: cTarget
					})
				}
			}
		});
		$("#" + this.name.toLowerCase() + ">.items").on('mousedown', ".item", (event) => {
			if (ContextHandler.busy == true) return;
			if (DragHandler.busy == true) return;
			event.preventDefault();
			//console.log(event);
			if (event.button != 0) return;
			//console.log("mousedown check3");
			let cTarget = event.currentTarget;
			if ($(event.currentTarget).hasClass("item") == false) {
				cTarget = $(event.currentTarget).parents(".item")[0];
			}
			if (cTarget) {
				let data = $(cTarget).data("item");
				let mCount = 0;
				let mEvent = (event) => {
					if (mouseDown == 1) {
						mCount += 1;
						if (mCount > 1) {
							if (DragHandler.isDragging() == false) {
								this.emit("onItemDragStart", {
									eventData: event,
									origin: this,
									data: data,
									target: cTarget
								})
							}
							$(window).unbind("mousemove", mEvent)
							$(window).unbind("mouseup", uEvent)
						} else {
							this.emit("onItemMouseDown", {
								eventData: event,
								origin: this,
								data: data,
								target: cTarget
							})
						}
					} else {
						this.emit("onItemDragCancel")
						$(window).unbind("mousemove", mEvent)
						$(window).unbind("mouseup", uEvent)
					}
				}
				let uEvent = (event) => {
					//console.log("event");
					//console.log("clek");
					if (this._wasDown == 0) {
						this._wasDown = 1;
						this.emit("onItemClick", {
							eventData: event,
							origin: this,
							data: data,
							target: cTarget
						})
						setTimeout(() => {
							this._wasDown = 0;
						}, 10);
					}
					$(window).unbind("mousemove", mEvent);
					$(window).unbind("mouseup", uEvent);
				}
				$(window).mousemove(mEvent);
				$(window).mouseup(uEvent);
			}
			//onItemDragStart
			//console.log(cTarget);
		});
		DragHandler.registerDropable(this, this.name.toLowerCase());
		ContextHandler.registerDropable(this, this.name.toLowerCase());
		this.toggle(false);
	}
	set weight(w) {
		this._max_weight = w;
	}
	dragWindow(offset_top, offset_left) {
		this.delta_offset = {
			top: $("body").offset().top,
			left: $("body").offset().left
		}
		this.delta_offset_body = {
			top: $("#" + this.name.toLowerCase()).offset().top,
			left: $("#" + this.name.toLowerCase()).offset().left
		}
		let base_width = $("#" + this.name.toLowerCase()).width();
		let base_outerwidth = $("#" + this.name.toLowerCase()).outerWidth();
		let lEvent = (event) => {
			window.requestAnimationFrame(() => {
				this._top = event.clientY - offset_top;
				this._left = event.clientX - offset_left
				$("#" + this.name.toLowerCase()).find(".grid").css({
					"width": base_outerwidth,
					"height": $("#" + this.name.toLowerCase()).find(".grid").outerHeight()
				})
				$("#" + this.name.toLowerCase()).css({
					'top': this._top,
					'left': this._left,
					'position': "absolute",
					'margin': "0",
					"width": base_width,
					"height": $("#" + this.name.toLowerCase()).height()
				})
				$("#" + this.name.toLowerCase()).insertAfter($("body"));
				if (mouseDown <= 0) {
					//this.render();
					$(window).unbind("mousemove", lEvent)
				};
			});
		}
		$(window).mousemove(lEvent);
	}
	cells() {
		//console.log("cells");
		let body = $("#" + this.name.toLowerCase() + " .grid");
		let window_width = $("#" + this.name.toLowerCase()).width();
		let window_height = $("#" + this.name.toLowerCase()).height();
		//if (this.native_height) {
		//	window_height = this.native_height;
		//}
		console.log("height",this.name,window_height);
		//console.log("window_height",window_height);
		let max_height_rounds = Math.ceil(window_height / cell_size);
		//console.log("max_rows", max_rows);
		//console.log("cell_size", cell_size);
		let cell_count = Math.ceil(window_width / cell_size);
		this.cell_count = cell_count;
		//console.log("cell_count", cell_count);


		$(body).html("");
		$("html").attr("style", "--cell_width:" + cell_size + "px")
		//this.items.length = 1;
		console.log("max_rows",this.name,max_height_rounds);
		console.log("this.maxRows",this.name,this.maxRows);
		console.log("this.items",this.name,this.items.length,this.items);
		console.log("cell_count",this.name,cell_count);
		let mRows = this.maxRows != 0 ? this.maxRows : (Math.ceil((this.items.length + 1) / cell_count));

		if ((max_height_rounds-1) > mRows) {
			mRows = max_height_rounds-1;
		}


		//console.log("mRows",mRows);
		if (mRows <= 0) mRows = 1;
		this._rows = mRows;
		console.log("this._rows",this.name,this._rows);
		this._cells = cell_count;
		let largest_row = this.items.find(e => {
			return e.row > this._rows;
		});
		//console.log("largest_row", largest_row);
		if (largest_row != undefined) {
			this._rows = largest_row.row;
		}
		for (var row = 0; row < this._rows; row++) {
			for (var cell = 0; cell < this._cells; cell++) {
				$(body).append("<div class='cell' data-cell='" + cell + "' data-row='" + row + "' ></div>")
			}
		}
		//this.native_height = window_height;
		//console.log("native height",this.native_height);
	}
	removeItemBySlot(gCell, gRow) {
		let isOccupied = this.items.findIndex(item => {
			return item.cell !== undefined && item.row !== undefined && item.cell == cell && item.row == row;
		})
		if (isOccupied > -1) {
			let data = this.items[isOccupied];
			this.items.splice(isOccupied, 1)
			this.render();
			return data;
		}
		return false;
	}
	getSlotByAbsolute(top, left) {
		let cells = $("#" + this.name.toLowerCase() + " .grid").find('.cell').toArray();
		let cell = cells.find(function(slot) {
			let offset = $(slot).offset();
			let wh = {
				width: $(slot).width(),
				height: $(slot).height()
			};
			if ((top >= offset.top) && (top <= (offset.top + wh.height))) {
				if ((left >= offset.left) && (left <= (offset.left + wh.width))) {
					return true;
				}
			}
			return false;
		});
		return cell;
	}
	getSlotByGrid(gCell, gRow) {
		let slot = $("#" + this.name.toLowerCase() + " .grid").find(`.cell[data-row='${gRow}'][data-cell='${gCell}']`);
		if (slot != undefined) {
			if ($(slot).length) {
				return $(slot)
			}
		}
		return false;
	}
	getAbsoluteBySlotCalculation(gCell, gRow) {
		let slot = $("#" + this.name.toLowerCase() + " .grid").find(`.cell[data-row='0'][data-cell='0']`);
		let top_left;
		let dimensions;
		if ((slot != undefined) && ($(slot).length)) {
			top_left = {
				top: $(slot)[0].offsetTop,
				left: $(slot)[0].offsetLeft
			};
			dimensions = $(slot).width();
		}
		//console.log("top_left", top_left);
		let position = top_left;
		position.top += (gRow - 1) * dimensions;
		//console.log("top", position);
		return position
	}
	getAbsoluteBySlot(gCell, gRow) {
		let slot = $("#" + this.name.toLowerCase() + " .grid").find(`.cell[data-row='${gRow}'][data-cell='${gCell}']`);
		if (slot != undefined) {
			if ($(slot).length) {
				return {
					top: $(slot)[0].offsetTop,
					left: $(slot)[0].offsetLeft
				}
			}
		}
		return false;
	}
	isSlotFree(cell, row) {
		let isOccupied = this.items.findIndex(item => {
			return item.cell !== undefined && item.row !== undefined && item.cell == cell && item.row == row;
		})
		return isOccupied == -1;
	}
	getSlot(cell, row) {
		let slot = this.items.find(item => {
			return item.cell !== undefined && item.row !== undefined && item.cell == cell && item.row == row;
		})
		return slot;
	}
	getNextFreeSlot() {
		let freeSlot = undefined;
		for (var row = 0; row < this._rows; row++) {
			for (var cell = 0; cell < this._cells; cell++) {
				if (this.isSlotFree(cell, row)) {
					if (freeSlot) continue;
					freeSlot = {
						cell: cell,
						row: row
					}
				}
			}
		}
		return freeSlot;
	}
	get max_weight() {
		return this._max_weight;
	}
	get cur_weight() {
		let c = this.items.reduce((acc, cur) => {
			return acc + (cur.weight * cur.count);
		}, 0)
		return c;
	}
	drawweight() {
		//console.log("drawweight");
		let w = $("#" + this.name.toLowerCase() + " .weight");
		$(w).width((100 / this.max_weight * this.cur_weight) + "%")
	}
	render() {
		//console.log("render");
		let body = $("#" + this.name.toLowerCase() + " .items");
		this.cells();
		this.drawweight();
		$(body).html("");
		let re_renderCells = false;
		this.items.forEach(item => {
			let tCell = -1;
			let tRow = -1;
			let slot = this.getNextFreeSlot();
			if (!slot && item.html == undefined) return;
			if (slot) {
				tCell = slot.cell;
				tRow = slot.row;
			}
			if ((item.row !== undefined) && (item.cell !== undefined)) {
				let s_data = this.getSlot(item.cell, item.row);
				if (this.isSlotFree(item.cell, item.row) || (generateName(s_data) == generateName(item))) {
					tCell = item.cell;
					tRow = item.row;
				}
			}
			if (tCell == -1 || tRow == -1) return;
			if (!item.image) item.image = "https://via.placeholder.com/256x256?text=" + item.name
			item.row = tRow;
			item.cell = tCell;
			let abs = this.getAbsoluteBySlot(item.cell, item.row);
			if (abs == false) {
				abs = this.getAbsoluteBySlotCalculation(item.cell, item.row)
				re_renderCells = true;
			};
			let a = $(`<div data-cell=${item.cell} data-row=${item.row} data-item='${JSON.stringify(item)}' class='item' style='top:${abs.top}px;left:${abs.left}px'></div>`);
			$(a).html(`<div class="c">${(item.count > 1 ? item.count : '')}</div><img src="${item.image}"></img>`)
			let x = body.append(a);
			item.html = a;
		})
		if (re_renderCells) {
			this.cells();
		}
	}
	emit(event, data) {
		document.dispatchEvent(new CustomEvent(event, {
			'detail': data
		}));
	}
	canFit(cell, row, item_data) {
		//console.log("canFit",cell, row, item_data);
		let name = generateName(item_data);
		if (this.isSlotFree(cell, row)) return true;
		let slot = this.getSlot(cell, row);
		if (!slot) return false;
		if (slot.name == name) return true;
		return false;
	}
	hasItem(data) {
		//console.log("hasItem",data);
		let slot = this.items.find(item => {
			return generateName(item) == generateName(data);
		})
		return slot !== undefined ? slot : false;
	}
	addItem(item_data) {
		//console.log("addItem",item_data);
		let item_origin = this.hasItem(item_data);
		if (item_origin) {
			//console.log("item_data", item_data);
			//console.log("item_origin", item_origin);
			item_origin.count += item_data.count;
		} else {
			//console.log("new item");
			if (this.canFit(item_data.cell, item_data.row, item_data)) {
				this.items.push(item_data);
			} else {
				return false;
			}
		}
		//console.log("addItem", true)
		this.render();
		return true;
	}
	removeItem(item_data) {
		//console.log("removeItem",item_data);
		let isOccupied = this.items.findIndex(item => {
			return item.cell !== undefined && item.row !== undefined && item.cell == item_data.cell && item.row == item_data.row && generateName(item) == generateName(item_data) && item.count == item_data.count;
		})
		this.items.splice(isOccupied, 1)
		//console.log((this.items.length / this.cell_count) <= this._rows)
		if ((this.items.length / this.cell_count) <= this._rows) {
			this.cells();
			//console.log("render new cells");
		}
		this.render();
	}
	modifyItem(item_data, mod) {
		//console.log("modifyItem(item_data,mod)", item_data, mod);
		let item_origin = this.hasItem(item_data);
		if (item_origin) {
			Object.assign(item_origin, mod);
			this.render();
		};
	}
	async load(items = []) {
		//console.log("load",items);
		let self = this;
		this.items = items;
		//console.log("items", this.items);
		let cell_count = Math.ceil($("#" + this.name.toLowerCase()).width() / cell_size);
		this.cell_count = cell_count;
		if ((this.items.length > cell_count * this.maxRows) && (this.maxRows != 0)) {
			//console.log("splice")
			this.items.splice(7, this.items.length)
		}
		//console.log("this.selector", this.name);
		//console.log("this.items", this.items);
		this.render();
		//this.toggle();
	}

	toggle(toggled = false) {
		//console.log("toggle",toggled);
		this._toggled = toggled;
		$("#" + this.name.toLowerCase()).css({
			"display": this._toggled ? "block" : "none"
		})
		this.render();
	}
	/**
	 * [serialize description]
	 * @return {[object]} json-ish string with content of storage unit.
	 */
	serialize() {
		return JSON.stringify(this.items);
	}
}
//CustomHadnler class extends StorageHandler
//
var CustomStorageHandler = class extends StorageHandler {
	constructor(selector, name, options) {
		super(selector, name, 0);
		//console.log(this);
	}
	render() {}
	cells() {}
}
// Initialise Waves with the config
document.addEventListener("init", function(e) {
	//console.log("event", e)
});
document.addEventListener("onItemClick", function(e) {
	//console.log("event", e)
	let target = e.detail.target;
	//console.log($(target).find("img"));
	let item_data = $(target).data("item");
	let position = e.detail.eventData.originalEvent;
	jQuery({
		Counter: 1
	}).animate({
		Counter: 0.9
	}, {
		step: function(now, fx) {
			$(target).find("img").css({
				'transform': `scale(${now})`
			});
		},
		done: function() {
			jQuery({
				Counter: 0.9
			}).animate({
				Counter: 1
			}, {
				step: function(now, fx) {
					$(target).find("img").css({
						'transform': `scale(${now})`
					});
				},
				done: function() {
					//console.log("trigger item use", item_data);
					//mp.trigger("cef:inventory:ready", item_data);
				},
				duration: 50
			}, 'linear');
		},
		duration: 50
	}, 'linear');
});
document.addEventListener("onItemDragStart", function(e) {
	//console.log("onItemDragStart", e)
	DragHandler.Handle(e.detail.eventData, e.detail.target, e.detail.origin);
	//DragHandler
});
document.addEventListener("onItemMouseDown", function(e) {
	//console.log("onItemMouseDown", e)
	DragHandler.prep(e.detail.eventData, e.detail.target, e.detail.origin);
	//DragHandler
});
document.addEventListener("onItemDragCancel", function(e) {
	//console.log("onItemDragCancel", e)
	DragHandler.clear();
	//DragHandler
});
document.addEventListener("onItemContextMenu", function(e) {
	//console.log("onItemContextMenu", e)
	//DragHandler
	ContextHandler.open(e.detail.eventData, e.detail.target, e.detail.origin)
});
document.addEventListener("onItemDrop", function(e) {
	//console.log("onItemDrop", e)
});
document.addEventListener("onItemClick", function(e) {
	//console.log("onItemClick", e)
});
document.addEventListener("onItemAction", function(e) {
	//console.log("onItemAction", onItemAction)
});
//let eqip = new CustomStorageHandler("body", "Equipment",{
//	style:"width:300px;height:500px",
//});
var registeredContainers = [];
/**
 * [addUnit adds storage unit]
 * @param {string} parent   parent selector for storage unit
 * @param {string} selector desired selector ( also headline ) for selector
 * @param {object} options  settings for custom object, null if normal
 * @param {int} max_rows max number of rows for normal unit ( 0 = unlimited )
 */
function addUnit(parent, selector, options, max_rows) {
	if (options == null) {
		registeredContainers[selector] = new StorageHandler(parent, selector, max_rows);
	} else {
		// TODO CUSTOM CONTAINER
	}
	return registeredContainers[selector];
}
/**
 * [editStorageMaxWeight description]
 * @param  {string} selector   selector for unit
 * @param  {float} max_weight max weight
 */
function editStorageMaxWeight(selector, max_weight) {
	if (registeredContainers[selector]) {
		registeredContainers[selector].weight = max_weight;
	}
}
/**
 * [loadStorage description]
 * @param  {string} selector selector for unit
 * @param  {array} items    array of items
 */
function loadStorage(selector, items) {
	if (registeredContainers[selector]) {
		//console.log("load items", items);
		registeredContainers[selector].load(items);
	}
}
/**
 * [toggleStorage description]
 * @param  {string} selector
 * @param  {bool} state
 */
function toggleStorage(selector, state) {
	if (registeredContainers[selector]) {
		registeredContainers[selector].toggle(state)
	}
}
var inventory;
//console.log(typeof mp);
if (typeof mp == "undefined") {
	//console.log("undefined1")
	/*	let rucksack = new StorageHandler("#character_storage", "Rucksack", 1)
		rucksack.toggle(true);
		rucksack.weight = 50;*/
	inventory = new StorageHandler("#character_storage", "Inventar")
	inventory.weight = 250;
	inventory.load([{
		name: "Melone",
		count: 100,
		type: "Nahrung",
		weight: 0.1
	}, {
		name: "Melone",
		count: 100,
		type: "Nahrung",
		weight: 0.1
	}, {
		name: "Melone",
		count: 100,
		type: "Nahrung",
		weight: 0.1
	}, {
		name: "Melone",
		count: 100,
		type: "Nahrung",
		weight: 0.1
	}, {
		name: "Melone",
		count: 100,
		type: "Nahrung",
		weight: 0.1
	}, {
		name: "Melone",
		count: 100,
		type: "Nahrung",
		weight: 0.1
	}, {
		name: "Melone",
		count: 100,
		type: "Nahrung",
		weight: 0.1
	}, {
		name: "Melone",
		count: 100,
		type: "Nahrung",
		weight: 0.1
	}, {
		name: "Melone",
		count: 100,
		type: "Nahrung",
		weight: 0.1
	}, {
		name: "Melon2e",
		count: 120,
		type: "Nahrung",
		weight: 0.1
	}, {
		name: "Reisepass",
		count: 120,
		type: "Papiere",
		weight: 0.001,
		cell: 4,
		row: 4
	}])
	inventory.toggle(true);
	let kofferraum = new StorageHandler("body", "Kofferraum")
	kofferraum.weight = 550;
	kofferraum.load([{
		image: "../../source/img/melone.png",
		name: "Melone",
		count: 100,
		type: "Nahrung",
		weight: 0.1
	}, {
		image: "../../source/img/eisen.png",
		name: "Eisen",
		count: 21,
		type: "Rohstoff",
		weight: 0.4
	}, {
		image: "../../source/img/m4.png",
		name: "M4 Sturmgewehr",
		count: 1,
		id: "SN8472095",
		type: "Waffe",
		weight: 1.3
	}, {
		image: "../../source/img/m4.png",
		name: "M4 Sturmgewehr",
		count: 1,
		id: "SN8472094",
		type: "Waffe",
		weight: 1.3
	}, {
		image: "../../source/img/ak47.png",
		name: "Ak47 Sturmgewehr",
		count: 1,
		id: "SN8472093",
		type: "Waffe",
		weight: 1.3
	}, {
		image: "../../source/img/assault_rifle.png",
		name: "Assault Sturmgewehr",
		count: 1,
		id: "SN8472091",
		type: "Waffe",
		weight: 1.3
	}, {
		image: "../../source/img/heavy-revolver.png",
		name: "Heave Revolver",
		count: 1,
		id: "SN847202",
		type: "Waffe",
		weight: 1.3
	}])
	kofferraum.toggle(true)
}
$(document).ready(function(event) {
	mp.trigger("cef:inventory:ready");
});