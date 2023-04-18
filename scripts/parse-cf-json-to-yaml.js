const { serialize } = require('aws-cdk/lib/util/yaml-cfn')
const { readFile, readdir, writeFile } = require('fs/promises')
const { resolve } = require('path')

const dir = resolve(__dirname, '..')
const cdkOutDir = resolve(dir, 'cdk.out')

const main = async () => {
    try {
        const fileNames = await readdir(cdkOutDir)
        await Promise.all(
            fileNames
            .filter(fileName => fileName.endsWith('.template.json'))
            .map(async fileName => {
                const fullFilePath = resolve(cdkOutDir, fileName)
                const fileContent = await readFile(fullFilePath)
                const json = JSON.parse(fileContent)
                const yaml = serialize(json)
                
                const yamlFileName = fileName.replace('.json', '.yml')
                const yamlFilePath = resolve(cdkOutDir, yamlFileName)
                return writeFile(yamlFilePath, yaml)
            })
        )
    } catch(err) {
        console.log(err)
    }
}
main()
