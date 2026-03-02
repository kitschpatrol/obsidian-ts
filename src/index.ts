/* eslint-disable unicorn/prefer-export-from -- local bindings needed for default export */
import * as base from './commands/base'
import * as bookmark from './commands/bookmark'
import * as command from './commands/command'
import * as daily from './commands/daily'
import * as dev from './commands/dev'
import * as diff from './commands/diff'
import * as file from './commands/file'
import * as folder from './commands/folder'
import * as general from './commands/general'
import * as history from './commands/history'
import * as hotkey from './commands/hotkey'
import * as link from './commands/link'
import * as outline from './commands/outline'
import * as plugin from './commands/plugin'
import * as property from './commands/property'
import * as publish from './commands/publish'
import * as random from './commands/random'
import * as search from './commands/search'
import * as snippet from './commands/snippet'
import * as sync from './commands/sync'
import * as tag from './commands/tag'
import * as task from './commands/task'
import * as template from './commands/template'
import * as theme from './commands/theme'
import * as unique from './commands/unique'
import * as vault from './commands/vault'
import * as web from './commands/web'
import * as wordcount from './commands/wordcount'
import * as workspace from './commands/workspace'
import {
	configure,
	getVault,
	isCompatible,
	ObsidianError,
	ObsidianNotFoundError,
	ObsidianVersionError,
} from './exec'
import { setLogger } from './log'

export {
	base,
	bookmark,
	command,
	configure,
	daily,
	dev,
	diff,
	file,
	folder,
	general,
	getVault,
	history,
	hotkey,
	isCompatible,
	link,
	ObsidianError,
	ObsidianNotFoundError,
	ObsidianVersionError,
	outline,
	plugin,
	property,
	publish,
	random,
	search,
	setLogger,
	snippet,
	sync,
	tag,
	task,
	template,
	theme,
	unique,
	vault,
	web,
	wordcount,
	workspace,
}

// Re-export all types from command modules at the top level
export type { BaseCreateOptions, BaseQueryOptions, BaseQueryResult } from './commands/base'

export type { BookmarkAddOptions, BookmarkInfo } from './commands/bookmark'
export type { CommandExecuteOptions, CommandListOptions } from './commands/command'
export type { DailyAppendOptions, DailyOpenOptions, DailyPrependOptions } from './commands/daily'
export type {
	DevCdpOptions,
	DevConsoleOptions,
	DevCssOptions,
	DevDebugOptions,
	DevDomOptions,
	DevErrorsOptions,
	DevEvaluateOptions,
	DevMobileOptions,
	DevScreenshotOptions,
} from './commands/dev'
export type { DiffOptions } from './commands/diff'
export type {
	FileAppendOptions,
	FileCreateOptions,
	FileDeleteOptions,
	FileInfo,
	FileListOptions,
	FileMoveOptions,
	FileOpenOptions,
	FilePrependOptions,
	FileRenameOptions,
} from './commands/file'
export type { FolderInfo, FolderInfoOptions, FolderListOptions } from './commands/folder'
export type { VersionInfo } from './commands/general'
export type { HistoryReadOptions, HistoryRestoreOptions } from './commands/history'
export type { HotkeyGetOptions, HotkeyInfo } from './commands/hotkey'
export type { BacklinkInfo, UnresolvedLinkInfo } from './commands/link'
export type { OutlineHeading } from './commands/outline'
export type {
	PluginDisableOptions,
	PluginEnabledOptions,
	PluginEnableOptions,
	PluginFilter,
	PluginInfo,
	PluginInfoOptions,
	PluginInstallOptions,
	PluginListOptions,
	PluginReloadOptions,
	PluginRestrictOptions,
	PluginUninstallOptions,
} from './commands/plugin'
export type {
	PropertyAliasesOptions,
	PropertyInfo,
	PropertyListOptions,
	PropertyReadOptions,
	PropertyRemoveOptions,
	PropertySetOptions,
} from './commands/property'
export type { PublishAddOptions, PublishSiteInfo, PublishStatusOptions } from './commands/publish'
export type { RandomOpenOptions, RandomReadOptions } from './commands/random'
export type {
	SearchContextMatch,
	SearchContextOptions,
	SearchContextResult,
	SearchOpenOptions,
	SearchQueryOptions,
	SearchTotalOptions,
} from './commands/search'
export type { SnippetDisableOptions, SnippetEnableOptions } from './commands/snippet'
export type { SyncReadOptions, SyncRestoreOptions, SyncToggleOptions } from './commands/sync'
export type { TagInfo, TagInfoOptions, TagListOptions } from './commands/tag'
export type { TaskInfo, TaskListOptions, TaskShowOptions, TaskUpdateOptions } from './commands/task'
export type { TemplateInsertOptions, TemplateReadOptions } from './commands/template'
export type {
	ThemeInfoOptions,
	ThemeInstallOptions,
	ThemeSetOptions,
	ThemeUninstallOptions,
} from './commands/theme'
export type { UniqueCreateOptions } from './commands/unique'
export type { VaultInfo, VaultInfoOptions, VaultListItem, VaultOpenOptions } from './commands/vault'
export type { WebOpenOptions } from './commands/web'
export type { WordCountInfo } from './commands/wordcount'
export type {
	WorkspaceDeleteOptions,
	WorkspaceLoadOptions,
	WorkspaceOpenTabOptions,
	WorkspaceSaveOptions,
} from './commands/workspace'
export type * from './types'

export default {
	base,
	bookmark,
	command,
	configure,
	daily,
	dev,
	diff,
	file,
	folder,
	general,
	getVault,
	history,
	hotkey,
	isCompatible,
	link,
	/* eslint-disable ts/naming-convention -- error classes are PascalCase by convention */
	ObsidianError,
	ObsidianNotFoundError,
	ObsidianVersionError,
	/* eslint-enable ts/naming-convention */
	outline,
	plugin,
	property,
	publish,
	random,
	search,
	setLogger,
	snippet,
	sync,
	tag,
	task,
	template,
	theme,
	unique,
	vault,
	web,
	wordcount,
	workspace,
}
