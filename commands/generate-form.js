
const pascalCase = require('pascal-case').pascalCase
const dashCase = require('param-case').paramCase
const camelCase = require('camel-case').camelCase
const formatFile = require('../prettier/format-file').formatFile

const createRow = async (prompt, rows = []) => {
  const shouldCreateRow = await prompt.confirm('Would you like to create a row of inputs?')
  if (shouldCreateRow) {
    const inputs = await createNewInput(prompt)
    const newListOfRows = [
      ...rows,
      {
        inputs
      }
    ]
    return await createRow(prompt, newListOfRows)
  }
  return await rows
}

const createNewInput = async (prompt, inputs = []) => {
  const shouldCreateInput = await prompt.confirm('Would you like to create a new input?')
  if (shouldCreateInput) {
    const results = await prompt.ask([
      {
        type: 'input',
        name: 'inputName',
        message: 'What is the name of the input?',
      },
      {
        type: 'select',
        name: 'inputType',
        message: 'What is the type of the input?',
        choices: ['text', 'select']
      },
      {
        type: 'select',
        name: 'inputSize',
        message: 'What is the size of the input?',
        choices: ['small', 'medium', 'large']
      },
    ])
    const newListOfInputs = [...inputs, {
      inputName: results.inputName,
      inputType: results.inputType,
      inputSize: results.inputSize,
    }];
    return await createNewInput(prompt, newListOfInputs)
  }
  return await inputs
}

module.exports = {
  name: 'generate-form',
  alias: ['gf'],
  run: async (toolbox) => {
    const {
      parameters,
      template: { generate },
      print: { info },
      prompt,
    } = toolbox

    const results = await prompt.ask([
      {
        type: 'input',
        name: 'formName',
        message: 'What is the name of the form?',
      },
      {
        type: 'input',
        name: 'formPath',
        message: 'What is the form path?',
        default: 'src/components/',
      },
    ])
    const name = dashCase(results.formName);
    const path = results.formPath.replace(/\/$/, '');
    const properName = pascalCase(name)
    const rows = await createRow(prompt);

    await generate({
      template: 'form-template.js.ejs',
      target: `${results.formPath}/${results.formName}.jsx`,
      props: {
        properName,
        formName: name,
        formPath: path,
        rows,
        pascalCase,
        camelCase,
        dashCase
      },
    }).then(() => {
      return formatFile(
        `${results.formPath}/${results.formName}.jsx`,
        `${results.formPath}/${results.formName}.jsx`,
      )
    })

    await generate({
      template: 'test-display-template.js.ejs',
      target: `${results.formPath}/test-display.jsx`,
      props: {
        rows,
        pascalCase,
        camelCase,
        dashCase
      },
    }).then(() => {
      return formatFile(
        `${results.formPath}/test-display.jsx`,
        `${results.formPath}/test-display.jsx`,
      )
    })

    await Promise.all(rows.map(async (row) => {
      return await Promise.all(row.inputs.map(async (input) => {
        const dashName = dashCase(input.inputName);
        return await generate({
          template: 'input-template.js.ejs',
          target: `${results.formPath}/${dashName}.jsx`,
          props: {
            ...input,
            pascalCase,
            camelCase,
            dashCase
          }
        }).then(() => {
          return formatFile(
            `${results.formPath}/${dashName}.jsx`,
            `${results.formPath}/${dashName}.jsx`,
          )
        })
      }))
    }))

    info(`Generate form at ${path}/${name}.jsx`)
  },
}
