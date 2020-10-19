# Getting Started With Schematics

This repository is a basic Schematic implementation that serves as a starting point to create and publish Schematics to NPM.

## New project (usage with `ng new`)

Setting up a new Angular project using _awesome-candy-enterprises_ default settings:

```bash
npm i -g awesome-candy-enterprises
ng new foo --collection=awesome-candy-enterprises
```

## Add to existing project (usage with `ng add`)

You can also apply the _awesome-candy-enterprises_ schematics to an existing Angular project:

```bash
ng add awesome-candy-enterprises
```

## Generate parts (usage with `ng g`)

Lust but not least, you can use the generator schematics from this collection to generate components like the _awesome-candy-enterprises_ header component separately:

```bash
npm i awesome-candy-enterprises
ng g awesome-candy-enterprises:header
```