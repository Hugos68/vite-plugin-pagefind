# vite-plugin-pagefind

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
