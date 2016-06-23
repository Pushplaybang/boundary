Template.Boundary.onCreated(function() {
  var context = this.data.context;
  Boundary.subsCount.set(context, 0);
  Boundary.pageCount.set(context, Boundary.pageIncrement[context]);
  Boundary.viewCount.set(context, -1);
});

Template.Boundary.onRendered(function() {
  this.find('.boundary-wrap')._uihooks = {
    insertElement: function (node, next) {
      $(node)
        .hide()
        .delay(200)
        .insertBefore(next)
        .fadeIn(325);
    }
  };
});

Template.Boundary.helpers({
  more: function() {
    return Boundary.subsCount.get(this.context) > Boundary.pageCount.get(this.context);
  },
  ready: function() {
    console.log("Boundary.ready.get(this.context)", Boundary.ready.get(this.context));
    return Boundary.ready.get(this.context);
  },
  buttonText: function() {
    return this.buttonText || 'load more';
  },
});

Template.Boundary.events({
  'click button': function(event, template) {
    Boundary.loadMore({ context: this.context });
  }
});

Template.Boundary.onDestroyed(function() {
  /* CleanUp and Reset When this template is destroyed */
  Boundary.reset({ context: this.data.context });
});

Template.BoundarySpinner.onRendered(function() {
  this.find('.boundary-loader-wrap')._uihooks = {
    insertElement: function (node, next) {
      $(node)
        .hide()
        .insertBefore(next)
        .fadeIn(200);
    }
  };
});

Template.BoundarySpinner.helpers({
  ready: function() {
    return Boundary.ready.get(this.context);
  }
});
