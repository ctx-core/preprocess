import type { languages_T } from '../regexrules/index.js'
export declare function preprocessFile(
	srcFile:string,
	destFile:string,
	context?:context_T,
	options?:file_options_T
):Promise<Buffer>
export declare function preprocessFileSync(
	srcFile:string,
	destFile:string,
	context?:context_T,
	options?:file_options_T
):Buffer
export declare function preprocess(
	src:string,
	context?:context_T,
	typeOrOptions?:type_T|string_options_T
):string
export type context_T = Record<string, string|number|boolean>
export type file_options_T = {
	srcDir?:string
	type?:type_T
}
export type string_options_T = {
	srcDir?:string
	fileNotFoundSilentFail?:boolean
	srcEol?:string
	type?:type_T
}
export type type_T = keyof languages_T
