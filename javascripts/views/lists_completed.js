var ListsCompletedView = Backbone.View.extend({
  el: "#lists_completed_nav",

  events: {
    "click li": "listSelected"
  },
  
  template: Handlebars.compile($('#lists_completed_template').html()),

  toggleActive: function($li){
    App.trigger('removeClassActive');
    $li.addClass('active');
  },

  listSelected: function(e) {
    e.preventDefault(e);

    var $li = $(e.target).closest('li');
    
    var month = $li.find('a').data('month'),
        year = $li.find('a').data('year');

    this.toggleActive($li);

    App.trigger('listSelected', {month: String(month), year: String(year), complete: true});
  },

  getMonthAndYear: function(month, year){
    if (month && year) {
      return month + '/' + year;
    } else {
      return 'No Due Date';
    };
  },

  createList: function() {
    this.lists = [];

    var completedTodos = _.filter(this.collection.toJSON(), function(todo){ return todo.complete === true; });

    completedTodos.forEach(function(todo) {
      var existing = _.findWhere(this.lists, {month: todo.month, year: todo.year});

      if (existing) {
        existing.total += 1;
      } else {
        this.lists.push(
        {
          id: this.lists.length,
          month: todo.month, 
          year: todo.year, 
          monthAndYear: this.getMonthAndYear(todo.month, todo.year), 
          total: 1
        })
      }
    }.bind(this));
  },
  render: function() {
    this.createList();
    this.$el.html(this.template({ lists: this.lists }));
  },
  bindEvents: function() {
    this.listenTo(this.collection, "all", this.render);
  },
  initialize: function() {
    this.bindEvents();
    this.render();
  },
});