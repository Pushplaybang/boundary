Template.Boundary.onCreated(function() {
  var context = this.data.context;
  Boundary.subsCount.set(context, 0);
  Boundary.pageCount.set(context, Boundary.pageIncrement[context]);
  Boundary.viewCount.set(context, -1);
});

Template.Boundary.helpers({
  more: function() {
    return Boundary.subsCount.get(this.context) > Boundary.pageCount.get(this.context);
  },
  ready: function() {
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
    },
    removeElement: function(node) {
      $(node).delay(800).animate({
        opacity: 0
      }, 200, function() {
        $(this).remove();
      });
    }
  };
});

Template.BoundarySpinner.helpers({
  ready: function() {
    return Boundary.ready.get(this.context);
  }
});
