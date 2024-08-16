# fnpm

Yet another package manager wrapper. Use the correct package manager.

## Installation

```bash
npm install -g @akrc/fnpm
```

## Usage

This project is not aiming to polyfill all the package manager commands (Such as `update`). It only provides a few common commands that I use frequently. If you need more commands, you can use the original package manager.

### UI

<pre align="center">
🧪 WORKING IN PROGRESS
</pre>

The missing Web UI for package manager, with the following features:

1. monorepo graph
2. search and install
3. maybe more

```
fnpm ui
```

### Install

```
fnpm add/a/install/i <package>

# npm install <package>
# yarn add <package>
# pnpm add <package>
```

```
fnpm add -D <package>

# npm install -D <package>
# yarn add -D <package>
# pnpm add -D <package>
```

```
fnpm add -O <package>

# npm install --save-optional <package>
# yarn add --optional <package>
# pnpm add --optional <package>
```

```
fnpm add -P <package>

# npm install --save-peer <package>
# yarn add --peer <package>
# pnpm add --peer <package>
```

```
fnm add -F <package>

# npm ci
# yarn install --frozen-lockfile
# pnpm install --frozen-lockfile
```

```
fnpm add -W <package>

# npm install <package>
# yarn add <package> -W
# pnpm add <package> -w
```

### Remove

```
fnpm remove/r/uninstall/u <package>

# npm uninstall <package>
# yarn remove <package>
# pnpm remove <package>
```

```
fnpm remove -D <package>

# npm uninstall -D <package>
# yarn remove -D <package>
# pnpm remove -D <package>
```

```
fnpm remove -O <package>

# npm uninstall --save-optional <package>
# yarn remove --optional <package>
# pnpm remove --optional <package>
```

```
fnpm remove -P <package>

# npm uninstall --save-peer <package>
# yarn remove --peer <package>
# pnpm remove --peer <package>
```

### Dlx

```
fnpx <package>
fnpm dlx <package>

# npx <package>
# yarn dlx <package>
# pnpm dlx <package>
```

### Run

```
fnpm tsup <args>

# npm exec tsup <args>
# yarn tsup <args>
# pnpm tsup <args>
```

```
fnpm dev <args>

# npm run dev <args>
# yarn dev <args>
# pnpm dev <args>
```

### Init

```
fnpm init

# npm init -y
# yarn init -y
# pnpm init
```

```
fnpm init -i

# npm init
```

### Create

```
fnpm create next-app

# pnpm create next-app
# yarn create next-app
# npm init next-app
```
