var Todo = {
  update: function (title, day, month, year, description){
    this.title = title;
    day ? this.day = day : this.day = '';
    if (month && year) {
      this.month = month;
      if (year) {
        year.length === 4 ? this.year = year.substring(2) : this.year = year;
      }
    } else {
      this.month = '';
      this.year = '';
    };

    this.description = description;
  },

  markComplete: function() {
    this.complete = true;
  },

  markUnComplete: function() {
    this.complete = false;
  },

  toggleComplete: function() {
    this.complete = !this.complete;
  },

  init: function (id, title, day, month, year, description, complete = false){
    this.id = id;
    this.update(title, day, month, year, description);
    this.complete = complete;
    return this;
  },
};

var App = {
  $addNew: $('#add_new'),
  $modal: $('#modal'),
  $submit: $('button[type=submit]'),
  $complete: $('#complete'),
  $title: $('#title'),
  $day: $('#day'),
  $month: $('#month'),
  $year: $('#year'),
  $description: $('#description'),
  $todoList: $('#todos_list'),
  $totalTodos: $('#total_todos'),
  $totalCompletedTodos: $('#total_completed_todos'),
  $nav: $('nav'),
  $list: $('.list'),
  $listsNav: $('#lists_nav'),
  $listsCompletedNav: $('#lists_completed_nav'),
  $currentTotal: $('#current_total'),
  $currentName: $('#current_name'),
  $listComplete: $('#list_complete'),
  todosTemplate: Handlebars.compile($('#todos_template').html()),
  listsTemplate: Handlebars.compile($('#lists_template').html()),
  listsCompletedTemplate: Handlebars.compile($('#lists_completed_template').html()),
  todos: [],
  onEdit: false,
  editTodoId: 0,
  lists: [],
  completedLists: [],
  isInList: false,
  isCompleteList: false,
  isCompleteHeader: false,

  getNewTodoId: function() {
    if (this.todos.length > 0) {
      return _.max(this.todos, function(todo){ return todo.id; }).id + 1;
    } else {
      return 0;
    }
  },

  sortTodos: function() {
    var completeTodosToTheEnd = [];

    _.each(this.todos, function(todo) {
      if (todo.complete) {
        completeTodosToTheEnd.push(todo);
      } else {
        completeTodosToTheEnd.unshift(todo);
      }
    });

    this.todos = completeTodosToTheEnd;
  },

  renderList: function() {
    this.sortTodos();
    this.$todoList.html(this.todosTemplate({todos: this.todos}));
    this.$totalTodos.text(this.todos.length);
    this.$currentTotal.text(this.todos.length);
    this.$currentName.text('All Todos');
  },

  loadTodosFromLocalStorage: function() {
    var todos = [];

    if (localStorage.getItem('todos')) {
        JSON.parse(localStorage.getItem('todos')).forEach(function(todo) {
        todos.push(Object.create(Todo).init(todo.id, todo.title, todo.day, todo.month, todo.year, todo.description, todo.complete));
      });
    };

    this.todos = todos;
  },

  saveToLocalStorage: function() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  },

  resetTodoForm: function() {
    this.$title.val('');
    this.$title[0].placeholder = 'Item 1';
    this.$day.val('');
    this.$month.val('');
    this.$year.val('');
    this.$description.val('');
    this.$description[0].placeholder = 'Description';
  },

  addNewTodo: function(e) {
    e.preventDefault();
    var day = this.$day.val() === null ? "" : this.$day.val();
    var month = this.$month.val() === null ? "" : this.$month.val();
    var year = this.$year.val() === null ? "" : this.$year.val();
    var todo = Object.create(Todo).init(this.getNewTodoId(), this.$title.val(), day, month, year, this.$description.val());
    this.todos.push(todo);
    this.saveToLocalStorage();
    this.$modal.fadeOut();
    this.$complete.off('click');
    this.$submit.off('click');
    this.resetTodoForm();
    this.renderList();
    this.renderListsNav();
    this.$list.trigger('click');
  },

  editTodo: function(e, complete = false) {
    e.preventDefault();
    var todoToUpdate = _.where(this.todos, {id: this.editTodoId})[0];
    todoToUpdate.update(this.$title.val(), this.$day.val(), this.$month.val(), this.$year.val(), this.$description.val());
    if (complete) {
      todoToUpdate.markComplete();
    };

    this.saveToLocalStorage();
    this.$modal.fadeOut();
    this.$complete.off('click');
    this.$submit.off('click');
    this.onEdit = false;
    this.sortTodos();
    this.resetTodoForm();
    if (this.isInList) {
      this.renderTodosByMonthAndYear(todoToUpdate.month, todoToUpdate.year);
    } else {
      this.renderTodosByMonthAndYear('', '', true);
    }
    this.renderListsNav();
    this.selectTab(todoToUpdate.month, todoToUpdate.year);
  },

  markAsComplete: function(e) {
    this.editTodo(e, true);
  },

  modalFadeOut: function(e) {
    if (this.$modal[0] === $(e.target)[0]) {
      this.$modal.fadeOut();
      this.resetTodoForm();
    };
  },

  canNotMarkAsComplete: function(e) {
    e.preventDefault();
    alert('You can not mark a Todo as complete when you are creating one.');
  },

  renderTodoForm: function(e) {
    e.preventDefault();
    this.$modal.fadeIn();
    if (this.onEdit) {
      this.$submit.on('click', this.editTodo.bind(this));
      this.$complete.on('click', this.markAsComplete.bind(this));
    } else {
      this.$submit.on('click', this.addNewTodo.bind(this));
      this.$complete.on('click', this.canNotMarkAsComplete.bind(this));
    }
    this.$modal.on('click', this.modalFadeOut.bind(this));
  },

  getSelectedTodoId: function(todo) {
    return todo.closest('li').data('id');
  },

  handleDeleteTodo: function(e) {
    e.preventDefault();
    var idToDelete = this.getSelectedTodoId($(e.target));
    var todo = _.find(this.todos, function(todo){ return todo.id === idToDelete; });
    this.todos = _.reject(this.todos, function(todo){ return todo.id === idToDelete; });
    this.saveToLocalStorage();
    if (this.isInList) {
      this.renderTodosByMonthAndYear(todo.month, todo.year);
    } else {
      this.renderList();
    };

    this.renderListsNav();
  },

  fillTodoForm: function(todo) {
    this.$title.val(todo.title);
    todo.day ? this.$day.val(todo.day) : this.$day.val('');
    todo.month ? this.$month.val(todo.month) : this.$month.val('');
    todo.year ? this.$year.val('20' + todo.year) : this.$year.val('');
    this.$description.val(todo.description);
  },

  handleEditTodo: function(e) {
    e.preventDefault();
    this.editTodoId = this.getSelectedTodoId($(e.target));
    var todo = _.where(this.todos, {id: this.editTodoId})[0];
    this.onEdit = true;
    this.renderTodoForm(e);
    this.fillTodoForm(todo);
  },

  selectTab: function(month, year) {
    if (this.isCompleteList) {
      if (this.isInList) {
        if (month === '' || year === '') {
            var li = this.$listsCompletedNav.find('li').find('[data-month' + month + '][data-year' + year + ']').closest('li')[0];
            $(li).toggleClass('active');
          } else {
            var $li = this.$listsCompletedNav.find('li').find('[data-month=' + month + '][data-year=' + year + ']').closest('li');
            $li.toggleClass('active');
          }
      }
    } else {
      if (this.isInList) {
        if (month === '' || year === '') {
            var li = this.$listsNav.find('li').find('[data-month' + month + '][data-year' + year + ']').closest('li')[0];
            $(li).toggleClass('active');
          } else {
            var $li = this.$listsNav.find('li').find('[data-month=' + month + '][data-year=' + year + ']').closest('li');
            $li.toggleClass('active');
          }
      }
    }
  },

  handleCheckbox: function(e) {
    this.editTodoId = this.getSelectedTodoId($(e.target));
    var todo = _.where(this.todos, {id: this.editTodoId})[0];
    todo.toggleComplete();
    this.saveToLocalStorage();
    this.sortTodos();
    if (this.isInList || this.isCompleteHeader) {
      this.renderTodosByMonthAndYear(todo.month, todo.year);
    } else {
      this.renderList();
    };

    this.renderListsNav();
    this.selectTab(todo.month, todo.year);
  },

  handleCheckWithLi: function(e) {
    var $checkbox = $(e.target).children(":checkbox");
    $checkbox.trigger('click');
  },

  generateList: function() {
    this.lists = [];
    this.todos.forEach(function(todo) {
      var monthAndYear = '';

      if (todo.month === '' || todo.year === '') {
        monthAndYear = 'No Due Date';
      } else {
        monthAndYear = todo.month + '/' + todo.year;
      };

      var list = _.where(this.lists, {monthAndYear: monthAndYear});
      
      if (_.isEmpty(list)) {
        this.lists.push({monthAndYear: monthAndYear, month: todo.month, year: todo.year, total: 1});
      } else {
        _.first(list).total += 1;
      };
    }.bind(this));
  },

  sortByDate: function(array) {
    return _.sortBy(_.sortBy(array, 'month'), 'year');
  },

  generateCompletedList: function() {
    this.completedLists = [];
    this.todos.forEach(function(todo) {
      if (todo.complete) {
        var monthAndYear = '';

        if (todo.month === '' || todo.year === '') {
          monthAndYear = 'No Due Date';
        } else {
          monthAndYear = todo.month + '/' + todo.year;
        };

        var list = _.where(this.completedLists, {monthAndYear: monthAndYear});
        
        if (_.isEmpty(list)) {
          this.completedLists.push({monthAndYear: monthAndYear, month: todo.month, year: todo.year, total: 1});
        } else {
          _.first(list).total += 1;
        };
      };
    }.bind(this));
  },

  countCompletedTodos: function() {
    return _.reduce(this.todos, function(count, todo){ 
      if (todo.complete) {
        count += 1;
      };

      return count; 
    }, 0);
  },

  renderListsNav: function() {
    this.generateList();
    if (!_.isEmpty(this.todos)) {
      this.lists = this.sortByDate(this.lists);
      this.$listsNav.html(this.listsTemplate({lists: this.lists}));
      this.$totalTodos.text(this.todos.length);
    } else {
      this.$listsNav.html('');
      this.$totalTodos.text(0);
    };

    this.generateCompletedList();
    if (!_.isEmpty(this.completedLists)) {
      this.completedLists = this.sortByDate(this.completedLists);
      this.$listsCompletedNav.html(this.listsCompletedTemplate({lists: this.completedLists}));
      this.$totalCompletedTodos.text(this.countCompletedTodos());
    } else{
      this.$listsCompletedNav.html('');
      this.$totalCompletedTodos.text(0);
    };
  },

  renderTodosByMonthAndYear: function(month, year) {
    if (this.isCompleteHeader) {
      var todoToRender = _.where(this.todos, {complete: true});
      this.$currentName.text('Completed');
    } else {
      if (month && year) {
          var todoToRender = _.where(this.todos, {month: String(month), year: String(year)});
          this.$currentName.text(month + '/' + year);
      } else {
        var todoToRender = _.where(this.todos, {month: '', year: ''});
        this.$currentName.text('No Due Date');
      };

      if (this.isCompleteList) {
        todoToRender = _.where(todoToRender, {complete: true});
      };
    };

    this.$todoList.html(this.todosTemplate({todos: todoToRender}));
    this.$currentTotal.text(todoToRender.length);
  },

  activeMenu: function(e) {
    e.preventDefault();
    var $li = $(e.target).closest('li');
    var $nav = $li.closest('nav');
    $nav.find('li').removeClass('active');
    $li.addClass('active');
  },

  handleListSelect: function(e) {
    e.preventDefault();
    this.isCompleteHeader = false;
    this.isInList = true;
    this.isCompleteList = false;
    var month = $(e.target).data("month");
    var year = $(e.target).data("year");
    this.renderTodosByMonthAndYear(month, year);
    this.activeMenu(e);
  },

  handleCompleteListSelect: function(e) {
    e.preventDefault();
    this.isCompleteHeader = false;
    this.isInList = true;
    this.isCompleteList = true;
    var month = $(e.target).data("month");
    var year = $(e.target).data("year");
    this.renderTodosByMonthAndYear(month, year);
    this.activeMenu(e);
  },

  handleSelectWithLi: function(e) {
    var $anchor = $(e.target).children("a");
    $anchor.trigger('click');
  },

  handleShowAllList: function(e) {
    e.preventDefault();
    this.isCompleteHeader = false;
    this.$todoList.html(this.todosTemplate({todos: this.todos}));
    this.$currentTotal.text(this.todos.length);
    this.$currentName.text('All Todos');
    this.isInList = false;
    this.activeMenu(e);
  },

  handleShowCompleteList: function(e) {
    e.preventDefault();
    var completeTodos = _.where(this.todos, {complete: true});
    this.$todoList.html(this.todosTemplate({todos: completeTodos}));
    this.$currentTotal.text(completeTodos.length);
    this.$currentName.text('Completed');
    this.isInList = false;
    this.isCompleteHeader = true;
    this.activeMenu(e);
  },

  bindEvents: function() {
    this.$addNew.on('click', this.renderTodoForm.bind(this));
    this.$todoList.on('click', '.trash', this.handleDeleteTodo.bind(this));
    this.$todoList.on('click', '.todo_title_list', this.handleEditTodo.bind(this));
    this.$todoList.on('click', 'input:checkbox', this.handleCheckbox.bind(this));
    this.$todoList.on('click', 'li', this.handleCheckWithLi.bind(this));
    this.$list.on('click', this.handleShowAllList.bind(this));
    this.$listComplete.on('click', this.handleShowCompleteList.bind(this));
    this.$listsNav.on('click', 'a', this.handleListSelect.bind(this));
    this.$listsCompletedNav.on('click', 'a', this.handleCompleteListSelect.bind(this));
    this.$listsNav.on('click', 'li', this.handleSelectWithLi.bind(this));
    this.$listsCompletedNav.on('click', 'li', this.handleSelectWithLi.bind(this));
  },

  init: function() {
    this.bindEvents();
    this.loadTodosFromLocalStorage();
    this.renderList();
    this.renderListsNav();
    this.$list.trigger('click');
  },
};

App.init();