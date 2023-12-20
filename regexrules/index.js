/// <reference types="./index.d.ts" />
/** @type {simple_regexrules_T} */
export const simple = {
	echo: '^@echo[ \t]+(.*?)[ \t]*$',
	exec: '^@exec[ \t]+(\\S+)[ \t]*\\((.*)\\)[ \t]*$',
	include: '^(.*)@include(?!-)[ \t]+(.*?)[ \t]*$', // allow prefix characters to specify the indent level of included file
	'include-static': '^(.*)@include-static[ \t]+(.*?)[ \t]*$'
}
/** @type {html_regexrules_T} */
export const html = {
	echo: '<!--[ \t]*@echo[ \t]+(.*?)[ \t]*(?:-->|!>)',
	exec: '<!--[ \t]*@exec[ \t]+(\\S+)[ \t]*\\((.*)\\)[ \t]*(?:-->|!>)',
	include: '(.*)<!--[ \t]*@include(?!-)[ \t]+(.*?)[ \t]*(?:-->|!>)',
	'include-static': '(.*)<!--[ \t]*@include-static[ \t]+(.*?)[ \t]*(?:-->|!>)',
	exclude: {
		start: '[ \t]*<!--[ \t]*@exclude(?:[ \t]+(.*?))?[ \t]*(?:-->|!>)(?:[ \t]*\n+)?',
		end: '[ \t]*<!--[ \t]*@endexclude[ \t]*(?:-->|!>)(?:[ \t]*\n)?'
	},
	extend: {
		start: '[ \t]*<!--[ \t]*@extend(?!able)[ \t]+(.*?)[ \t]*(?:-->|!>)(?:[ \t]*\n+)?',
		end: '[ \t]*<!--[ \t]*@endextend[ \t]*(?:-->|!>)(?:[ \t]*\n)?'
	},
	extendable: '<!--[ \t]*@extendable[ \t]*(?:-->|!>)',
	if: {
		start: '[ \t]*<!--[ \t]*@(ifndef|ifdef|if)[ \t]+(.*?)[ \t]*(?:-->|!>)(?:[ \t]*\n+)?',
		end: '[ \t]*<!(?:--)?[ \t]*@endif[ \t]*(?:-->|!>)(?:[ \t]*\n)?'
	},
	else: '[ \t]*<!(?:--)?[ \t]*@else[ \t]*(?:-->|!>)(?:[ \t]*\n)?',
	foreach: {
		start: '[ \t]*<!--[ \t]*@foreach[ \t]+(.*?)[ \t]*(?:-->|!>)(?:[ \t]*\n+)?',
		end: '[ \t]*<!(?:--)?[ \t]*@endfor[ \t]*(?:-->|!>)(?:[ \t]*\n)?'
	}
}
export const xml = html
/** @type {js_regexrules_T} */
export const js = {
	echo: [
		'/\\*[ \t]*@echo[ \t]+(.*?)[ \t]*\\*(?:\\*|/)',
		'//[ \t]*@echo[ \t]+(.*?)[ \t]*$'
	],
	exec: '(?://|/\\*)[ \t]*@exec[ \t]+(\\S+)[ \t]*\\((.*)\\)[ \t]*(?:\\*(?:\\*|/))?',
	include: [
		'^(.*)/\\*[ \t]*@include(?!-)[ \t]+(.*?)[ \t]*\\*(?:\\*|/)',
		'^(.*)//[ \t]*@include(?!-)[ \t]+(.*?)[ \t]*$'
	],
	'include-static': [
		'^(.*)/\\*[ \t]*@include-static[ \t]+(.*?)[ \t]*\\*(?:\\*|/)',
		'^(.*)//[ \t]*@include-static[ \t]+(.*?)[ \t]*$'
	],
	exclude: {
		start: '[ \t]*(?://|/\\*)[ \t]*@exclude(?:[ \t]+([^\n*]*))?[ \t]*(?:\\*(?:\\*|/))?(?:[ \t]*\n+)?',
		end: '[ \t]*(?://|/\\*)[ \t]*@endexclude[ \t]*(?:\\*(?:\\*|/))?(?:[ \t]*\n)?'
	},
	extend: {
		start: '[ \t]*(?://|/\\*)[ \t]*@extend(?!able)[ \t]+([^\n*]*)(?:\\*(?:\\*|/))?(?:[ \t]*\n+)?',
		end: '[ \t]*(?://|/\\*)[ \t]*@endextend[ \t]*(?:\\*(?:\\*|/))?(?:[ \t]*\n)?'
	},
	extendable: '[ \t]*(?://|/\\*)[ \t]*@extendable[ \t]*(?:\\*/)?',
	if: {
		start: '[ \t]*(?://|/\\*)[ \t]*@(ifndef|ifdef|if)[ \t]+([^\n*]*)(?:\\*(?:\\*|/))?(?:[ \t]*\n+)?',
		end: '[ \t]*(?://|/\\*)[ \t]*@endif[ \t]*(?:\\*(?:\\*|/))?(?:[ \t]*\n)?'
	},
	else: '[ \t]*(?://|/\\*)[ \t]*@else[ \t]*(?:\\*(?:\\*|/))?(?:[ \t]*\n)?',
	foreach: {
		start: '[ \t]*(?://|/\\*)[ \t]*@foreach[ \t]+([^\n*]*)(?:\\*(?:\\*|/))?(?:[ \t]*\n+)?',
		end: '[ \t]*(?://|/\\*)[ \t]*@endfor[ \t]*(?:\\*(?:\\*|/))?(?:[ \t]*\n)?'
	}
}
export const javascript = js
export const jsx = js
export const json = js
export const c = js
export const cc = js
export const cpp = js
export const cs = js
export const csharp = js
export const java = js
export const less = js
export const sass = js
export const css = js
export const php = js
export const ts = js
export const tsx = js
export const peg = js
export const pegjs = js
export const jade = js
export const styl = js
export const go = js
/** @type {coffee_regexrules_T} */
export const coffee = {
	echo: '#+[ \t]*@echo[ \t]+(.*?)[ \t]*$',
	exec: '#+[ \t]*@exec[ \t]+(\\S+)[ \t]*\\((.*)\\)[ \t]*$',
	include: '^(.*?)#+[ \t]*@include(?!-)[ \t]+(.*?)[ \t]*$',
	'include-static': '^(.*?)#+[ \t]*@include-static[ \t]+(.*?)[ \t]*$',
	exclude: {
		start: '^[ \t]*#+[ \t]*@exclude(?:[ \t]+(.*?))?[ \t]*\n+',
		end: '^[ \t]*#+[ \t]*@endexclude[ \t]*\n?'
	},
	extend: {
		start: '^[ \t]*#+[ \t]*@extend(?!able)[ \t]+(.*?)\n+',
		end: '^[ \t]*#+[ \t]*@endextend[ \t]*\n?'
	},
	extendable: '^[ \t]*#+[ \t]*@extendable[ \t]*$',
	if: {
		start: '^[ \t]*#+[ \t]*@(ifndef|ifdef|if)[ \t]+(.*?)[ \t]*\n+',
		end: '^[ \t]*#+[ \t]*@endif[ \t]*\n?'
	},
	else: '^[ \t]*#+[ \t]*@else[ \t]*\n?',
	foreach: {
		start: '^[ \t]*#+[ \t]*@foreach[ \t]+(.*?)[ \t]*\n+',
		end: '^[ \t]*#+[ \t]*@endfor[ \t]*\n?'
	}
}
export const bash = coffee
export const shell = coffee
export const sh = coffee
