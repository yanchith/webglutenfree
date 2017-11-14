# glutenfree

We serve your draw calls type-safe and gluten-free.

While everything is work in progress at the moment, these are some of our goals:

- Provide safe, simple and fast access to WebGL2 features
- Handle many state transitions internally
- Catch programmer errors via static typing and runtime checks
- Discourage or outright disable WebGL anitpatterns
- Enable as many of the underlying features as possible while maintaining other
        goals

Try looking at our [gallery](https://yanchith.github.io/glutenfree/) (need ES
module capable browser, eg Chrome 62).

_Glutenfree_ is heavily inspired by [regl](http://regl.party), but we try to
improve on some things, mainly discouraging WebGL antipatterns, and safety.
