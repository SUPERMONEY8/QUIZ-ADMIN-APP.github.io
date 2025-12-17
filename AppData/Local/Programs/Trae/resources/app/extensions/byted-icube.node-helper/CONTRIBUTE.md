# Contributing

## Local development


npm install
npm run bundle-watch
ln -s $PWD ~/.trae-local/extensions/node-helper
rm ~/.trae-local/extensions/extensions.json

## Package

npm run vscode:prepublish && npm run package

## Publish

npx -p @byted/ovsx ovsx publish --region cn
