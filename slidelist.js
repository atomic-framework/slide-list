/**
 * === CLASS SlideList ===
 *
 * A class that will keep track and manipulate a 
 * (nested) list of slide ids.
 *
 */

function SlideList(list) {
  var list = list || [];
  this.init(list);
}

SlideList.prototype.init = function (list) {
  this.list = list;
  this.current = {h:0, v:0};
}

// Total number of items in list (length of flattended array)
SlideList.prototype.size = function() {
  var flat = [];
  flat = flat.concat.apply(flat, this.list);
  return flat.length;
}

/**
  * Retrieves the list item at provided index. Falls back to
  * providing current item if no index provided
  *
  * @param {Number} h If specified, the returned
  * list item will be for this horizontal index
  * rather than the current one
  *
  * @param {Number} v If specified, the returned
  * list item will be for this vertical index
  * rather than the current one
  *
  * @return {String} list item
  */
SlideList.prototype.get = function (h, v) {
  var itemType;
  // Use current if no index provided
  if (h === undefined) {
    h = this.current.h;
    v = this.current.v;
  }
  v = v || 0;
  itemType = this.getType(h);
  if (itemType) {
    if (itemType === 'list') {
      return this.list[h][v];
    }
    // If v is not 0 or undefined
    else if (!v) {
      return this.list[h];
    }
  }
  return undefined;
}

SlideList.prototype.getIndex = function (item) {
  var h = this.list.indexOf(item);
  var index;
  if (item) {
    if (h > -1) {
      return {h: h, v: 0}
    }
    // Need to look in nested lists
    else {
      // TODO: improve loop so that we stop when we find it
      this.list.forEach(function(list, i) {
        if (typeof list !== 'string') {
          h = list.indexOf(item);
          if (h > -1) {
            index = {h: i, v: h}
          }
        }
      });
      return index;
    }
  }
  else {
    return this.current;
  }
  return undefined;
}

// An item in the list can be either "item" or "list"
SlideList.prototype.getType = function(h) {
  // In range?
  if (h > -1 && h < this.list.length) {
    // TODO: improve type check
    if (typeof this.list[h] === 'string') {
      return "item";
    }
    else {
      return "list";
    }
  }
  return undefined;
}

// Check if there is an item at the provided indices
SlideList.prototype.inRange = function (h) {
  if (h > -1 && h < this.list.length) {
    return true;
  }
  return false;
}

// Compare two indices to see if they are equal
// TODO: make into class method
SlideList.prototype.isEqual = function (i1, i2) {
  if (JSON.stringify(i1) === JSON.stringify(i2)) {
    return true;
  }
  return false;
}

SlideList.prototype._set = function(index) {
  var previous = this.current;
  // Setting by name
  // if (typeof index === 'string') {
  //   index = getIndex(index);
  // }
  // if (index > -1 && index < list.length) {
    this.current = index;
  // }
  //
}


SlideList.prototype.getList = function () {
  return this.list;
 }

SlideList.prototype.setList = function(arr) {
  var currentId = this.get();
  var newIndex;
  this.list = arr;
  newIndex = this.getIndex(currentId);
  if (!this.inRange(this.current.h) || !newIndex) {
    this._set({h:0, v:0});
  }
  else {
    this._set(newIndex);
  }
};

// TODO: properly handle non-existing strings
SlideList.prototype.goTo = function(index) {
  index = index || {h:0, v:0};
  // Setting by name
  if (typeof index === 'string') {
    index = this.getIndex(index);
  }
  index.h = index.h || 0;
  index.v = index.v || 0;
  if (this.get(index.h, index.v)) {
    this._set(index);
  }
}

// Should only move horizontally
SlideList.prototype.left = function() {
   var index = {h: this.current.h - 1, v: 0};
   if (this.get(index.h)) {
     this._set(index);
   }
 };

// Should only move horizontally
SlideList.prototype.right = function () {
  var index = {h: this.current.h + 1, v: 0};
  if (this.get(index.h)) {
    this._set(index);
  }
};

// Should only move vertically
SlideList.prototype.down = function() {
 var index = {h: this.current.h, v: this.current.v + 1};
 if (this.get(index.h, index.v)) {
   this._set(index);
 }
};

// Should only move vertically
SlideList.prototype.up = function() {
 var index = {h: this.current.h, v: this.current.v - 1};
 if (this.get(index.h, index.v)) {
   this._set(index);
 }
};

SlideList.prototype.getUp = function() {
  var upIndex = {h: this.current.h, v: this.current.v - 1};
  var itemAbove = this.get(upIndex.h, upIndex.v);
  if (itemAbove) {
    return upIndex;
  }
  return undefined;
}
SlideList.prototype.getDown = function() {
  var downIndex = {h: this.current.h, v: this.current.v + 1};
  var itemBelow = this.get(downIndex.h, downIndex.v);
  if (itemBelow) {
    return downIndex;
  }
  return undefined;
}
SlideList.prototype.getRight = function() {
  var rightIndex = {h: this.current.h + 1, v: 0};
  var itemRight = this.get(rightIndex.h, 0);
  if (itemRight) {
    return rightIndex;
  }
  return undefined;
}
SlideList.prototype.getLeft = function() {
  var leftIndex = {h: this.current.h - 1, v: 0};
  var itemLeft = this.get(leftIndex.h, 0);
  if (itemLeft) {
    return leftIndex;
  }
  return undefined;
}

// Return the ids of any available neighbor
// @return [leftId, upId, rightId, downId]
SlideList.prototype.getNeighbors = function(index) {
  var indices = [];
  // var index = index || this.getIndex();
  // ids[0] = this.get(index.h - 1, 0); // left
  // ids[1] = this.get(index.h, index.v - 1); // up
  // ids[2] = this.get(index.h + 1, 0); // right
  // ids[3] = this.get(index.h, index.v + 1); // down
  indices[0] = this.getLeft();
  indices[1] = this.getUp();
  indices[2] = this.getRight();
  indices[3] = this.getDown();
  return indices;
}

// Return the next item available (down or right)
SlideList.prototype.getNext = function() {
   // See if there is an item below to go to
   // else go to the next item to the right if available
   var downIndex = {h: this.current.h, v: this.current.v + 1};
   var rightIndex = {h: this.current.h + 1, v: 0};
   var itemBelow = this.get(downIndex.h, downIndex.v);
   var itemRight;
   if (itemBelow) {
     return downIndex;
   }
   else {
     itemRight = this.get(rightIndex.h, 0);
     if (itemRight) return rightIndex;
   }
   return undefined;
}

// Should move vertically if possible
SlideList.prototype.next = function() {
  var nextItem = this.getNext();
  if (nextItem) this._set(nextItem);
};

// Should move vertically if possible
SlideList.prototype.previous = function() {
  // See if there is an item above
  var upIndex = {h: this.current.h, v: this.current.v - 1};
  var leftIndex = {h: this.current.h - 1, v: 0};
  var itemAbove = this.get(upIndex.h, upIndex.v);
  var itemLeft, leftType;

  if (itemAbove) {
    this._set(upIndex);
  }
  else {
   // See if previous item is a list or a string
   leftType = this.getType(leftIndex.h);
   if (leftType === 'item') {
     this._set(leftIndex);
   }
   else if (leftType === 'list') {
     // Find last item in list
     leftIndex.v = this.list[leftIndex.h].length - 1;
     this._set(leftIndex);
   }
  }
};

SlideList.prototype.gotoFirst = function() {
  this._set({h:0, v:0});
};

// TODO: make this actually go to last if nested array
SlideList.prototype.gotoLast = function() {
  this._set({h:this.list.length - 1, v:0});
};

SlideList.prototype.append = function(item) {
  // var previous = list.slice();
  this.list.push(item);
};

SlideList.prototype.prepend = function(item) {
  // var previous = list.slice();
  this.list.unshift(item);
  this._set({h: this.current.h + 1, v: 0});
};

SlideList.prototype.insert = function(item, index) {
  // var previous = get(index.h, index.v);
  var prevType = this.getType(index.h);

  // if (prevType === 'item') {
    this.list.splice(index.h, 0, item);
    if (index.h <= this.current.h) this._set({h: this.current.h + 1, v: 0});
  // }
  // else if (prevType === 'list' && typeof item === 'string') {
  //   this.list[index.h].splice(index.v, 0, item);
  //   if (index.h === this.current.h && index.v <= this.current.v) {
  //     this._set({h: index.h, v: this.current.v + 1});
  //   }
  // }
};

SlideList.prototype.insertNested = function(item, index) {
  var prevType = this.getType(index.h);
  if (prevType === 'list' && typeof item === 'string') {
    this.list[index.h].splice(index.v, 0, item);
    if (index.h === this.current.h && index.v <= this.current.v) {
      this._set({h: index.h, v: this.current.v + 1});
    }
  }
};

SlideList.prototype.replace = function(index, item) {
  var previous;
  var prevType;

  if (typeof index === 'string') {
   previous = index;
   index = this.getIndex(index);
  }
  else {
   previous = this.get(index.h, index.v);
  }

  prevType = this.getType(index.h);

  if (prevType === 'list' && typeof item === 'string') {
   // Replace single item in nested list
   this.list[index.h].splice(index.v, 1, item);
  }
  else if (prevType === 'item' || prevType === 'list') {
   // Replace entire nested list or string item
   this.list.splice(index.h, 1, item);
  }
};

SlideList.prototype.remove = function(index) {
  var previous;
  var prevType;

  if (typeof index === 'string') {
   previous = index;
   index = this.getIndex(index);
  }
  else {
   previous = this.get(index.h, index.v);
  }

  prevType = this.getType(index.h);

  if (prevType === 'list' && index.v !== undefined) {
   // Replace single item in nested list
   this.list[index.h].splice(index.v, 1);
  }
  else if (prevType === 'item' || prevType === 'list') {
   // Replace entire nested list or string item
   this.list.splice(index.h, 1);
  }
};

SlideList.prototype.move = function(from, to) {
  var item, itemAtIndex, itemType, locationType;

  if (typeof from === 'string') {
    item = from;
    from = this.getIndex(from);
  }
  else {
    item = this.get(from.h, from.v);
  }

  if (typeof to === 'string') {
    itemAtIndex = to;
    to = this.getIndex(to);
  }
  else {
    itemAtIndex = this.get(to.h, to.v);
  }

  itemType = this.getType(from.h);
  locationType = this.getType(to.h);

  if (itemType === 'item' && locationType === 'item') {
    // Move single item to single item location
    if (from.h < to.h) to.h = to.h - 1; // Make sure location index is correct after removing item
    this.list.splice(from.h, 1);
    this.list.splice(to.h, 0, item);
  }
  else if (itemType === 'item' && locationType === 'list') {
   if (to.v !== undefined) {
     // Move single item into nested list
     if (from.h < to.h) to.h = to.h - 1; // Make sure location index is correct after removing item
     this.list.splice(from.h, 1);
     this.list[to.h].splice(to.v, 0, item);
   }
   else {
     // Move single item to nested list location
     if (from.h < to.h) to.h = to.h - 1; // Make sure location index is correct after removing item
     this.list.splice(from.h, 1);
     this.list.splice(to.h, 0, item);
   }
  }
  else if (itemType === 'list' && locationType === 'item') {
    if (from.v !== undefined) {
     // Move item in nested list to single item location
     // TODO: check if item is the only one in nested list, if so nested list should be removed
     this.list[from.h].splice(from.v, 1);
     this.list.splice(to.h, 0, item);
    }
    else {
     // Move nested list to single item location
     if (from.h < to.h) to.h = to.h - 1; // Make sure location index is correct after removing item
     this.list.splice(from.h, 1);
     this.list.splice(to.h, 0, item);
    }
  }
  else if (itemType === 'list' && locationType === 'list') {
    if (to.v !== undefined && from.v !== undefined) {
     // Move item in nested list into a nested list
     // TODO: check if item is the only one in nested list, if so nested list should be removed
     if (from.h === to.h && from.v < to.v) to.v = to.v - 1;
     this.list[from.h].splice(from.v, 1);
     this.list[to.h].splice(to.v, 0, item);
    }
    else if (to.v === undefined && from.v === undefined) {
     // Move nested list to nested list location
     if (from.h < to.h) to.h = to.h - 1; // Make sure location index is correct after removing item
     this.list.splice(from.h, 1);
     this.list.splice(to.h, 0, item);
    }
    else if (to.v === undefined && from.v !== undefined) {
     // Move item in nested list to nested list location
     // TODO: check if item is the only one in nested list, if so nested list should be removed
     this.list[from.h].splice(from.v, 1);
     this.list.splice(to.h, 0, item);
    }
  }
};