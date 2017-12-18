var EditTodoView = Backbone.View.extend({
  template: Handlebars.compile($('#todo_form').html()),

  events: {
    'click #complete': 'markAsComplete',
    'click #modal': 'closeModal',
    submit: "edit"
  },

  markAsComplete: function(e) {
    this.todo.set('complete', true);
  }, 

  closeModal: function(e) {
    App.trigger('closeModal', e);
  },

  render: function() {
    this.$el.html(this.template(this.todo.toJSON()));
  },
  editTodoObject: function(jsonData) {
    jsonData.forEach(function(data) {
      this.todo.set(data.name, data.value);
    }.bind(this));
  },

  edit: function(e) {
    e.preventDefault();
    var $f = this.$("form"),
        data = $('form').serializeArray(),
        jsonData = JSON.parse(JSON.stringify(data));
    
    this.editTodoObject(jsonData);
    App.trigger('removeModal');
    App.trigger('saveToLocalStorage');
  },
  initialize: function(todo) {
    this.todo = todo;
    this.render();
  }
});