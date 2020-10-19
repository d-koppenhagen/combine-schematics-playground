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

## Update code (usage with `ng update`)

Show if updates are available:

```bash
$ ng update
Using package manager: 'npm'
Collecting installed dependencies...
Found 38 dependencies.
  We analyzed your package.json, there are some packages to update:

   Name                        Version          Command to update
  ---------------------------------------------------------------------------------
   awesome-candy-enterprises   0.0.1 -> 0.0.2   ng update awesome-candy-enterprises
```

Run migrations:

```bash
$ ng update awesome-candy-enterprises
Using package manager: 'npm'
Collecting installed dependencies...
Found 38 dependencies.
Fetching dependency metadata from registry...
    Updating package.json with dependency awesome-candy-enterprises @ "0.0.2" (was "0.0.1")...
UPDATE package.json (1854 bytes)
⠧ Installing packages...
✔ Packages installed successfully.
** Executing migrations of package 'awesome-candy-enterprises' **

❯ Updates to Version 0.0.2
    ✨ Migration executed
  Migration completed.
```