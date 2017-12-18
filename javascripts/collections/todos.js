var Todos = Backbone.Collection.extend({
  model: Todo,
  addTodo: function(todo) {
    var ids = this.pluck("id");
    if (this.length === 0) {
      todo['id'] = 0;
    } else {
     todo['id'] = _.max(ids, function(id){ return id; }) + 1;
    }
    this.add(todo);
  },

  comparator: function (a, b) {
    if (a.get('complete') && !b.get('complete')) {
      return 1;
    } else if (!a.get('complete') && b.get('complete')) {
      return -1;
    };

    var year = a.get('year') - b.get('year');
      if (year === 0) {
          return a.get('month') < b.get('month') ? -1 : 1;
        }

    return year;
  },
})