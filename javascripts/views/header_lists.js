var HeaderListView = Backbone.View.extend({
  el: "#header_list_all",

  events: {
    "click": 'handleClick'
  },
  
  template: Handlebars.compile($('#header_list').html()),

  handleClick: function(e) {
    e.preventDefault();
    $(e.target).closest('li').addClass('active');
    App.trigger('renderAllViews');
  },

  select: function(){
    this.$el.addClass('active');
  },
  
  render: function() {
    this.$el.html(this.template({ total: this.getTotal() }));
  },
  getTotal: function() {
    return this.collection.models.length;
  },
  bindEvents: function() {
    this.listenTo(this.collection, "all", this.render);
  },
  initialize: function() {
    this.bindEvents();
    this.render();
  },
});