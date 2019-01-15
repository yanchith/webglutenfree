# Changelog

## v0.0.10 (unreleased)

### Enahancments

- Add `TextureCubeMap`
- Add `Renderbuffer`
- Make all gl enums explicit and typechecked
- Compute more optimal row unpack alignment for storing texture data

### Fixes

(None yet)

## v0.0.9 (17/10/2018)

### Enhancements

- Teach uniform validation mechanism about possible basic type array shorthands
- Move all type constructors to `Device`. E.G. vertex buffers are now created
  with `device.createVertexBuffer()`
- Remove state tracking stacks and instead add hard assertions on illegal usage
- Remove needless buffer copying in vertex/element buffers and texture
- Improve dead code elimination by providing more obvious hints to rollup
- Improve internal types around assertions

### Fixes

- Obscure `process.env.NODE_ENV` shim to prevent rollup inlining it

## v0.0.8 (18/06/2018)

### Enhancements

- Added possibility to specify scissor box for all rendering operations
- Added possibiliry to specify viewport for `command.draw()` and `command.batch()`
- Added possibility to specify source and destination rects for `command.blit()`
- Use typescript's declaration maps for tex editor navigation

### Fixes

- Allow users to envify `process.env.NODE_ENV` (again). Provide shim for
  `process.env.NODE_ENV` in case they don't
- Include all declaration files in the distribution

## v0.0.7 (02/05/2018)

### Enhancements

- Improve framebuffer attachment inference and slim down its constructors to
  just `Framebuffer.create`
- `texture.store()` now accepts additional options, width and height
- Improve type signature of `target.draw()` by allowing skipping props for
  `Command<void>` types. Also change `Command.create()` to create `Command<void>`
  by default, unless explicit type parameter `P` is passed.
- Improve validation messages
- Validate uniform shapes and types in development mode

### Fixes

- Fix a bug in binding depth and depth-stencil framebuffer attachments

## v0.0.6 (22/02/2018)

### Fixes

- Add missing d.ts.

## v0.0.5 (22/02/2018)

### Enhancements

- Introduce stacks guarding state transitions for programs, vertex arrays,
  framebuffers, and others.
