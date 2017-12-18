var TodosView = Backbone.View.extend({
  el: "#todos_list",

  events: {
    "click input[type=checkbox]": "toggleComplete",
    "click span.trash": "removeTodo",
    "click a.todo_title_list": "editTodo"
  },
  
  template: Handlebars.compile($('#todos_template').html()),
  
  editTodo: function(e) {
    e.preventDefault(e);

    var id = +$(e.target).closest('li').data('id');
    App.trigger('renderEditForm', id);
  },

  removeTodo: function(e) {
    e.preventDefault(e);

    var id = +$(e.target).closest('li').data('id');
    this.collection.remove(id);
  },

  toggleComplete: function(e) {
    e.preventDefault(e);

    var $todo = $(e.target),
        id = $todo.closest('li').data('id');

    this.collection.get(id).toggleComplete();
    this.collection.sort();
    App.trigger('saveToLocalStorage');
  },

  render: function() {
    if (this.selection === 'All') {
      this.$el.html(this.template({ todos: this.collection.toJSON() }));
    } else {
      this.$el.html(this.template({ todos: _.where(this.collection.toJSON(), this.selection) }));
    }
  },
  
  bindEvents: function() {
    this.listenTo(this.collection, "all", this.render);
  },
  
  initialize: function() {
    this.selection = arguments[0].selection;

    this.bindEvents();
    this.render();
  },
});