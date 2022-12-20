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

## nodistで最近のnode.js入れると`> npm install`失敗する…
たぶん、`npm ERR! code MODULE_NOT_FOUND`って怒られます。  
なんの呪いか知らんけど、npmのモジュールが足りないっぽい。  

[node.jsのサイト](https://nodejs.org/en/download/)から入れたnode.jsのzipを落として、  
nodistフォルダの`npmv/<入れたnpmのバージョン>/node_modules`に、  
zipの`node_modules/npm/node_modules`を入れたげると、動いたりする。

## NVMで`> nvm use <version>`したときに`exit status 5:`や`exit status 1:`と表示され失敗する…
管理者権限でPowerShellを開いて`> nvm use <version>`してください。

## 使い方
* 非圧縮版の作成  
組みながら、DevTool(F12の奴)で確認/実験する時に便利なコード非圧縮版を出します。  
画像は軽く圧縮してる。圧縮強いとクライアントに怒られる。こわい。  
ぶっちゃけこれ納品しても問題ない。というか、HTML弄りたいとかいうクライアントにはこれを納品する方がいい。  
`> gulp`

* コード圧縮版の作成  
色々圧縮して納品したい時用。まぁまぁ、使わない。  
prototype を 圧縮するので、先に default を動かしてからにしてください。  
`> gulp release`

## HTMLの組み方、CSSの組み方
1. デザインの意図をつかむ  
Webデザイナーがどのような意図でレイアウトを作成したかを読み解きましょう。  
ここはタイトル、ここはキャッチで、ここはコピー。  
ここからここまでが1つのセクションで、ファーストビュー(カバーイメージ)はここまで。  
ここの文章が1つの段落、この並びは順序なしリストで、この並びは順序ありリスト。  
といった感じで、HTMLの要素に落とし込むのが大事です。  
意図がわからない場合は、素直にデザイナーに聞きましょう。

2. 外側の要素を組む  
まずは大枠、BODYの中に、HEADERとSECTION、FOOTERを配置します。SECTIONにはIDを振っておくと良いでしょう。
最後に、ダイアログ等をASIDEでFOOTERの下に組むとHTMLがすっきりします。

3. 中身の要素を流し込む。  
それぞれに要素を流し込みます。  
いかにタグを少なくするかに留意しましょう。  
そのDIVは必要ですか？大体の場合において、必要ないです。
安易にSPANを使わずに、フレージングコンテンツから適切なものを選びましょう。
コメントは多く残しましょう。  
閉じタグなんかもコメントで明示しておくと便利です。  
`<%# ********** EJSコメントを使用するとHTMLには表示されないので非常に便利です。 ********** -%>`

4. CSSを組む  
上から順番に組んでいくのが楽です。  
今のブラウザにリセットは必要ありません。
BODYに`margin:0; line-height:0;`で十分です。これだと、FONT-SIZEも保存されますし。  
基本は、スマートフォン用のCSS > PC,Print用のCSS > PC用デザインの横幅限界値 を メディアクエリで分割すると楽です。  
スマートフォンよりPCの方がCSSが煩雑になるので、この順番だとPCで定義したものをいちいち`auto`や`none`に戻したりする必要がなくなります。
CSSの継承を念頭に置けば、最も少なくコーディング可能なはずです。  
先祖要素から継承されているプロパティを再定義する必要はありません。  
大概の問題は、再定義することにより起こるものです。`!important`を使わない方法を考えてください。  
隣接セレクタ`+`や、子セレクタ`>`を使用すれば多重リスト等で狙ったところにだけCSSを効かせることができるはずです。  
継承を判りやすくするのにSASSは非常に役に立ちます。  
こちらでもコメントは多く残しましょう。  
というか、コメントが残るなら、nth-of-type 等使い放題です。  
バナーリストの3番目だけサイズが違う場合等、CLASSの命名で悩む必要がなくなります。  
`// ########## 一行コメントはCSSに残らないので便利です ##########`
