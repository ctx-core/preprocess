/// <reference types="./index.d.ts" />
/*
 * preprocess
 * https://github.com/ctx-core/preprocess
 *
 * Copyright (c) Brian Takita
 * Written by Brian Takita - https://briantakita.me/
 * Copyright (c) 2012 OneHealth Solutions, Inc.
 * Written by Jarrod Overson - http://jarrodoverson.com/
 * Licensed under the Apache 2.0 license.
 */
import { readFileSync, statSync, writeFileSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { EOL } from 'os'
import { dirname, extname, join } from 'path'
import XRegExp from 'xregexp'
import * as regexrules from '../regexrules/index.js'
const { escape, matchRecursive } = XRegExp
/**
 * @param {string}srcFile
 * @param {string}destFile
 * @param {context_T}[context]
 * @param {file_options_T}[options]
 * @returns {Promise<Buffer>}
 */
export async function preprocessFile(
	srcFile,
	destFile,
	context,
	options
) {
	options = getOptionsForFile(srcFile, options)
	context.src = srcFile
	const data = await readFile(srcFile)
	let parsed = preprocess(data, context, options)
	return writeFile(destFile, parsed)
}
/**
 * @param {string}srcFile
 * @param {string}destFile
 * @param {context_T}[context]
 * @param {file_options_T}[options]
 * @returns {Buffer}
 */
export function preprocessFileSync(
	srcFile,
	destFile,
	context,
	options
) {
	options = getOptionsForFile(srcFile, options)
	context.src = srcFile
	let data = readFileSync(srcFile)
	let parsed = preprocess(data, context, options)
	return writeFileSync(destFile, parsed)
}
function getOptionsForFile(srcFile, options) {
	options = options || {}
	options.srcDir = options.srcDir || dirname(srcFile)
	options.type = options.type || getExtension(srcFile)
	return options
}
function getExtension(filename) {
	let ext = extname(filename || '').split('.')
	return ext[ext.length - 1]
}
/**
 * @param {string}src
 * @param {context_T}[context]
 * @param {type_T|string_options_T}[typeOrOptions]
 * @returns {string}
 */
export function preprocess(
	src,
	context,
	typeOrOptions
) {
	src += ''
	context = context || process.env
	// default values
	let options = {
		fileNotFoundSilentFail: false,
		srcDir: process.cwd(),
		srcEol: getEolType(src),
		type: regexrules['html']
	}
	// needed for backward compatibility with 2.x.x series
	if (typeof typeOrOptions === 'string') {
		typeOrOptions = {
			type: typeOrOptions
		}
	}
	// needed for backward compatibility with 2.x.x series
	if (typeof context.srcDir === 'string') {
		typeOrOptions = typeOrOptions || {}
		typeOrOptions.srcDir = context.srcDir
	}
	if (typeOrOptions && typeof typeOrOptions === 'object') {
		options.srcDir = typeOrOptions.srcDir || options.srcDir
		options.fileNotFoundSilentFail = typeOrOptions.fileNotFoundSilentFail || options.fileNotFoundSilentFail
		options.srcEol = typeOrOptions.srcEol || options.srcEol
		options.type = regexrules[typeOrOptions.type] || options.type
	}
	context = copy(context)
	return preprocessor(src, context, options)
}
function preprocessor(src, context, opts, noRestoreEol) {
	src = normalizeEol(src)
	let rv = src
	rv = replace(
		rv,
		opts.type.include,
		processIncludeDirective.bind(null, false, context, opts))
	if (opts.type.extend) {
		rv = replaceRecursive(rv, opts.type.extend, (startMatches, endMatches, include, recurse)=>{
			let file = (startMatches[1] || '').trim()
			let extendedContext = copy(context)
			let extendedOpts = copy(opts)
			extendedContext.src = join(opts.srcDir, file)
			extendedOpts.srcDir = dirname(extendedContext.src)
			let fileContents = getFileContents(extendedContext.src, opts.fileNotFoundSilentFail, context.src)
			if (fileContents.error) {
				return fileContents.contents
			}
			let extendedSource = preprocessor(fileContents.contents, extendedContext, extendedOpts, true).trim()
			if (extendedSource) {
				include = include.replace(/^\n?|\n?$/g, '')
				return replace(extendedSource, opts.type.extendable, recurse(include))
			} else {
				return ''
			}
		})
	}
	if (opts.type.foreach) {
		rv = replaceRecursive(rv, opts.type.foreach, (startMatches, endMatches, include, recurse)=>{
			let variable = (startMatches[1] || '').trim()
			let forParams = variable.split(' ')
			if (forParams.length === 3) {
				let contextVar = forParams[2]
				let arrString = getDeepPropFromObj(context, contextVar)
				let eachArr
				if (arrString.match(/\{(.*)\}/)) {
					eachArr = JSON.parse(arrString)
				} else if (arrString.match(/\[(.*)\]/)) {
					eachArr = arrString.slice(1, -1)
					eachArr = eachArr.split(',')
					eachArr = eachArr.map(arrEntry=>{
						return arrEntry.replace(/\s*(['"])(.*)\1\s*/, '$2')
					})
				} else {
					eachArr = arrString.split(',')
				}
				let replaceToken = new RegExp(escape(forParams[0]), 'g')
				let recursedInclude = recurse(include)
				return Object.keys(eachArr).reduce((stringBuilder, arrKey)=>{
					let arrEntry = eachArr[arrKey]
					return stringBuilder + recursedInclude.replace(replaceToken, arrEntry)
				}, '')
			} else {
				return ''
			}
		})
	}
	if (opts.type.exclude) {
		rv = replaceRecursive(rv, opts.type.exclude, (startMatches, endMatches, include, recurse)=>{
			let test = (startMatches[1] || '').trim()
			return testPasses(test, context) ? '' : recurse(include)
		})
	}
	if (opts.type.if) {
		rv = replaceRecursive(rv, opts.type.if, (startMatches, endMatches, include, recurse)=>{
			// I need to recurse first, so I don't catch "inner" else-directives
			let recursed = recurse(include)
			// look for the first else-directive
			let matches = opts.type.else && recursed.match(new RegExp(opts.type.else))
			let match = (matches || [''])[0]
			let index = match ? recursed.indexOf(match) : recursed.length
			let ifBlock = recursed.substring(0, index)
			let elseBlock = recursed.substring(index + match.length) // empty string if no else-directive
			let variant = startMatches[1]
			let test = (startMatches[2] || '').trim()
			switch (variant) {
				case 'if':
					return testPasses(test, context) ? ifBlock : elseBlock
				case 'ifdef':
					return typeof getDeepPropFromObj(context, test) !== 'undefined' ? ifBlock : elseBlock
				case 'ifndef':
					return typeof getDeepPropFromObj(context, test) === 'undefined' ? ifBlock : elseBlock
				default:
					throw new Error('Unknown if variant ' + variant + '.')
			}
		})
	}
	rv = replace(rv, opts.type.echo, (match, variable)=>{
		variable = (variable || '').trim()
		// if we are surrounded by quotes, echo as a string
		let stringMatch = variable.match(/^(['"])(.*)\1$/)
		if (stringMatch) return stringMatch[2]
		return getDeepPropFromObj(context, (variable || '').trim())
	})
	rv = replace(rv, opts.type.exec, (match, name, value)=>{
		name = (name || '').trim()
		value = value || ''
		let params = value.split(',')
		let stringRegex = /^['"](.*)['"]$/
		params = params.map(param=>{
			param = param.trim()
			if (stringRegex.test(param)) { // handle string parameter
				return param.replace(stringRegex, '$1')
			} else { // handle variable parameter
				return getDeepPropFromObj(context, param)
			}
		})
		let fn = getDeepPropFromObj(context, name)
		if (!fn || typeof fn !== 'function') return ''
		return fn.apply(context, params)
	})
	rv = replace(rv, opts.type['include-static'], processIncludeDirective.bind(null, true, context, opts))
	if (!noRestoreEol) {
		rv = restoreEol(rv, opts.srcEol)
	}
	return rv
}
function getEolType(source) {
	let eol
	let foundEolTypeCnt = 0
	if (source.indexOf('\r\n') >= 0) {
		eol = '\r\n'
		foundEolTypeCnt++
	}
	if (/\r[^\n]/.test(source)) {
		eol = '\r'
		foundEolTypeCnt++
	}
	if (/[^\r]\n/.test(source)) {
		eol = '\n'
		foundEolTypeCnt++
	}
	if (eol == null || foundEolTypeCnt > 1) {
		eol = EOL
	}
	return eol
}
function normalizeEol(source, indent) {
	// only process any kind of EOL if indentation has to be added, otherwise replace only non \n EOLs
	if (indent) {
		source = source.replace(/(?:\r?\n)|\r/g, '\n' + indent)
	} else {
		source = source.replace(/(?:\r\n)|\r/g, '\n')
	}
	return source
}
function restoreEol(normalizedSource, originalEol) {
	if (originalEol !== '\n') {
		normalizedSource = normalizedSource.replace(/\n/g, originalEol)
	}
	return normalizedSource
}
function replace(rv, rule, processor) {
	let isRegex = typeof rule === 'string' || rule instanceof RegExp
	let isArray = Array.isArray(rule)
	if (isRegex) {
		rule = [new RegExp(rule, 'gmi')]
	} else if (isArray) {
		rule = rule.map(subRule=>{
			return new RegExp(subRule, 'gmi')
		})
	} else {
		throw new Error('Rule must be a String, a RegExp, or an Array.')
	}
	return rule.reduce((rv, rule)=>
		rv.replace(rule, processor),
	rv)
}
function replaceRecursive(rv, rule, processor) {
	if (!rule.start || !rule.end) {
		throw new Error('Recursive rule must have start and end.')
	}
	let startRegex = new RegExp(rule.start, 'mi')
	let endRegex = new RegExp(rule.end, 'mi')
	let matchReplacePass = content=>{
		let matches = matchRecursive(content, rule.start, rule.end, 'gmi', {
			valueNames: ['between', 'left', 'match', 'right']
		})
		let matchGroup = {
			left: null,
			match: null,
			right: null
		}
		return matches.reduce((builder, match)=>{
			switch (match.name) {
				case 'between':
					builder += match.value
					break
				case 'left':
					matchGroup.left = startRegex.exec(match.value)
					break
				case 'match':
					matchGroup.match = match.value
					break
				case 'right':
					matchGroup.right = endRegex.exec(match.value)
					builder += processor(matchGroup.left, matchGroup.right, matchGroup.match, matchReplacePass)
					break
			}
			return builder
		}, '')
	}
	return matchReplacePass(rv)
}
function processIncludeDirective(isStatic, context, opts, match, linePrefix, file) {
	file = (file || '').trim()
	let indent = linePrefix.replace(/\S/g, ' ')
	let includedContext = copy(context)
	let includedOpts = copy(opts)
	includedContext.src = join(opts.srcDir, file)
	includedOpts.srcDir = dirname(includedContext.src)
	let fileContents = getFileContents(includedContext.src, opts.fileNotFoundSilentFail, context.src)
	if (fileContents.error) {
		return linePrefix + fileContents.contents
	}
	let includedSource = fileContents.contents
	if (isStatic) {
		includedSource = fileContents.contents
	} else {
		includedSource = preprocessor(fileContents.contents, includedContext, includedOpts, true)
	}
	includedSource = normalizeEol(includedSource, indent)
	if (includedSource) {
		return linePrefix + includedSource
	} else {
		return linePrefix
	}
}
function getTestTemplate(test) {
	/*jshint evil:true*/
	test = test || 'true'
	test = test.trim()
	// force single equals replacement
	test = test.replace(/([^=!])=([^=])/g, '$1==$2')
	return new Function('context', 'with (context||{}){ return ( ' + test + ' ); }')
}
function testPasses(test, context) {
	let testFn = getTestTemplate(test)
	return testFn(context, getDeepPropFromObj)
}
function getFileContents(path, failSilent, requesterPath) {
	try {
		statSync(path)
	} catch (e) {
		if (failSilent) {
			return { error: true, contents: path + ' not found!' }
		} else {
			let errMsg = path
			errMsg = requesterPath ? errMsg + ' requested from ' + requesterPath : errMsg
			errMsg += ' not found!'
			throw new Error(errMsg)
		}
	}
	return { error: false, contents: '' + readFileSync(path) }
}
function copy(obj) {
	return Object.keys(obj).reduce((copyObj, objKey)=>{
		copyObj[objKey] = obj[objKey]
		return copyObj
	}, {})
}
function getDeepPropFromObj(obj, propPath) {
	propPath.replace(/\[([^\]+?])\]/g, '.$1')
	propPath = propPath.split('.')
	// fast path, no need to loop if structurePath contains only a single segment
	if (propPath.length === 1) {
		return obj[propPath[0]]
	}
	// loop only as long as possible (no exceptions for null/undefined property access)
	propPath.some(pathSegment=>{
		obj = obj[pathSegment]
		return (obj == null)
	})
	return obj
}
