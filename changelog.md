# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Maintenance

- Retry the Obsidian installer up to three times in Windows CI when it exits without installing the executable.

## [0.3.2] - 2026-11-01

### Maintenance

- Update runtime requirements for lognow and Zod.
- Refresh shared-config, tsdown, Vitest, pnpm, and GitHub Actions dependencies, and clean up dependency-installation exceptions.
- Build before lint/fix commands and replace the contributor-skill prepare hook with pnpm-managed skill installation.
- Validate release tags against the repository's default branch and use the triggering tag for the GitHub release.
- Move scheduled dependency updates from weekly to monthly.
- Make link checks ignore loopback URLs and tolerate empty link sets.

## [0.3.1] - 2026-10-06

### Maintenance

- Add a weekly and manually runnable dependency-update workflow that includes Obsidian CLI parity review.
- Update shared-config and pnpm, and add automatic contributor-skill synchronization through a prepare hook.

## [0.3.0] - 2026-10-05

### Changed

- **Breaking:** Change the Node.js requirement to `^24.1.0 || >=26.0.0`, dropping Node.js 25 support.

### Documentation

- Update Node.js installation requirements and Obsidian CLI links in the README and missing-binary error guidance.

### Maintenance

- Refresh runtime requirements for lognow, semver, tinyexec, type-fest, and Zod.
- Upgrade contributor tooling to TypeScript 6, Vitest 5, pnpm 12, and shared-config 8, with Node.js `^24.16.0 || >=26.3.0` and updated compiler/lint checks.
- Add automated repository and homepage link checks, including weekly scheduled runs, and refresh CI/release actions.
- Rename cleanup to `clean-deep` and switch npm publishing to a one-time password from 1Password.

## [0.2.1] - 2026-05-16

### Documentation

- Expand contribution guidance, document ksc/mdat tooling, and refresh README links.

### Maintenance

- Refresh lognow, semver, tinyexec, type-fest, and Zod, adapting `setLogger()` typings to the updated logging API.
- Migrate to pnpm 11 and its `allowBuilds` configuration, refresh development tools and CI actions, and make cleanup cross-platform.
- Pass `NPM_AUTH_TOKEN` directly to the publish command and support GitHub release tags with or without a `v` prefix.

## [0.2.0] - 2026-04-07

### Changed

- **Breaking:** Require Obsidian CLI `^1.12.7` instead of `^1.12.4`.
- Name the default logger `obsidian-ts`.

### Fixed

- Raise `ObsidianNotFoundError` when Windows reports that the Obsidian binary is not recognized.

### Documentation

- Document the Obsidian 1.12.7+ requirement and update CI status and acknowledgments.

### Maintenance

- Update runtime requirements for lognow, tinyexec, and type-fest.
- Add build, lint, and live-Obsidian integration CI on Linux, macOS, and Windows, with installer caching and improved test-vault restoration.
- Refresh development dependencies and pnpm, and remove repository-level npm-token configuration.
- Update release and repository-metadata workflows with pinned actions and explicit permissions.

## [0.1.0] - 2026-03-03

### Added

- Provide an ESM library for Node.js 24.1+ with async command namespaces, default and named imports, exported option/result types, and validated CLI responses.
- Read, create, append to, prepend to, move, rename, and delete vault files, with file/folder listings, counts, and metadata.
- Support daily-note reading and editing, unique-note creation, random-note access, and template listing, reading, and insertion.
- Search vault contents with folder, case, and result-limit options, match counts, and matching-line context.
- Inspect backlinks, outgoing and unresolved links, discover orphan and dead-end notes, and retrieve outlines and word/character counts.
- Read, set, and remove note properties, and list properties, aliases, and tags with counts.
- Query and update tasks by file, line, or reference, with completion, daily-note, and custom-status options.
- List Bases and their views, create items, and query results.
- Discover and open vaults, inspect vault metadata, configure a default vault or custom binary, and override the vault per call.
- Expose workspace and tab inspection, saved-workspace APIs, recent files, bookmarks, and Obsidian web navigation.
- List and execute Obsidian commands, inspect hotkeys, and reload or restart Obsidian.
- Manage core/community plugins, restricted mode, themes, and CSS snippets.
- Inspect, read, restore, and compare local and Sync file versions, control Sync, and list deleted Sync files.
- Access Obsidian Publish site information, published notes, change status, and publishing, removal, and browser-opening operations.
- Expose developer tools for JavaScript evaluation, Chrome DevTools Protocol, console/error capture, DOM/CSS inspection, screenshots, and mobile emulation.
- Check Obsidian CLI compatibility against `^1.12.4` automatically or through `isCompatible()`, with typed errors for missing binaries, incompatible versions, and command failures.
- Expose `setLogger()` for custom logger injection and optional verbose command logging.

### Documentation

- Add npm installation and CLI setup guidance, an API reference, and examples for note editing, search, daily notes, plugins, vaults, logging, and error handling.

### Maintenance

- Set up TypeScript builds and declarations, linting and formatting, parser and live-vault tests, and npm/GitHub release tooling.

[Unreleased]: https://github.com/kitschpatrol/obsidian-ts/compare/v0.3.2...HEAD
[0.1.0]: https://github.com/kitschpatrol/obsidian-ts/releases/tag/v0.1.0
[0.2.0]: https://github.com/kitschpatrol/obsidian-ts/compare/v0.1.0...v0.2.0
[0.2.1]: https://github.com/kitschpatrol/obsidian-ts/compare/v0.2.0...v0.2.1
[0.3.0]: https://github.com/kitschpatrol/obsidian-ts/compare/v0.2.1...v0.3.0
[0.3.1]: https://github.com/kitschpatrol/obsidian-ts/compare/v0.3.0...v0.3.1
[0.3.2]: https://github.com/kitschpatrol/obsidian-ts/compare/v0.3.1...v0.3.2
