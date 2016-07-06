Boundary = {
  /* Reactive Properties we need to keep track of */
  subsCount:      new ReactiveDict(), // how many items fetched
  pageCount:      new ReactiveDict(), // how nany items we have.
  viewCount:      new ReactiveDict(), // how many items are shown(delayed update)
  ready:          new ReactiveDict(), // track the ready state for each
  timeLimit:      new ReactiveDict(), // TODO: fetch posts older than...
  pageIncrement:  {},
  defaultCreateArgs: [
    'context', 'collection', 'selector', 'increment', 'template', 'subscription'
  ],

  /* Check if the create method has the correct arguments */
  _checkCreateArgs: function(args) {
    var passedKeys = _.keys(args);
    var diff = _.difference(passedKeys, Boundary.defaultCreateArgs);
    if (diff.length) {
      console.error('Check that all the correct arguments have been passed into Boundary.create');
      diff.forEach(function(element, index) {
        console.error(element + 'is missing!');
      });
      return false;
    }

    return true;
  },

  /*
    Kick Things off, and setup the pagination on a collection
    args: context, collection, selector, increment, template
   */
  create: function(args) {

    /* Check the pass arguments */
    if (!Boundary._checkCreateArgs(args))
      return false;

    /* Save a reference  */
    var self = this;

    /* Gaurd against no data context */
    if (!args.template.data)
      args.template.data = {};

    /* Set initial values on the template */
    args.template.data.ready = false;
    args.template.data.BoundaryContext = args.context;

    /* Set the increment */
    self.pageIncrement[args.context] = args.increment;

    /* Setup the Sub handler obj on the template instance */
    args.subscription = args.subscription ? args.subscription : {};

    /*
      Add the subscription ready state to the tempalte data, so its available
      to us in helpers. (note it may or may not exist) and set the ready state
      based on this
     */
    args.template.data.ready = args.subscription.ready ? args.subscription.ready() : false;

    /* set the subsCount property */
    if (self.pageCount.get(args.context)) {
      self.subsCount.set(args.context, args.collection.find(args.selector).count());
    }

    /* Set the ready state */
    self.ready.set(args.context, args.template.data.ready);

    /*
      When the subscription is ready call the view count function
      to update the list view.
     */
    if (args.template.data.ready) {
      self.setViewCount({
        context: args.context
      });
    }

    return this;
  },

  /* Set the page count */
  setCount: function(args) {
    if (!args.context || typeof(args.count) == 'undefined')
      return;

    Boundary.pageCount.set(args.context, args.count);

    return this;
  },

  /* Set the view count */
  setViewCount: function(args) {
    if (!args.context)
      return;

    Boundary.viewCount.set(args.context, this.pageCount.get(args.context));

    return this;
  },

  /* loadMore by incrementing the conut */
  loadMore: function(args) {
    if (!args.context)
      return;

    Boundary.setCount({
      context: args.context,
      count: Boundary.pageCount.get(args.context) +
            Boundary.pageIncrement[args.context]
    });

    return this;
  },

  /* reset values for this view  */
  reset : function(args) {
    if (!args.context)
      return;

    Boundary.subsCount.set(args.context, 0);
    Boundary.pageCount.set(args.context, this.pageIncrement[args.context]);
    Boundary.viewCount.set(args.context, -1);
    Boundary.ready.set(args.context, false);

    return this;
  },
};
