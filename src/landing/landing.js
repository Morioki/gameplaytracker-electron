// DOM Nodes
const newSession = document.getElementById('new-session')

// Open new session window
newSession.addEventListener('click', e => {
    //console.log(newSession)

    let newSessionWindow = window.open('../play-session/static/play-session.html', '', `
        maxWidth=2000,
        maxHeight=2000,
        width=1200,
        height=800,
        backgroundColor=#DEDEDE,
        nodeIntegration=1
    `)
})

//console.log('Loaded Landing.js')

