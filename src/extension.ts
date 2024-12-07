import * as vscode from 'vscode';
import * as childProcess from 'child_process';

export function activate(context: vscode.ExtensionContext) {

	// Destroyコマンドを登録
	const disposable = vscode.commands.registerCommand('my-extension.destroy', () => {

		// WebViewを開く
		const panel = vscode.window.createWebviewPanel(
			'destroy',
			'Destroy',
			vscode.ViewColumn.One,
			{
				enableScripts: true
			}
		);

		// WebViewに表示するHTMLを生成
		panel.webview.html = getWebviewContent();


		// WebViewからのメッセージを受信
		panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'destroy':
						// consoleのコマンドを実行する
						const command = "echo 'Destroy'";

						// コマンドを実行
						childProcess.exec(command, (error, stdout, stderr) => {
							if (error) {
								console.error(`exec error: ${error}`);
								return;
							}
							if (stdout) {
								console.log(`stdout: ${stdout}`);
								return;
							}
						});
						return;

				}
			},
			undefined,
			context.subscriptions
		);

	});

	context.subscriptions.push(disposable);
}

// WebViewに表示するHTMLを生成（これが文字列なのでちょっとメンドイ）
function getWebviewContent() {
	return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cat Coding</title>
    </head>
    <body>
        <h1>Destroy</h1>
        <button onclick="destroy()">Destroy</button>

        <script>
            const vscode = acquireVsCodeApi();

            function destroy() {
                vscode.postMessage({
                    command: 'destroy'
                });
            }
        </script>
    </body>
    </html>`;
}

// This method is called when your extension is deactivated
export function deactivate() { }
