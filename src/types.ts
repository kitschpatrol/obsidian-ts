import type { Simplify } from 'type-fest'

export type Vault = {
	vault?: string
}

export type FileOrPath = {
	file?: string
	path?: string
}

export type VaultFile = Simplify<FileOrPath & Vault>

export type PaneType = 'split' | 'tab' | 'window'
