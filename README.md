# glutenfree

We serve your draw calls type-safe and gluten-free.

Everything is a bit experimental at the moment, but work is underway on
stabilizing the features and getting to a first release.

These are our design goals:

-   Provide safe and simple access to WebGL2 features without sacrificing
    performance
-   Handle most WebGL state transitions internally
-   Catch programmer errors via both static type checking and (optional) runtime
    checks
-   Encourage init-time resource creation in the API

While glutenfree tastes best consumed from TypesSript, it is very usable from
JavaScript as well. Try looking at our [gallery](https://yanchith.github.io/glutenfree/) (need ES
module capable browser, eg. Chrome > 61).

_Glutenfree_ is heavily inspired by [regl](http://regl.party), but we try to
improve on some things:
-   if consumed from typescript, we can compile-time check for many issues
-   glutenfree requires WebGL2, which enables it to utilize new features, most
    notably VAOs for improved buffer binding performance.
