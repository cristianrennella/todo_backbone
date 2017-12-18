App = {
  loadTodosFromLocalStorage: function() {
      if (localStorage.getItem('todos')) {
        return JSON.parse(localStorage.getItem("todos"));
      };
  },
  saveToLocalStorage: function() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  },
  renderTodos: function(selection = "All") {
    var storedTodos = this.loadTodosFromLocalStorage();
    this.todos = new Todos(storedTodos);
    this.todosView = new TodosView({ collection: this.todos, selection: selection });
  },
  getTotalTodos: function(selection) {
    return _.where(this.todos.toJSON(), selection).length;
  },
  renderHeaderTodos: function(selection) {
      this.todosHeaderView = new TodosHeaderView({ collection: this.todos, selection: selection, count: this.getTotalTodos(selection) });
  },
  renderNav: function() {
    this.listsView = new ListsView({ collection: this.todos });
  },
  renderHeaderNav: function() {
    this.headerListView = new HeaderListView({ collection: this.todos });
    this.headerListView.select();
  },
  renderCompletedNav: function() {
    this.ListsCompletedView = new ListsCompletedView({ collection: this.todos });
  },
  renderCompletedHeaderNav: function() {
    new HeaderCompletedListView({ collection: this.todos });
  },
  listSelected: function(selection) {
    this.renderTodos(selection);
    this.renderHeaderTodos(selection);
  },
  renderForm: function(e) {
    e.preventDefault();
    this.form = new NewTodoView();
    $('#modal_container').html(this.form.$el);
  },
  renderEditForm: function(id) {
    this.form = new EditTodoView(this.todos.get(id));
    $('#modal_container').html(this.form.$el);
  },
  addTodo: function(todo) {
    this.todos.addTodo(todo);
  },
  removeModal: function(e) {
    this.form.remove();
  },
  closeModal: function(e) {
    if (e.target.id === 'modal') {
      this.removeModal();
    };
  },
  removeClassActive: function() {
    $('ul').removeClass('active');
    $('li').removeClass('active');
  },
  bindEvents: function() {
    _.extend(this, Backbone.Events);
    this.on("listSelected", this.listSelected.bind(this));
    this.on("saveToLocalStorage", this.saveToLocalStorage.bind(this));
    this.on("addTodo", this.addTodo.bind(this));
    this.on("removeModal", this.removeModal.bind(this));
    this.on("closeModal", this.closeModal.bind(this));
    this.on("renderEditForm", this.renderEditForm.bind(this));
    this.on("renderAllViews", this.renderAllViews.bind(this));
    this.on("removeClassActive", this.removeClassActive.bind(this));
    $('#add_new').on('click', this.renderForm.bind(this));
    this.listenTo(this.todos, "all", this.saveToLocalStorage);
  },
  renderAllViews: function() {
    this.renderTodos();
    this.renderHeaderTodos();
    this.renderNav();
    this.renderHeaderNav();
    this.renderCompletedNav();
    this.renderCompletedHeaderNav();
  },
  init: function() {
    this.$todo = $("#todos_list");
    this.$nav = $("#lists_nav");
    this.$navCompleted = $("#total_completed_todos");

    this.renderAllViews();

    this.bindEvents();
  },
};

App.init();

Handlebars.registerHelper("hasValue", function(value) {
  return value;
});