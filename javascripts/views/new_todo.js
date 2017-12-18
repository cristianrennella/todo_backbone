var NewTodoView = Backbone.View.extend({
  template: Handlebars.compile($('#todo_form').html()),

  events: {
    'click #modal': 'removeModal',
    submit: "create"
  },

  removeModal: function(e) {
    App.trigger('closeModal', e);
  },

  render: function() {
    this.$el.html(this.template());
  },
  createTodoObject: function(jsonData) {
    var newTodoObject = { year: "", month: "" };

    jsonData.forEach(function(data) {
      newTodoObject[data.name] = data.value;
    });

    newTodoObject['complete'] = false;

    return newTodoObject;
  },
  create: function(e) {
    e.preventDefault();
    var $f = this.$("form"),
        data = $('form').serializeArray(),
        jsonData = JSON.parse(JSON.stringify(data)),
        newTodo = this.createTodoObject(jsonData);

    App.trigger('addTodo', newTodo);
    App.trigger('removeModal');
    App.trigger('saveToLocalStorage');
    App.trigger('renderAllViews');
  },
  initialize: function() {
    this.render();
  }
});