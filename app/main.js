const fs = require('fs');
const {app, BrowserWindow, dialog} = require('electron');
const { title } = require('process');
//in order to play tih file system electron comes with function caled dialog
//to  solve garbagecollection = null
let mainWindow = null;

app.on('ready', () => {
    //first screem opened main window
    mainWindow = new BrowserWindow(); 
    //load the html


    mainWindow.loadFile(`${__dirname}/index.html`);

    // mainWindow.once('ready-to-show', () => {
    //     mainWindow.show;
    // });
});

//function to fetch file
exports.getFileFromUser = () => {
    const files = dialog.showOpenDialog({
        properties: ['openFile'],
        buttonLabel: 'OpenFile', //this will not seen on mac Os
        title: 'Oped Fire Sale Document',
        filters: [ 
            {
                name: 'Makrdown Files', 
                extensions:['md', 'mdown', 'markdown', 'marcdown'
        ],},
            {name: 'Text Files',
         extensions: ['txt', 'text']},
        ],
    });
    //in order to get to retun array
    if(!files) return;

    //get the first file
    const file = files[0];
    openFile(file);
};

//saving the cuurent file
exports.saveMarkdown = (file, content) => {
    if(!file) {
        file = dialog.showSaveDialog({
            title: 'Save Markdown',
            defaultPath: app.getPath('desktop'),

            filters:[
                {
                    name: 'Makrdown Files',
                    extensions: ['md', 'markdown', 'mdown' , 'marcdown' ],
                },
            ],

        });
    }

    if(!file) return;


    fs.writeFileSync(file, content );

};


function openFile(file){
    const content = fs.readFileSync(file).toString();

    // to add file to recent
    app.addRecentDocument(file);
    // console.log("content",mainWindow);
    mainWindow.webContents.send('file-opened', file, content);

}