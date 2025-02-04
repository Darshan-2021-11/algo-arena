import {
  RegisteredFileSystemProvider,
  RegisteredMemoryFile,
  registerFileSystemOverlay,
} from '@codingame/monaco-vscode-files-service-override';
import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor';
import 'monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution';
import { MonacoLanguageClient, initServices } from 'monaco-languageclient';
import { useEffect, useRef } from 'react';

import * as vscode from 'vscode';
import {
  CloseAction,
  ErrorAction,
  MessageTransports,
} from 'vscode-languageclient';
import {
  WebSocketMessageReader,
  WebSocketMessageWriter,
  toSocket,
} from 'vscode-ws-jsonrpc';
import { createConfiguredEditor, createModelReference } from 'vscode/monaco';
import { createUrl } from './client-commons';
let languageClient: MonacoLanguageClient;
declare var URL1;
declare var URL2;
declare var URL3;
declare var content1;
declare var content2;
declare var content3;
const languageId = 'cpp';

const createWebSocket = (url: string): WebSocket => {
  const webSocket = new WebSocket(url);
  webSocket.onopen = async () => {
    const socket = toSocket(webSocket);
    const reader = new WebSocketMessageReader(socket);
    const writer = new WebSocketMessageWriter(socket);
    reader.onPartialMessage((e) => {
      console.log(e);
    });
    languageClient = createLanguageClient({
      reader,
      writer,
    });
    await languageClient.start();
    reader.onClose(() => languageClient.stop());
  };

  return webSocket;
};
const createLanguageClient = (
  transports: MessageTransports,
): MonacoLanguageClient => {
  return new MonacoLanguageClient({
    name: 'c client',
    clientOptions: {
      // use a language id as a document selector
      documentSelector: [languageId],
      // disable the default error handler
      errorHandler: {
        error: () => ({ action: ErrorAction.Continue }),
        closed: () => ({ action: CloseAction.DoNotRestart }),
      },
    },
    // create a language client connection from the JSON RPC connection on demand
    connectionProvider: {
      get: () => {
        return Promise.resolve(transports);
      },
    },
  });
};

const Editor = () => {
  const editorContainer = useRef<HTMLDivElement>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);

  async function init() {
    await initServices();

    const fileSystemProvider = new RegisteredFileSystemProvider(false);
    fileSystemProvider.registerFile(
      new RegisteredMemoryFile(vscode.Uri.file(URL1), content1),
    );
    fileSystemProvider.registerFile(
      new RegisteredMemoryFile(vscode.Uri.file(URL2), content2),
    );
    fileSystemProvider.registerFile(
      new RegisteredMemoryFile(vscode.Uri.file(URL3), content3),
    );

    registerFileSystemOverlay(1, fileSystemProvider);

    // const model1 = monaco.editor.createModel(
    //   content1,
    //   languageId,
    //   vscode.Uri.file(URL1),
    // );
    // const model2 = monaco.editor.createModel(
    //   content2,
    //   languageId,
    //   vscode.Uri.file(URL2),
    // );

    // const model3 = monaco.editor.createModel(
    //   content3,
    //   languageId,
    //   vscode.Uri.file(URL3),
    // );
    const model1 = await createModelReference(vscode.Uri.file(URL1));
    model1.object.setLanguageId(languageId)
    const model2 = await createModelReference(vscode.Uri.file(URL2));
    model2.object.setLanguageId(languageId)
    const model3 = await createModelReference(vscode.Uri.file(URL3));
    model3.object.setLanguageId(languageId)

    editorRef.current = createConfiguredEditor(editorContainer.current, {
      folding: true,
      language: languageId,
      theme: 'vs',
      overviewRulerBorder: false, // 不要滚动条的边框
      scrollbar: {
        // 滚动条设置
        verticalScrollbarSize: 6, // 竖滚动条
        horizontalScrollbarSize: 10, // 横滚动条
      },
      minimap: {
        enabled: false, // 是否启用预览图
      }, // 预览图设置
      automaticLayout: true,
      model: model1.object.textEditorModel,
    });

    createWebSocket(
      createUrl(
        'localhost',
        30002,
        '/clangd',
        {
          // Used to parse an auth token or additional parameters such as import IDs to the language server
          authorization: 'UserAuth',
          // By commenting above line out and commenting below line in, connection to language server will be denied.
          // authorization: 'FailedUserAuth'
        },
        false,
      ),
    );
  }
  useEffect(() => {
    init();
  }, []);

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%' }}>
      <div
        style={{
          height: '100%',
          width: '100%',
        }}
        ref={editorContainer}
      ></div>
    </div>
  );
};

export default Editor;
