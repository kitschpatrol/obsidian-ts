<!-- title -->

# obsidian-ts

<!-- /title -->

<!-- badges -->

[![NPM Package obsidian-ts](https://img.shields.io/npm/v/obsidian-ts.svg)](https://npmjs.com/package/obsidian-ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/kitschpatrol/obsidian-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/kitschpatrol/obsidian-ts/actions/workflows/ci.yml)

<!-- /badges -->

<!-- short-description -->

**A fully-typed wrapper library for the Obsidian CLI.**

<!-- /short-description -->

> [!WARNING]
>
> The `obsidian-ts` library is under development. It should not be considered suitable for general use until a 1.0 release. If you want to try it, back up your Obsidian vault first.

## Overview

This library brings the capabilities of the official [Obsidian CLI](https://help.obsidian.md/cli) into your TypeScript codebase.

It provides a fully-typed, async/await oriented API to interact programmatically with your [Obsidian](https://obsidian.md) vaults.

In the interest of discoverability and sustainability, the library's interface is designed to closely mirror that of the CLI, not the platonic ideal of an Obsidian content API.

_Please note that this project is unofficial and not affiliated with or supported by Dynalist Inc._

## Getting started

### Dependencies

- [Node](https://nodejs.org/) 24.1+
- [Obsidian](https://obsidian.md/download) 1.12.7+ (Desktop version)

The [Obsidian CLI](https://help.obsidian.md/cli#Install+Obsidian+CLI) feature must be enabled in Obsidian:

1. Go to Settings → General.
2. Enable Command line interface.
3. Follow the prompt to register Obsidian CLI.

The Obsidian binary directory must be on your PATH.

### Installation

Add the library to your project's `package.json`:

```sh
npm install obsidian-ts
```

## Usage

The library is organized into namespace modules that mirror the Obsidian CLI's command groups. Both default and named imports are supported:

```ts
import obsidian from 'obsidian-ts'

// Optionally set a default vault so you don't have to pass it every time
obsidian.configure({ vault: 'My Vault' })

// List all files
const files = await obsidian.file.list()

// Read a file
const content = await obsidian.file.read({ path: 'notes/hello.md' })

// Get vault info
const info = await obsidian.vault.info()

// Read today's daily note
const note = await obsidian.daily.read()
```

Named imports work as well, if you prefer to import only what you need:

```ts
import { configure, file, vault } from 'obsidian-ts'

configure({ vault: 'My Vault' })
const files = await file.list()
```

All types are exported at the top level of the package, so you can import them directly:

```ts
import type { FileInfo, TaskInfo, VaultInfo } from 'obsidian-ts'
```

Types are also accessible through their module namespaces:

```ts
import type { file } from 'obsidian-ts'
type Info = file.FileInfo
```

### Configuration

Use `configure()` to set global defaults before making any calls:

```ts
import obsidian from 'obsidian-ts'

obsidian.configure({
  binary: '/opt/obsidian/obsidian', // Custom binary path (default: "obsidian")
  vault: 'My Vault', // Custom default vault for all commands
})
```

You can check the currently configured vault with `getVault()`:

```ts
import obsidian from 'obsidian-ts'
const vault = obsidian.getVault() // String | undefined
```

You can unset the default vault by passing `null`:

```ts
obsidian.configure({ vault: null })
```

You can also pass `vault` per-call to override the global default:

```ts
const files = await obsidian.file.list({ vault: 'Other Vault' })
```

If no vault is configured, the Obsidian CLI defaults to the most recently opened vault.

## API

### Design

Almost all functionality in the Obsidian CLI is accessible in `obsidian-ts`.

There are a few reasoned exceptions, which informed the behaviors listed below:

- **Consistent output format**\
  Whenever possible, the library returns either JavaScript primitives or simple objects. The `csv` or `tsv` output format options don't make sense in a JavaScript function return context, so they are not exposed. Output is always `json` wherever possible.
- **Always return everything**\
  Options specifying partial data return (like choosing between `characters` and `words` from the `wordcount` function) are not exposed. Instead, all available data is always returned, to simplify both the argument options and the returned types. It's trivial to pluck the desired data from the returned object after the fact, and the performance implications seem immaterial.
- **camelCase everything**\
  In some cases, compound words like `deadends` and `newtab` are converted to camelCase for consistency with TypeScript conventions (e.g. `deadEnds` and `newTab`).
- **Explicit top-level functions**\
  Certain "bare" top-level CLI commands like `file` are mapped to descriptive functions within their module namespace, like `file.info()`.
- **No interactive TUI bindings**\
  This would just be a mess.
- **All errors throw**\
  The Obsidian CLI sometimes handles errors in unexpected ways. Instead of returning a non-zero value and logging an error to `stderr`, some errors return a string-based description on `stdout` and swallow the error with a `0` return value. In these cases, `obsidian-ts` fishes the error message out of the string and throws.

For approximate parity with the structure of the CLI, functions in `obsidian-ts` always accept a single "bag of options"-style argument instead of positional arguments.

Many functions accept `file` and `path` options to select a specific note. `file` uses wikilink-style resolution (matching by name), while `path` is the exact path from the vault root. Technically, these are mutually exclusive options, though this is not enforced by the type system (too much complexity), but passing both will trigger a runtime error. (This might be worth revisiting, I think a nicer API would have a single `file` argument that either infers file vs. path intent contextually or defines the intent explicitly via a separate argument value.)

### `base`

_Obsidian Bases (databases from frontmatter / properties)_

| Function                              | Returns             | Description                       |
| ------------------------------------- | ------------------- | --------------------------------- |
| `list(options?: Vault)`               | `string[]`          | List all base files in the vault. |
| `views(options?: VaultFile)`          | `string[]`          | List views in a base file.        |
| `create(options?: BaseCreateOptions)` | `string`            | Create a new item in a base.      |
| `query(options?: BaseQueryOptions)`   | `BaseQueryResult[]` | Query a base and return results.  |

### `bookmark`

| Function                           | Returns          | Description                           |
| ---------------------------------- | ---------------- | ------------------------------------- |
| `list(options?: Vault)`            | `BookmarkInfo[]` | List bookmarks in the vault.          |
| `add(options: BookmarkAddOptions)` | `string`         | Add a bookmark.                       |
| `total(options?: Vault)`           | `number`         | Return the total number of bookmarks. |

### `command`

| Function                                  | Returns    | Description                        |
| ----------------------------------------- | ---------- | ---------------------------------- |
| `list(options?: CommandListOptions)`      | `string[]` | List available command IDs.        |
| `execute(options: CommandExecuteOptions)` | `string`   | Execute an Obsidian command by ID. |

### `daily`

_Daily notes_

| Function                                | Returns  | Description                              |
| --------------------------------------- | -------- | ---------------------------------------- |
| `open(options?: DailyOpenOptions)`      | `string` | Open today's daily note.                 |
| `path(options?: Vault)`                 | `string` | Get the file path of today's daily note. |
| `read(options?: Vault)`                 | `string` | Read today's daily note contents.        |
| `append(options: DailyAppendOptions)`   | `string` | Append content to today's daily note.    |
| `prepend(options: DailyPrependOptions)` | `string` | Prepend content to today's daily note.   |

### `dev`

_Developer tools_

| Function                                     | Returns  | Description                                 |
| -------------------------------------------- | -------- | ------------------------------------------- |
| `cdp(options: DevCdpOptions)`                | `string` | Run a Chrome DevTools Protocol command.     |
| `console(options?: DevConsoleOptions)`       | `string` | Show captured console messages.             |
| `css(options: DevCssOptions)`                | `string` | Inspect computed CSS with source locations. |
| `debug(options: DevDebugOptions)`            | `string` | Attach or detach the CDP debugger.          |
| `dom(options: DevDomOptions)`                | `string` | Query DOM elements.                         |
| `errors(options?: DevErrorsOptions)`         | `string` | Show captured error logs.                   |
| `evaluate(options: DevEvaluateOptions)`      | `string` | Execute JavaScript in the Obsidian runtime. |
| `mobile(options: DevMobileOptions)`          | `string` | Toggle mobile emulation.                    |
| `screenshot(options?: DevScreenshotOptions)` | `string` | Take a screenshot of the Obsidian window.   |
| `tools(options?: Vault)`                     | `string` | Toggle Electron dev tools.                  |

### `diff`

_File version diffs_

| Function                      | Returns  | Description                            |
| ----------------------------- | -------- | -------------------------------------- |
| `diff(options?: DiffOptions)` | `string` | List or diff local/sync file versions. |

### `file`

| Function                               | Returns    | Description                                     |
| -------------------------------------- | ---------- | ----------------------------------------------- |
| `list(options?: FileListOptions)`      | `string[]` | List files in the vault.                        |
| `info(options?: VaultFile)`            | `FileInfo` | Show file info (name, path, size, dates, etc.). |
| `read(options?: VaultFile)`            | `string`   | Read file contents.                             |
| `create(options?: FileCreateOptions)`  | `void`     | Create a new file in the vault.                 |
| `open(options?: FileOpenOptions)`      | `string`   | Open a file in Obsidian.                        |
| `append(options: FileAppendOptions)`   | `void`     | Append content to a file.                       |
| `prepend(options: FilePrependOptions)` | `void`     | Prepend content to a file.                      |
| `move(options: FileMoveOptions)`       | `void`     | Move a file, preserving links.                  |
| `rename(options: FileRenameOptions)`   | `void`     | Rename a file.                                  |
| `delete(options?: FileDeleteOptions)`  | `void`     | Delete a file (moves to trash by default).      |
| `total(options?: Vault)`               | `number`   | Return the total number of files.               |

### `folder`

| Function                            | Returns      | Description                         |
| ----------------------------------- | ------------ | ----------------------------------- |
| `list(options?: FolderListOptions)` | `string[]`   | List folders in the vault.          |
| `info(options: FolderInfoOptions)`  | `FolderInfo` | Show folder info.                   |
| `total(options?: Vault)`            | `number`     | Return the total number of folders. |

### `general`

| Function                  | Returns       | Description                  |
| ------------------------- | ------------- | ---------------------------- |
| `reload(options?: Vault)` | `void`        | Reload the vault.            |
| `restart()`               | `void`        | Restart Obsidian.            |
| `version()`               | `VersionInfo` | Return the Obsidian version. |

### `history`

_File history_

| Function                                  | Returns    | Description                                   |
| ----------------------------------------- | ---------- | --------------------------------------------- |
| `list(options?: Vault)`                   | `string[]` | List files that have history versions.        |
| `show(options?: VaultFile)`               | `string`   | Show file history versions.                   |
| `read(options?: HistoryReadOptions)`      | `string`   | Read a specific history version.              |
| `restore(options: HistoryRestoreOptions)` | `string`   | Restore a file to a specific history version. |
| `open(options?: VaultFile)`               | `string`   | Open the file recovery view.                  |

### `hotkey`

| Function                         | Returns        | Description                           |
| -------------------------------- | -------------- | ------------------------------------- |
| `list(options?: Vault)`          | `HotkeyInfo[]` | List hotkeys.                         |
| `get(options: HotkeyGetOptions)` | `string`       | Get the hotkey assigned to a command. |
| `total(options?: Vault)`         | `number`       | Return the total number of hotkeys.   |

### `link`

| Function                             | Returns                | Description                                  |
| ------------------------------------ | ---------------------- | -------------------------------------------- |
| `backlinks(options?: VaultFile)`     | `BacklinkInfo[]`       | List backlinks to a file.                    |
| `backlinkTotal(options?: VaultFile)` | `number`               | Return the total number of backlinks.        |
| `outgoing(options?: VaultFile)`      | `string[]`             | List outgoing links from a file.             |
| `outgoingTotal(options?: VaultFile)` | `number`               | Return the total number of outgoing links.   |
| `unresolved(options?: Vault)`        | `UnresolvedLinkInfo[]` | List unresolved (broken) links.              |
| `unresolvedTotal(options?: Vault)`   | `number`               | Return the total number of unresolved links. |
| `orphans(options?: Vault)`           | `string[]`             | List files with no incoming links.           |
| `orphanTotal(options?: Vault)`       | `number`               | Return the total number of orphan files.     |
| `deadEnds(options?: Vault)`          | `string[]`             | List files with no outgoing links.           |
| `deadEndTotal(options?: Vault)`      | `number`               | Return the total number of dead-end files.   |

### `outline`

_Headings_

| Function                     | Returns            | Description                           |
| ---------------------------- | ------------------ | ------------------------------------- |
| `show(options?: VaultFile)`  | `OutlineHeading[]` | Show the headings outline for a file. |
| `total(options?: VaultFile)` | `number`           | Return the total number of headings.  |

### `plugin`

_Obsidian Plugins_

| Function                                     | Returns        | Description                      |
| -------------------------------------------- | -------------- | -------------------------------- |
| `list(options?: PluginListOptions)`          | `PluginInfo[]` | List installed plugins.          |
| `enabled(options?: PluginEnabledOptions)`    | `PluginInfo[]` | List enabled plugins.            |
| `info(options: PluginInfoOptions)`           | `string`       | Get plugin info by ID.           |
| `enable(options: PluginEnableOptions)`       | `string`       | Enable a plugin.                 |
| `disable(options: PluginDisableOptions)`     | `string`       | Disable a plugin.                |
| `install(options: PluginInstallOptions)`     | `string`       | Install a community plugin.      |
| `uninstall(options: PluginUninstallOptions)` | `string`       | Uninstall a community plugin.    |
| `reload(options: PluginReloadOptions)`       | `string`       | Reload a plugin.                 |
| `restrict(options?: PluginRestrictOptions)`  | `string`       | Toggle or check restricted mode. |

### `property`

_Frontmatter properties and aliases_

| Function                                    | Returns          | Description                                 |
| ------------------------------------------- | ---------------- | ------------------------------------------- |
| `list(options?: PropertyListOptions)`       | `PropertyInfo[]` | List properties in the vault or for a file. |
| `read(options: PropertyReadOptions)`        | `string`         | Read a property value from a file.          |
| `set(options: PropertySetOptions)`          | `string`         | Set a property on a file.                   |
| `remove(options: PropertyRemoveOptions)`    | `string`         | Remove a property from a file.              |
| `total(options?: Vault)`                    | `number`         | Return the total number of properties.      |
| `aliases(options?: PropertyAliasesOptions)` | `string[]`       | List aliases in the vault or for a file.    |
| `aliasTotal(options?: Vault)`               | `number`         | Return the total number of aliases.         |

### `publish`

_Obsidian Publish_

| Function                                 | Returns           | Description                                        |
| ---------------------------------------- | ----------------- | -------------------------------------------------- |
| `list(options?: Vault)`                  | `string[]`        | List published notes.                              |
| `listTotal(options?: Vault)`             | `number`          | Return the total number of published notes.        |
| `add(options?: PublishAddOptions)`       | `string`          | Publish a file or all changed files.               |
| `remove(options?: VaultFile)`            | `string`          | Unpublish a note.                                  |
| `status(options?: PublishStatusOptions)` | `string`          | List publish changes.                              |
| `statusTotal(options?: Vault)`           | `number`          | Return the total number of status entries.         |
| `site(options?: Vault)`                  | `PublishSiteInfo` | Show Obsidian Publish site info.                   |
| `open(options?: VaultFile)`              | `string`          | Open the published version of a note in a browser. |

### `random`

| Function                            | Returns  | Description                     |
| ----------------------------------- | -------- | ------------------------------- |
| `open(options?: RandomOpenOptions)` | `string` | Open a random note in Obsidian. |
| `read(options?: RandomReadOptions)` | `string` | Read a random note's contents.  |

### `search`

| Function                                 | Returns                 | Description                                |
| ---------------------------------------- | ----------------------- | ------------------------------------------ |
| `query(options: SearchQueryOptions)`     | `string[]`              | Search the vault for text.                 |
| `context(options: SearchContextOptions)` | `SearchContextResult[]` | Search with matching line context.         |
| `total(options: SearchTotalOptions)`     | `number`                | Return the total number of search matches. |
| `open(options?: SearchOpenOptions)`      | `string`                | Open the search view in Obsidian.          |

### `snippet`

_CSS snippets_

| Function                                  | Returns    | Description                  |
| ----------------------------------------- | ---------- | ---------------------------- |
| `list(options?: Vault)`                   | `string[]` | List installed CSS snippets. |
| `enabled(options?: Vault)`                | `string[]` | List enabled CSS snippets.   |
| `enable(options: SnippetEnableOptions)`   | `string`   | Enable a CSS snippet.        |
| `disable(options: SnippetDisableOptions)` | `string`   | Disable a CSS snippet.       |

### `sync`

_Obsidian Sync_

| Function                               | Returns    | Description                                       |
| -------------------------------------- | ---------- | ------------------------------------------------- |
| `status(options?: Vault)`              | `string`   | Show Obsidian Sync status.                        |
| `toggle(options: SyncToggleOptions)`   | `string`   | Pause or resume Obsidian Sync.                    |
| `history(options?: VaultFile)`         | `string`   | List sync version history for a file.             |
| `historyTotal(options?: VaultFile)`    | `number`   | Return the total number of sync versions.         |
| `read(options: SyncReadOptions)`       | `string`   | Read a specific sync version.                     |
| `restore(options: SyncRestoreOptions)` | `string`   | Restore a file to a specific sync version.        |
| `deleted(options?: Vault)`             | `string[]` | List deleted files tracked by sync.               |
| `deletedTotal(options?: Vault)`        | `number`   | Return the total number of deleted files in sync. |
| `open(options?: VaultFile)`            | `string`   | Open the sync history view.                       |

### `tag`

| Function                         | Returns     | Description                              |
| -------------------------------- | ----------- | ---------------------------------------- |
| `list(options?: TagListOptions)` | `TagInfo[]` | List tags in the vault or for a file.    |
| `info(options: TagInfoOptions)`  | `string`    | Get tag info (occurrences, files, etc.). |
| `total(options?: Vault)`         | `number`    | Return the total number of tags.         |

### `task`

| Function                             | Returns      | Description                       |
| ------------------------------------ | ------------ | --------------------------------- |
| `list(options?: TaskListOptions)`    | `TaskInfo[]` | List tasks in the vault.          |
| `show(options: TaskShowOptions)`     | `string`     | Show a specific task.             |
| `update(options: TaskUpdateOptions)` | `string`     | Update a task's status.           |
| `total(options?: Vault)`             | `number`     | Return the total number of tasks. |

### `template`

| Function                                 | Returns    | Description                             |
| ---------------------------------------- | ---------- | --------------------------------------- |
| `list(options?: Vault)`                  | `string[]` | List available templates.               |
| `read(options: TemplateReadOptions)`     | `string`   | Read template content.                  |
| `insert(options: TemplateInsertOptions)` | `string`   | Insert a template into the active file. |
| `total(options?: Vault)`                 | `number`   | Return the total number of templates.   |

### `theme`

| Function                                    | Returns    | Description                                  |
| ------------------------------------------- | ---------- | -------------------------------------------- |
| `list(options?: Vault)`                     | `string[]` | List installed themes.                       |
| `info(options?: ThemeInfoOptions)`          | `string`   | Show active theme or get theme info by name. |
| `set(options: ThemeSetOptions)`             | `string`   | Set the active theme.                        |
| `install(options: ThemeInstallOptions)`     | `string`   | Install a community theme.                   |
| `uninstall(options: ThemeUninstallOptions)` | `string`   | Uninstall a theme.                           |

### `unique`

| Function                                | Returns | Description                           |
| --------------------------------------- | ------- | ------------------------------------- |
| `create(options?: UniqueCreateOptions)` | `void`  | Create a new note with a unique name. |

### `vault`

| Function                           | Returns           | Description                                            |
| ---------------------------------- | ----------------- | ------------------------------------------------------ |
| `list()`                           | `string[]`        | List known vaults.                                     |
| `listVerbose()`                    | `VaultListItem[]` | List vaults with names and paths.                      |
| `info(options?: VaultInfoOptions)` | `VaultInfo`       | Show vault info (name, path, file/folder count, size). |
| `open(options: VaultOpenOptions)`  | `string`          | Open a vault by name.                                  |
| `total()`                          | `number`          | Return the total number of known vaults.               |

### `web`

_Web browser_

| Function                        | Returns  | Description                                |
| ------------------------------- | -------- | ------------------------------------------ |
| `open(options: WebOpenOptions)` | `string` | Open a URL in Obsidian's web browser view. |

### `wordcount`

| Function                   | Returns         | Description                            |
| -------------------------- | --------------- | -------------------------------------- |
| `get(options?: VaultFile)` | `WordCountInfo` | Count words and characters for a file. |

### `workspace`

| Function                                     | Returns    | Description                                       |
| -------------------------------------------- | ---------- | ------------------------------------------------- |
| `show(options?: Vault)`                      | `string`   | Show the current workspace tree.                  |
| `tabs(options?: Vault)`                      | `string[]` | List open tabs.                                   |
| `openTab(options?: WorkspaceOpenTabOptions)` | `string`   | Open a new tab.                                   |
| `recents(options?: Vault)`                   | `string[]` | List recently opened files.                       |
| `recentTotal(options?: Vault)`               | `number`   | Return the total number of recently opened files. |
| `list(options?: Vault)`                      | `string[]` | List saved workspaces.                            |
| `save(options?: WorkspaceSaveOptions)`       | `string`   | Save the current workspace.                       |
| `load(options: WorkspaceLoadOptions)`        | `string`   | Load a saved workspace.                           |
| `delete(options: WorkspaceDeleteOptions)`    | `string`   | Delete a saved workspace.                         |
| `total(options?: Vault)`                     | `number`   | Return the total number of saved workspaces.      |

## Logging

The library uses [lognow](https://github.com/kitschpatrol/lognow) for internal logging. Nothing is logged by default, but you can enable verbose logging to see the exact CLI commands being executed by passing a verbose logger to `setLogger()`, or by setting the `DEBUG` environment variable:

```ts
import { getChildLogger, log, setDefaultLogOptions } from 'lognow'
import obsidian from 'obsidian-ts'

// Parent logger is verbose...
setDefaultLogOptions({
  verbose: true,
})

// Create a named child and pass it to the library:
obsidian.setLogger(getChildLogger(log, 'obsidian-ts'))
```

## Version compatibility

This `obsidian-ts` library follows [semver](https://semver.org/). The library's major version tracks breaking changes to its own API.

On the first CLI command invocation, `obsidian-ts` automatically checks that the installed Obsidian CLI version is compatible with the library's supported range. If the version is incompatible, an `ObsidianVersionError` is thrown. You can also check compatibility explicitly:

```ts
import obsidian from 'obsidian-ts'

const compatible = await obsidian.isCompatible()
```

## Error handling

The library throws typed errors:

- **`ObsidianNotFoundError`**

The `obsidian` binary is not on your PATH.

- **`ObsidianVersionError`**

The installed CLI version is outside the supported range.

- **`ObsidianError`**

A CLI command reported a logical error (e.g. file not found, invalid plugin ID), or a CLI command returned a non-zero exit code.

```ts
import obsidian from 'obsidian-ts'

try {
  await obsidian.file.read({ path: 'nonexistent.md' })
} catch (error) {
  if (error instanceof obsidian.ObsidianNotFoundError) {
    console.error('Obsidian CLI is not installed')
  } else if (error instanceof obsidian.ObsidianVersionError) {
    console.error(`Incompatible CLI version: ${error.cliVersion}`)
  } else if (error instanceof obsidian.ObsidianError) {
    console.error(`Command failed: ${error.message}`)
  }
}
```

## Examples

### Read and modify files

```ts
import obsidian from 'obsidian-ts'

// Create a new file
await obsidian.file.create({ content: '# Meeting Notes\n\n', path: 'notes/meeting.md' })

// Append content
await obsidian.file.append({ content: '- Action item: follow up', path: 'notes/meeting.md' })

// Read it back
const content = await obsidian.file.read({ path: 'notes/meeting.md' })
```

_Obsidian CLI equivalent:_

```sh
obsidian create path=notes/meeting.md content="# Meeting Notes\n\n"
obsidian append path=notes/meeting.md content="- Action item: follow up"
obsidian read path=notes/meeting.md
```

### Work with daily notes

```ts
import obsidian from 'obsidian-ts'

// Append a log entry to today's daily note
await obsidian.daily.append({ content: `- ${new Date().toLocaleTimeString()} Finished review` })

// Read the daily note
const today = await obsidian.daily.read()
```

_Obsidian CLI equivalent:_

```sh
obsidian daily:append content="- 3:45 PM Finished review"
obsidian daily:read
```

### Search and explore

```ts
import obsidian from 'obsidian-ts'

// Full-text search
const results = await obsidian.search.query({ query: 'project plan' })

// Find orphan notes (no incoming links)
const orphans = await obsidian.link.orphans()

// List all tags
const tags = await obsidian.tag.list()
```

_Obsidian CLI equivalent:_

```sh
obsidian search query="project plan"
obsidian orphans
obsidian tags
```

### Manage plugins and themes

```ts
import obsidian from 'obsidian-ts'

// List enabled plugins
const enabled = await obsidian.plugin.enabled()

// Install and enable a plugin in one step
await obsidian.plugin.install({ enable: true, id: 'yanki' })

// Set a theme
await obsidian.theme.set({ name: 'Minimal' })
```

_Obsidian CLI equivalent:_

```sh
obsidian plugins:enabled
obsidian plugin:install id=yanki enable
obsidian theme:set name="Minimal"
```

### Vault-level operations

```ts
import obsidian from 'obsidian-ts'

// List all vaults
const vaults = await obsidian.vault.list()

// Get info about the current vault
obsidian.configure({ vault: 'My Vault' })
const info = await obsidian.vault.info()
console.log(`${info.name}: ${info.files} files`)
```

_Obsidian CLI equivalent:_

```sh
obsidian vaults
obsidian vault="My Vault" vault
```

## Maintainers

@kitschpatrol

## Slop factor

_High._

This project combines human-defined architecture and directives with an LLM-generated implementation guided by the behavior and documentation of the official Obsidian CLI.

The output has been subject to only moderate post-facto human scrutiny.

## Acknowledgments

This project is just a thin wrapper over the Obsidian CLI. All credit to the [Obsidian team](https://obsidian.md/about)!

Getting Obsidian CLI working in CI was a bit of an ordeal, which benefited from the insights in Lucas Traba's [obsidianless](https://github.com/lucastraba/obsidianless) project.

<!-- contributing -->

## Contributing

[Issues](https://github.com/kitschpatrol/obsidian-ts/issues) and pull requests are welcome.

<!-- /contributing -->

<!-- license -->

## License

[MIT](license.txt) © Eric Mika

<!-- /license -->
