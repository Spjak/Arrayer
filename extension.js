const vscode = require('vscode')
const QUOTE = '"'
const SEPARATOR = ','
const BRACKET_START = '['
const BRACKET_END = ']'
const PATTERN_SEARCH_LINE_COUNT = 2

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "arrayer" is now active!')

	let disposable = vscode.commands.registerCommand('arrayer.convert', function () {
		let editor = vscode.window.activeTextEditor
		let text = vscode.window.activeTextEditor.document.getText(editor.selection)

		// Split data into lines by newline
		let lines = text.toString().split('\n')
		// Remove spaces
		lines = lines.map(l => l.trim())
		console.table(lines)
		// Look for patterns
		let patternLines = lines.slice(0,Math.min(lines.length, PATTERN_SEARCH_LINE_COUNT))
	    // Find extra separator characters
		let startSeparatorCount = 0
		let endSeparatorCount = 0
		for (let p of patternLines) {
			if (isSeparator(p.substring(0, 1)))
			{
				startSeparatorCount++
			}
			if (isSeparator(p.substring(p.length - 1, p.length)))
			{
				endSeparatorCount++
			}
		}
		// Remove extra separator characters
		if (startSeparatorCount == patternLines.length) {
			lines = lines.map(l => removeStartSeparator(l))
		}
		if (endSeparatorCount == patternLines.length) {
			lines = lines.map(l => removeEndSeparator(l))
		}
		// Detect if lines are numbers, to allow unquoted list
		patternLines = lines.slice(0,Math.min(lines.length, PATTERN_SEARCH_LINE_COUNT))
		let isNumbers = true
		for (let p of patternLines) {
			if (!isNumber(p))
			{
				isNumbers = false
				break
			}
		}
		// Generate output array
		outputString = BRACKET_START
		if (isNumbers) {
			lines.forEach(l => outputString += `${l}${SEPARATOR}`)
		}
		else {
			lines.forEach(l => outputString += `${QUOTE}${l}${QUOTE}${SEPARATOR}`)
		}
		outputString = outputString.substring(0, outputString.length - 1)
		outputString += BRACKET_END
		editor.edit((editBuilder) => {
			editBuilder.replace(editor.selection, outputString)
		})  
		vscode.window.showInformationMessage(`${outputString}`)
	});

	context.subscriptions.push(disposable)
}

function deactivate() {}

function isSeparator(s) {
    let separatorRegex = /[,;]/
    return s.match(separatorRegex)
}

function removeStartSeparator(s) {
	let separatorRegex = /^([,;])(.*)/
	let res = s.match(separatorRegex)
	return res ? res[2] : s
}

function removeEndSeparator(s) {
	let separatorRegex = /(.*)([,;])$/
	let res = s.match(separatorRegex)
	return res ? res[1] : s
}

function isNumber(s) {
    let numberRegex = /^(-?)([0-9]+)[\.]?([0-9]+)$/
    return s.match(numberRegex)
}

module.exports = {
	activate,
	deactivate
}
