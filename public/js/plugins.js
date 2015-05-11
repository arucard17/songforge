
// DeepClone
_.cloneToDeep = _.clone = function(obj, depth) {
  if (typeof obj !== 'object') return obj;
  var clone = _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  if (!_.isUndefined(depth) && (depth > 0)) {
    for (var key in clone) {
      clone[key] = _.clone(clone[key], depth-1);
    }
  }
  return clone;
};

// IsFloat
function is_float (n) {
    return +n === n && !!(n % 1);
}

// Is Int
function is_int (mixed_var) {
    return mixed_var === ~~mixed_var;
}