# Gulp Template
## 準備
1. node.js のバージョン管理ソフトを インストールする
node.js は javascript をマシン上でぶん回す仕組みです。
Windows だと .js ファイルを実行すると、Windows Scripting Host が実行しちゃったりしますが、アレは古くて厳しいので node.js で動かさないと、Gulp とかは動かんです。
最近だと、[NVM for Windows](https://github.com/coreybutler/nvm-windows) が良いと思います。
ただ、Windowsのユーザ名が日本語だと動かないので、そういう人は [nodist](https://github.com/nullivex/nodist) かなぁと思います。

2. PowerShellインストールする
別に無くてもいいけど、コンテキストメニュー(右クリックで出るやつ)の PowerShell -> Open here で PowerShell 開けるのでこの機能だけで便利です。
[PowerShell](https://github.com/PowerShell/PowerShell) インストールする時に Optional Actions で Add 'Open here' context menus to Explorer にチェック入ってるかだけ気にしてあげてください。Enable PowerShell remoting には入れるな。

3.  実際に node.js をインストールする
これは何度もやる。というか、バージョン変えたい時はばんばんやる。

	1. まずは今使えるバージョンをチェック
	`> nvm list available`
	`> nodist dist`

	2.  使うバージョンを決めたら、インストール
	`> nvm install <version>`
	`> nodist <version>`

	3. nodist は npm のバージョン合わせが必要
	`> nodist npm match`

4. gulp のグローバルインストール
これは一度入れといて、後はバージョンアップかなぁ？
`> npm install -g gulp`
ついでに、[npm-check-updates](https://www.npmjs.com/package/npm-check-updates) 入れとくと便利。
`> npm install -g npm-check-updates`

5.  使うファイルをローカルインストール
このセットには package.json が含まれているので、コマンド一発で使えるようになります。
`> npm install`

## 使い方
* 非圧縮版の作成
組みながら、DevTool(F12の奴)で確認/実験する時に便利なコード非圧縮版を出します。
画像は軽く圧縮してる。圧縮強いとクライアントに怒られる。こわい。
ぶっちゃけこれ納品しても問題ない。
というか、HTML弄りたいとかいうクライアントにはこれを納品する方がいい。
`> gulp`

* コード圧縮版の作成
色々圧縮して納品したい時用。
まぁまぁ、使わない。
prototype を 圧縮するので、先に default を動かしてからにしてください。
`> gulp release`
