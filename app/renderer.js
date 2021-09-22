const path = require('path');
const marked = require('marked');
//require doesnot exit in chrome but it will since we are using electron
const {remote,  ipcRenderer, shell} = require('electron');

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

   showFileButton.disabled = !filePath;
   openInDefaultButton.disabled = !filePath;

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

//---show file loacation---//
showFileButton.addEventListener('click', () =>{
  if(!filePath){
    return alert('nope');

  }

  shell.showItemInFolder(filePath);
});

ipcRenderer.on('file-opened', (event,file, content ) => {
  filePath = file;
  originalContent = content;
  // console.log({file, content});
  markdownView.value = content;
  renderMarkdownToHtml(markdownView.value);

  updateUserInterface(false);

});

//in order to drag files and it's content to be seeen
addEventListener('dragstart', event => event.preventDefault());
addEventListener('dragover', event => event.preventDefault());
addEventListener('dragleave', event => event.preventDefault());
addEventListener('drop', event => event.preventDefault());

//in order to drag a first file  in multiple drags
const getDraggedFile = (event) => event.dataTransfer.items[0];
// to drop files
const getDroppedFile = (event) => event.dataTransfer.files[0];

// to categorize what to be choosed
const fileTypeIsSupported = file => 
{
  return ['text/plain', 'text/markdown'].includes(file.type);
};

// to control what to dragged
markdownView.addEventListener('dragover', (event) =>{
  const file = getDraggedFile(event);
  if(fileTypeIsSupported(file)){
    markdownView.classList.add('drag-over');
  }else{
    markdownView.classList.add('drag-error');
  }

});

markdownView.addEventListener('dragleave',() =>{
  markdownView.classList.remove('drag-over');
  markdownView.classList.remove('drag-error');
});

//when we drop a files
markdownView.addEventListener('drop', (event) =>{
  const file = getDroppedFile(event);
  
  if(fileTypeIsSupported(file)){
    console.log('Dropped!',{file});
    mainProcess.openFile(file.path);

  }else{
    alert('That file type is not supported.');
  }

  markdownView.classList.remove('drag-over');
  markdownView.classList.remove('drag-error');
});

