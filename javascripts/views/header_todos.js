var TodosHeaderView = Backbone.View.extend({
  el: "header",
  
  template: Handlebars.compile($('#header_todos').html()),
  
  render: function() {
    this.$el.html(this.template({ name: this.getName(), total: this.getTotal() }));
  },
  getTotal: function() {
    return this.count;
  },
  getName: function() {
    if (this.selection) {
      if (this.selection.complete) {
        return "Completed";
      } else if (this.selection.month === "" && this.selection.year === "") {
        return "No Due Date";
      } else {
        return this.selection.month + '/' + this.selection.year;
      }
    } else {
      return "All Todos";
    }
  },
  bindEvents: function() {
    this.listenTo(this.collection, "all", this.render);
  },
  initialize: function() {
    this.selection = arguments[0].selection;
    this.count = arguments[0].count;
    this.bindEvents();
    this.render();
  },
});