import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import {
	parseJsonWith,
	parseKeyValue,
	parseKeyValueWith,
	parseLines,
	parseNumber,
	stripPrefix,
} from '../src/parse'

describe('parseKeyValue', () => {
	it('parses tab-separated key-value pairs', () => {
		expect(parseKeyValue('name\tTest\npath\tnotes/test.md')).toEqual({
			name: 'Test',
			path: 'notes/test.md',
		})
	})

	it('returns empty object for empty input', () => {
		expect(parseKeyValue('')).toEqual({})
	})

	it('skips lines without tabs', () => {
		expect(parseKeyValue('no tab here\nkey\tvalue')).toEqual({ key: 'value' })
	})

	it('handles trailing newlines', () => {
		expect(parseKeyValue('a\t1\nb\t2\n')).toEqual({ a: '1', b: '2' })
	})

	it('handles values containing tabs', () => {
		expect(parseKeyValue('key\tval\twith\ttabs')).toEqual({ key: 'val\twith\ttabs' })
	})
})

describe('parseLines', () => {
	it('splits output into trimmed non-empty lines', () => {
		expect(parseLines('file1.md\nfile2.md\nfile3.md')).toEqual(['file1.md', 'file2.md', 'file3.md'])
	})

	it('returns empty array for empty string', () => {
		expect(parseLines('')).toEqual([])
	})

	it('filters whitespace-only lines', () => {
		expect(parseLines('a\n  \nb')).toEqual(['a', 'b'])
	})

	it('handles trailing newlines', () => {
		expect(parseLines('one\ntwo\n')).toEqual(['one', 'two'])
	})
})

describe('parseKeyValueWith', () => {
	it('parses and validates against a Zod schema', () => {
		const schema = z.object({ count: z.coerce.number(), name: z.string() })
		const result = parseKeyValueWith('name\thello\ncount\t42', schema)
		expect(result).toEqual({ count: 42, name: 'hello' })
	})

	it('throws on schema validation failure', () => {
		const schema = z.object({ required: z.string() })
		expect(() => parseKeyValueWith('other\tvalue', schema)).toThrow()
	})
})

describe('parseJsonWith', () => {
	it('parses and validates JSON arrays', () => {
		const schema = z.array(z.string())
		expect(parseJsonWith('["a","b"]', schema)).toEqual(['a', 'b'])
	})

	it('parses and validates JSON objects', () => {
		const schema = z.object({ x: z.coerce.number() })
		expect(parseJsonWith('{"x":1}', schema)).toEqual({ x: 1 })
	})

	it('throws on invalid JSON', () => {
		const schema = z.array(z.string())
		expect(() => parseJsonWith('not json', schema)).toThrow()
	})

	it('throws on schema validation failure', () => {
		const schema = z.object({ x: z.number() })
		expect(() => parseJsonWith('{"y":1}', schema)).toThrow()
	})
})

describe('stripPrefix', () => {
	it('removes prefix up to and including first colon', () => {
		expect(stripPrefix('Opened: welcome.md')).toBe('welcome.md')
	})

	it('returns trimmed string when no colon present', () => {
		expect(stripPrefix('  no colon  ')).toBe('no colon')
	})

	it('handles colons in the value portion', () => {
		expect(stripPrefix('Key: value: with: colons')).toBe('value: with: colons')
	})
})

describe('parseNumber', () => {
	it('parses integer strings', () => {
		expect(parseNumber('42')).toBe(42)
	})

	it('handles padded whitespace', () => {
		expect(parseNumber('  7  ')).toBe(7)
	})

	it('throws on non-numeric input', () => {
		expect(() => parseNumber('not a number')).toThrow(TypeError)
	})
})
