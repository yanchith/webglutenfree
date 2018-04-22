# Changelog

## Unreleased
#### Fixes:

-   Fix a bug in binding depth and depth-stencil framebuffer attachments

#### Enhancements:

-   Improve framebuffer attachment inference and slim down its constructors to
    just `Framebuffer.create`
-   `texture.store()` now accepts additional options, width and height
-   Improve type signature of `target.draw()` by allowing skipping props for
    `Command<void>` types. Also change `Command.create()` to create `Command<void>`
    by default, unless explicit type parameter `P` is passed.


## v0.0.6 (22/02/2018)
#### Fixes:

-   Add missing d.ts.

---

## v0.0.5 (22/02/2018)
#### Enhancements:

-   Introduce stacks guarding state transitions for programs, vertex arrays,
    framebuffers, and others.
