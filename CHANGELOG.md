# vite-plugin-pagefind

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
