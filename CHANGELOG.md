# vite-plugin-pagefind

## 1.0.0

### Major Changes

- 4bcd5f9: Feature: 1.0.0 🎉

### Minor Changes

- 4bcd5f9: Chore: Removed ability to use `pagefind.json`, config is now fully inline.

## 0.3.0

### Minor Changes

- ebc03b8: Adds support for inline configuration.
- ebc03b8: Adds `pagefind_dir` option to configure the pagefind directory (rather than hardcoded to `/pagefind`).

### Patch Changes

- 2fe4aaf: Update peerDependency `vite`.

## 0.2.10

### Patch Changes

- f6dd0d4: fix: Move Vite to peer deps

## 0.2.9

### Patch Changes

- f6e01b7: fix: correctly switch from `PluginOption` to `Plugin` as the return type.

## 0.2.8

### Patch Changes

- 25f5487: Removed index.js, much clearer

## 0.2.7

### Patch Changes

- 8749267: Internal rewrite to JSDoc

## 0.2.6

### Patch Changes

- c0c6b7b: Fixed `dev` having the correct plugin name

## 0.2.5

### Patch Changes

- 0f227d5: Remove catch

## 0.2.4

### Patch Changes

- b82f87c: Catch errors and log instead of throwing

## 0.2.3

### Patch Changes

- fe3cb74: Better logs

## 0.2.2

### Patch Changes

- 64dcd74: Made `vite_plugin_pagefind` optional so an empty config is no longer required

## 0.2.1

### Patch Changes

- 8dcc9bc: Added defaults per config options
- 20c545a: Renamed `vite_plugin` to `vite_plugin_pagefind`
- 8dcc9bc: Added `/types` export for easier use

## 0.2.0

### Minor Changes

- 010e977: Added `dev_strategy` option, meaning you can develop with eager or lazy indexing
- 010e977: Plugin now strictly uses pagefind.json

## 0.1.1

### Patch Changes

- c6b6c63: bugfix: Types are now exported from root index

## 0.1.0

### Minor Changes

- bc84506: Feature: Added type definitions importable from `vite-plugin-pagefind/types`
- bc84506: Breaking: Renamed `PagefindPluginConfig` to `Config`
- bc84506: Breaking: Named `publicDir` to `assetsDir`

### Patch Changes

- bc84506: bugfix: replaced `process.cwd()` with `config.root` to conform with Vite

## 0.0.30

### Patch Changes

- 3bd4c12: Add quotes to path so it still works when there are spaces in the path

## 0.0.29

### Patch Changes

- f085992: Added nuxt example

## 0.0.28

### Patch Changes

- e02e88b: Fixed dynamic import broken only on initial dev server

## 0.0.27

### Patch Changes

- a10bad1: Fixed bad directory

## 0.0.26

### Patch Changes

- f1427a7: Cleaned up some internals

## 0.0.25

### Patch Changes

- 19ca67b: Fixed executeMeasured return time (start - stop should be stop - start)

## 0.0.24

### Patch Changes

- 720dbb8: Removed the automatic pagefind run on post build in favor of manually doing so to be framework agnostic (some frameworks have their own CLI wrappers around Vite so it was impossible to run post build since the framework ran after `vite build` had completed.

## 0.0.23

### Patch Changes

- d8de3ba: Graph improvements

## 0.0.22

### Patch Changes

- 7aafe6b: Added flow chart to showcase what pagefind does

## 0.0.21

### Patch Changes

- 74aed9c: Added Astro example :tada:

## 0.0.20

### Patch Changes

- ce7ba7a: Docs cleanup and default empty object fix

## 0.0.19

### Patch Changes

- 396c975: Added @antfu/ni in order to detect package and allow for more flexible build process (rather than harcoding `vite build`

## 0.0.18

### Patch Changes

- 6da3d09: Minor doc changes

## 0.0.17

### Patch Changes

- dfde5a4: Added examples folder, added SvelteKit

## 0.0.16

### Patch Changes

- e1cbe1f: Fixed dynamic imports being due to faulty vite configuration

## 0.0.15

### Patch Changes

- 6bb27bc: Fixed nested pagefind dir

## 0.0.14

### Patch Changes

- 3759d12: Removed testing console.log

## 0.0.13

### Patch Changes

- a9d0e41: Removed prerequisites from docs since the plugin will handle pagefind through the node API

## 0.0.12

### Patch Changes

- e08ff34: Cleaned up docs, renamed appDir to publicDir (makes more sense with vite), added LICENSE
- b974483: Fixed docs

## 0.0.11

### Patch Changes

- 692518a: Added assetsInclude config and external config to make usage of pagefind FAR easier

## 0.0.10

### Patch Changes

- cf9d8a7: Forced buildDir to be present
- 9f91f77: Fixed buildDir being optional type

## 0.0.9

### Patch Changes

- 1dc1751: Renamed pagefindDir to appDir and removed the need to specify the `pagefind` folder
- 1dc1751: Added documentation (see README.md)

## 0.0.8

### Patch Changes

- bd97d3d: Finally fixed running pagefind after build
- fcf32c0: Fixed broken vite dependency: https://github.com/vitejs/vite/issues/15714

## 0.0.7

### Patch Changes

- 9bdcc49: Fixed pagefind post build not running after the build process

## 0.0.6

### Patch Changes

- d911925: Fixed hardcoded buildDir
- 324852e: Added quotes around paths for pagefind to prevent invalid paths from occuring

## 0.0.5

### Patch Changes

- 04163e9: Added cwd option that defaults to process.cwd, added default to buildDir: build

## 0.0.4

### Patch Changes

- 93731cd: Bugfix: Had colorette as devDep causing issues with the plugin

## 0.0.3

### Patch Changes

- 2f8a075: Only packaging dist files now

## 0.0.2

### Patch Changes

- a969687: Released package
