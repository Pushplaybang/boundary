## Boundary
flexible isomorphic pagination package for meteor

Boundary is a very simple and easy to implement infinite scroll pagination package for meteor.

## Install
Simple install the package via atmosphere

```sh
meteor add pushplaybang:boundary
```



## Example Usage
To setup Pagination you must setup Boundary on the client side, and on the server, this is very simple to do in your publication and subscription, Boundary specifically does not replace the standard pub / sub in Meteor but provides the functionality required to set up the pagination quickly and easily.

#### On the client :
The first place we need to setup Boundary is in your template onCreated where you're setting up your subscription, (if you're setting up your subscription somewhere else you can setup Boundary there as neccessary).

```js

Template.topicList.onCreated(function() {

  /*
    save a reference to this context so we can access it inside
    the autorun computation below.
  */
  var self = this;

  /*
    By seting the autorun and subscribe on the template context it will
    be destroyed when the tempalte is, rather than on the Tracker global
    which would survive the tempalte lifecycle.
   */
  self.autorun(function() {

    /*
      Setup Boundary with a context
      NB the context namespaces the pagination values
     */
    var limit = Boundary.pageCount.get('blog');

    /*
      Define your subscription, avoiding a  sub with a limit of 0, and however you please, a limit value, demonstrated simply here for brevity.
     */
    if (limit && limit > 0) {
      self.sub = self.subscribe('posts.index', limit);
    }

    /*
      Initialize the pagination passing in the context, collection, selector, increment and a reference to the current template.
     */
    Boundary.create({
      context: 'blog',
      collection: posts,
      selector: {},
      increment: 5,
      template: self
      subscription: self.sub
    });
  });

});

```

Then in your tempalte helper you will need to access the view count property as follows :

```js
Template.posts.helpers({
  posts: function() {
    var count = Boundary.viewCount.get('blog');
    return posts.find({}, {
      limit: count
    });
  }
});
```

lastly add the Boundary template helpers into your listing template.

```html
<template name="posts">
    <!-- List Items if we have them -->
    <ul class="posts-list">
      {{#if posts}}
        {{#each posts}}
          {{> post }}
        {{/each}}
      {{/if}}
    </ul>

    {{#unless posts}}
      <!-- No Items Message -->
      {{#if ready}}
        <p class="note">There are currently no posts listed</p>
      {{/if}}
    {{/unless}}

    <!--  Pagination -->
    {{> Boundary context='blog' }}
</template>
```

**nb :** note that the ready helper is set automatically by Boundary.

#### On the Server :
On the server you will need to do very little, simply wrap the limit with the provided function.

```js
Meteor.publish('posts.index', function(limit) {
  return posts.find({}, {
    limit: Boundary.limit(limit)
  });
});
```

if apropriate, and possible in your use case, it would be wise to make your query selectors accessible from a common referenceable object, as to avoid writing it out three times.


## Loader Template
The boundary package includes a simple CSS 3 loader, but if you've got a custom loader in your app that you'd like to use, you can by passing a tempalte name to the loader property on the boundary template.

```html
{{> Boundary context='blog' loader='customAppLoader' }}
```


## How it Works
Unlike the general pattern for infinite scroll pagination in meteor where the count of the entire collection is published, Boundary works by always asking for one more record than is needed.  In this way, the client always knows if there are older records available, and uses this information to display a load more button.

### Programatically update the count
By default Boundary displays a button that must be clicked to load more records, should you want to add this functionality to be triggered on scroll you should be able to set this up and call the loadmore action.

```js
Boundary.loadMore(context);
```

### Resetting
Boundary automatically resets the values for the current context when the template its included in is destroyed.  If you're using Boundary in a template controller pattern, you may want to reset the current context programatically, use the reset method to achieve this:

```js
Boundary.reset(context);
```

### Counts
Essentially a core part of how Boundary works is by managing three counts :

* subsCount - tracks the number of items fetched.
* pageCount - tracks the number of items that should be displayed.
* viewCount - tracks the number of items that are displayed, this is only updated once the data is ready allowing us to avoid any page flashes.

Each is a reactive dictionary saving the count against the context provided. The Boundary template interacts with these, but should you need to interact with them directly you can use the standard get and set methods ie: `Boundary.viewCount.get(context)`.


## ChangeLog
* 0.0.6 - Gaurd against no data  context set on template
* 0.0.5 - improved animation in of the loader template and loadmore button
* 0.0.4 - explicitly set the subscription in the `.create` method
* 0.0.3 - added default positioning CSS for the loader, updated the readme
* 0.0.2 - added custom loader ability, and better html structure to the buttom and loader


## TODO
* Improve API, and add an easy to use interface above the current API
* Create a better method for detecting a collection instance
* 'Load newer than' functionality
* Tests



### Contributions and Suggestions Welcome!
Have something you think this needs or could use as an improvement, let me know.  add [an issue on github]() or fork and create a pull request.



___



### License [MIT](https://opensource.org/licenses/MIT)
Copyright (c) 2016 Paul van Zyl

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
