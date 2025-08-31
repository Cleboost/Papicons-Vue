<p align="center">
  <img src=".github/assets/logotype.svg" alt="Papicons" width="400">
</p>
<p align="center">
Papicons-Vue is a fork of <a href=https://github.com/PapillonApp/Papicons>Papicons</a>, a collection of icons designed by Tom Things for Papillon.
</p>
<br/>

## Installation

You can use Papicons-Vue in your Vue 3 project by installing the package via npm or yarn:

```bash
npm install papicons-vue
```

or

```bash
yarn add papicons-vue
```

## Usage

To use Papicons in your Vue project, you can import the icons directly from the package. Here's an example of how to use an icon:

```vue
<script setup lang="ts">
  import { Butterfly } from 'papicons-vue';
</script>

<template>
  <div>
    <Butterfly :size="50" color="#0042DC" />
  </div>
  
</template>
```

## Contributing

You can add you own icons to the Papicons collection by following these steps:

1. **Create a new SVG icon :** You can join the [Figma community](https://www.figma.com/community/file/1543947677978703963) to create your own icons with the grids and rules provided.
2. **Export the SVG icon :** Once you have created your icon, export it as an SVG file.
3. **Clean the SVG file :** Remove fill on paths and groups, remove unnecessary attributes, and ensure the SVG is optimized for Vue usage.
4. **Add the icon to the package :** Place the cleaned SVG file in the `icons` directory.
5. **Run the build script :** Run the build script to generate the Vue components from the SVG files. You can do this by running:
```bash
npm run icons:build
```
6. **Your icons will be automatically added to the package !**

## License

This repository, including the icons, is licensed under the [MIT License](./LICENSE).

