var HeaderCompletedListView = Backbone.View.extend({
  el: "#header_list_completed",

  events: {
    "click": 'handleClick'
  },
  
  template: Handlebars.compile($('#header_completed_list').html()),

  handleClick: function(e) {
    e.preventDefault();
    App.trigger('removeClassActive');
    $(e.target).closest('li').addClass('active');
    App.trigger('listSelected', { complete: true });
  },

  select: function(){
    this.$el.addClass('active');
  },
  render: function() {
    this.$el.html(this.template({ total: this.getTotal() }));
  },
  getTotal: function() {
    var completedTodos = _.filter(this.collection.toJSON(), function(todo){ return todo.complete === true; });
    return completedTodos.length;
  },
  bindEvents: function() {
    this.listenTo(this.collection, "all", this.render);
  },
  initialize: function() {
    this.bindEvents();
    this.render();
  },
});