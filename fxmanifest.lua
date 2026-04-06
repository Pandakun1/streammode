fx_version 'cerulean'
game 'gta5'

author 'Panda'
description 'Streammode mit captureStream'
version '1.0.0'

client_scripts {
    'client.lua'
}

server_scripts {
    'server.lua'
}

ui_page 'nui/capture.html'  -- NUI Page registrieren

files {
    'nui/capture.html',
    'nui/capture-stream.js',  -- captureStream Script
    'nui/style.css'           -- optional
}