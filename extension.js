const vscode = require('vscode')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('arrayer.convert', function () {
		let editor = vscode.window.activeTextEditor
		let conf = vscode.workspace.getConfiguration()

		const PATTERN_SEARCH_LINE_COUNT = conf.get("arrayer.patternSearchLines")
		const QUOTE = conf.get("arrayer.quoteStyle")
		const SEPARATOR = conf.get("arrayer.separatorStyle")
		const BRACKET_START = conf.get("arrayer.bracketStyle") == "none" ? "" : conf.get("arrayer.bracketStyle").substring(0,1)
		const BRACKET_END = conf.get("arrayer.bracketStyle") == "none" ? "" : conf.get("arrayer.bracketStyle").substring(1,2)

		let text = vscode.window.activeTextEditor.document.getText(editor.selection)
		if (text)
		{
			// Split data into lines by newline
			let lines = text.toString().split('\n')
			// Remove spaces
			lines = lines.map(l => l.trim())
			let isNumbers = null
			
			// Look for patterns
			if (PATTERN_SEARCH_LINE_COUNT > 0) {
				let patternLines = lines.slice(0, Math.min(lines.length, PATTERN_SEARCH_LINE_COUNT))
			
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
				patternLines = lines.slice(0, Math.min(lines.length, PATTERN_SEARCH_LINE_COUNT))
				isNumbers = true				
				for (let p of patternLines) {
					if (!isNumber(p))
					{
						isNumbers = false
						break
					}
				}
				hasQuotes = true
				// Detect if lines have quotes already
				for (let p of patternLines) {
					if (!hasQuote(p))
					{
						hasQuotes = false
						break
					}
				}
			}
			
			// Generate output array
			outputString = BRACKET_START
			if (isNumbers || hasQuotes) {
				lines.forEach(l => outputString += `${l}${SEPARATOR}`)
			}
			else {
				lines.forEach(l => outputString += `${QUOTE}${l}${QUOTE}${SEPARATOR}`)
			}
			outputString = outputString.substring(0, outputString.length - 1)
			outputString += BRACKET_END

			// Replace text in editor
			editor.edit((editBuilder) => {
				editBuilder.replace(editor.selection, outputString)
			}) 
		}
	});

	context.subscriptions.push(disposable)
}

function deactivate() {}

function isSeparator(s) {
    let separatorRegex = /[,;:]/
    return s.match(separatorRegex)
}

function removeStartSeparator(s) {
	let separatorRegex = /^([,;:])(.*)/
	let res = s.match(separatorRegex)
	return res ? res[2] : s
}

function removeEndSeparator(s) {
	let separatorRegex = /(.*)([,;:])$/
	let res = s.match(separatorRegex)
	return res ? res[1] : s
}

function isNumber(s) {
    let numberRegex = /^(-?)([0-9]+)[\.]?([0-9]+)$/
    return s.match(numberRegex)
}

function hasQuote(s) {
    let quoteRegex = /^["'].*["']$/
    return s.match(quoteRegex)
}

module.exports = {
	activate,
	deactivate
}
