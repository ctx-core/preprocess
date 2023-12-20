export declare const simple:simple_regexrules_T
export declare const html:html_regexrules_T
export declare const xml:html_regexrules_T
export declare const js:js_regexrules_T
export declare const javascript:js_regexrules_T
export declare const jsx:js_regexrules_T
export declare const json:js_regexrules_T
export declare const c:js_regexrules_T
export declare const cc:js_regexrules_T
export declare const cpp:js_regexrules_T
export declare const cs:js_regexrules_T
export declare const csharp:js_regexrules_T
export declare const java:js_regexrules_T
export declare const less:js_regexrules_T
export declare const sass:js_regexrules_T
export declare const css:js_regexrules_T
export declare const php:js_regexrules_T
export declare const ts:js_regexrules_T
export declare const tsx:js_regexrules_T
export declare const peg:js_regexrules_T
export declare const pegjs:js_regexrules_T
export declare const jade:js_regexrules_T
export declare const styl:js_regexrules_T
export declare const go:js_regexrules_T
export declare const coffee:js_regexrules_T
export declare const bash:js_regexrules_T
export declare const shell:js_regexrules_T
export declare const sh:js_regexrules_T
export type languages_T = {
	simple:simple_regexrules_T
	html:html_regexrules_T
	xml:html_regexrules_T
	js:js_regexrules_T
	javascript:js_regexrules_T
	jsx:js_regexrules_T
	json:js_regexrules_T
	c:js_regexrules_T
	cc:js_regexrules_T
	cpp:js_regexrules_T
	cs:js_regexrules_T
	csharp:js_regexrules_T
	java:js_regexrules_T
	less:js_regexrules_T
	sass:js_regexrules_T
	css:js_regexrules_T
	php:js_regexrules_T
	ts:js_regexrules_T
	tsx:js_regexrules_T
	peg:js_regexrules_T
	pegjs:js_regexrules_T
	jade:js_regexrules_T
	styl:js_regexrules_T
	go:js_regexrules_T
	coffee:js_regexrules_T
	bash:js_regexrules_T
	shell:js_regexrules_T
	sh:js_regexrules_T
}
export type simple_regexrules_T = {
	echo:string
	exec:string
	include:string
	'include-static':string
}
export type html_regexrules_T = {
	echo:string
	exec:string
	include:string
	'include-static':string
	exclude:{
		start:string
		end:string
	}
	extend:{
		start:string
		end:string
	}
	extendable:string
	if:{
		start:string
		end:string
	}
	else:string
	foreach:{
		start:string
		end:string
	}
}
export type js_regexrules_T = {
	echo:string[]
	exec:string
	include:string[]
	'include-static':string[]
	exclude:{
		start:string
		end:string
	}
	extend:{
		start:string
		end:string
	}
	extendable:string
	if:{
		start:string
		end:string
	}
	else:string
	foreach:{
		start:string
		end:string
	}
}
export type coffee_regexrules_T = {
	echo:string
	exec:string
	include:string
	'include-static':string
	exclude:{
		start:string
		end:string
	}
	extend:{
		start:string
		end:string
	}
	extendable:string
	if:{
		start:string
		end:string
	}
	else:string
	foreach:{
		start:string
		end:string
	}
}
