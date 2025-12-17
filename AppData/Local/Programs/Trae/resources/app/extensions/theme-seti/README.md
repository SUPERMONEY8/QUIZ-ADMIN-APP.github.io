# theme-seti

This is an icon theme that uses the icons from [`seti-ui`](https://github.com/jesseweed/seti-ui).

## Development

### 定制 seti
* 通过 `vs-seti-icon-theme.override.json` 实现，不要直接修改 `vs-seti-icon-theme.json`
* 执行 `npm run build` 更新主题文件

### 修改 icube.woff
修改 icube.woff:
打开 https://kekee000.github.io/fonteditor/# 选择 icube.woff 字体文件，然后编辑图标即可

### 更新上游 seti
* 将上游的 icons/seti.woff 和 icons/vs-seti-icon-theme.json 目录替换到当前的 seti 目录中
* 执行 npm run build 脚本，会将 icube-seti.json 和原版 icons/vs-seti-icon-theme.json 进行合并
* 合并优先级是取 icube-seti.json 值往原版上合并

## Updating icons

There is script that can be used to update icons, [./build/update-icon-theme.js](build/update-icon-theme.js).

To run this script, run `npm run update` from the `theme-seti` directory.

This can be run in one of two ways: looking at a local copy of `seti-ui` for icons, or getting them straight from GitHub.

If you want to run it from a local copy of `seti-ui`, first clone [`seti-ui`](https://github.com/jesseweed/seti-ui) to the folder next to your `vscode` repo (from the `theme-seti` directory, `../../`).
Then, inside the `set-ui` directory, run `npm install` followed by `npm run prepublishOnly`. This will generate updated icons.

If you want to download the icons straight from GitHub, change the `FROM_DISK` variable to `false` inside of `update-icon-theme.js`.

### Languages not shipped with `vscode`

Languages that are not shipped with `vscode` must be added to the `nonBuiltInLanguages` object inside of `update-icon-theme.js`.

These should match [the file mapping in `seti-ui`](https://github.com/jesseweed/seti-ui/blob/master/styles/components/icons/mapping.less).

Please try and keep this list in alphabetical order! Thank you.

## Previewing icons

There is a [`./icons/preview.html`](./icons/preview.html) file that can be opened to see all of the icons included in the theme.
Note that to view this, it needs to be hosted by a web server.

When updating icons, it is always a good idea to make sure that they work properly by looking at this page.
When submitting a PR that updates these icons, a screenshot of the preview page should accompany it.
