const path = require('path');
const marked = require('marked');
//require doesnot exit in chrome but it will since we are using electron
const {remote,  ipcRenderer} = require('electron');

let filePath = null;
let originalContent = '';

const mainProcess = remote.require('./main');
const currentWindow = remote.getCurrentWindow();

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButton = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');

const renderMarkdownToHtml = markdown => {
  htmlView.innerHTML = marked(markdown, { sanitize: true });
};

const updateUserInterface = isEdited => {
  let title ='Fire Sale';
  if(filePath){
    title = `${path.basename(filePath)} - ${title}`;
  };

  if(isEdited){
    title = `${title} (edited)`;
  }

  if(filePath)currentWindow.setRepresentedFilename(filePath);
   currentWindow.setDocumentEdited(isEdited);

  saveMarkdownButton.disabled = !isEdited;
  revertButton.disabled = !isEdited;


  currentWindow.setTitle(title);

};

markdownView.addEventListener('keyup', event => {
  const currentContent = event.target.value;
  renderMarkdownToHtml(currentContent);
  updateUserInterface( currentContent !== originalContent);
});

htmlView.addEventListener('keyup', event => {
  const currentContent = event.target.value;
  render
});

openFileButton.addEventListener('click', () => {
  mainProcess.getFileFromUser();
  // alert('You clicked he open file');
});

//save the current file
saveMarkdownButton.addEventListener('click', () =>
{
  mainProcess.saveMarkdown(filePath, markdownView.value);  

});
//----------save the current html---------------////
saveHtmlButton.addEventListener('click', () =>
{
  mainProcess.saveHtml(htmlView.innerHTML);
});

ipcRenderer.on('file-opened', (event,file, content ) => {
  filePath = file;
  originalContent = content;
  // console.log({file, content});
  markdownView.value = content;
  renderMarkdownToHtml(markdownView.value);

  updateUserInterface(false);

});
