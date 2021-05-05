const readFile = require('fs').readFileSync
const writeFile = require('fs').writeFileSync
const prettier = require('prettier')

const formatFile = async (inputFilePath, outputFilePath) => {
  const fileContent = await readFile(inputFilePath, 'utf8')
  const prettierConfig = await prettier.resolveConfig(inputFilePath)
  const writtenFilePath = await writeFile(
    outputFilePath,
    prettier.format(fileContent, { ...prettierConfig, filepath: inputFilePath }),
  )

  return writtenFilePath
}

module.exports = {
  formatFile
}
