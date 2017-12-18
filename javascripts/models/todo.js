var Todo = Backbone.Model.extend({
  toggleComplete: function() {
    this.set({complete: !this.get('complete')});
  },
});