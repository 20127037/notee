import { accounts, addNewAccount, changePassword, addNewNote, toggleStatus, deleteNote, modifyNote } from './database.js'

import express from 'express';
import path from 'path'
import cookieParser from 'cookie-parser';
import sessions, { Session } from 'express-session';


const server = express()
server.use(express.urlencoded())
server.use(express.json())
server.use(cookieParser())
server.use(express.static("public"));
const __dirname = path.resolve();

var session;
// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
server.use(sessions({
   secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
   saveUninitialized: true,
   cookie: { maxAge: oneDay },
   resave: false
}));


const port = process.env.PORT || 3000
server.listen(port, () => console.log('Server is starting on port: ', port))

// HOME (LANDING PAGE)

server.get('/', (req, res) => {
   session = req.session;
   if (session.userid) res.redirect('/app')
   else res.sendFile(path.join(__dirname, 'public', './html/home.html'))
});


// SIGN-UP ROUTE

server.get('/sign-up', (req, res) => {
   session = req.session;
   if (session.userid) res.redirect('/app')
   else res.sendFile(path.join(__dirname, 'public', './html/sign-up.html'));
});

server.put('/sign-up-verification', (req, res) => {
   session = req.session
   let fullname = req.body.fullname
   let username = req.body.username
   let password = req.body.password

   let hasExisted = false

   for (let i = 0; i < accounts.length; i++) {
      if (accounts[i]['username'] === username) {
         hasExisted = true
         res.send(JSON.stringify({ msg: 'This username has already existed' }))
         break
      }
   }
   if (!hasExisted) {
      session.userid = username
      addNewAccount({ fullname, username, password, notes: [] })
      res.send(JSON.stringify({ msg: 'New account was created successfully' }))
   }

});


// LOG-IN ROUTE

server.get('/log-in', (req, res) => {
   session = req.session;
   if (session.userid) res.redirect('/app')
   else res.sendFile(path.join(__dirname, 'public', './html/log-in.html'));
});

server.post('/log-in-verification', (req, res) => {
   
   let username = req.body.username
   let password = req.body.password

   for (let i = 0; i < accounts.length; i++) {
      if (accounts[i]['username'] === username && accounts[i]['password'] === password) {
         session = req.session;
         session.userid = username;
         res.send(JSON.stringify({ msg: 'Correct' }))
         break
      }
   }
   if (!session.userid) res.send(JSON.stringify({ msg: 'Incorrect' }))
});


// APPLICATION ROUTE

server.get('/app', (req, res) => {
   session = req.session;
   if (!session.userid) res.send('<div style = "background: #FF4742; border: 1px solid #FF4742; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px; box-sizing: border-box; color: #FFFFFF; cursor: pointer; display: inline-block; font-weight: 800; min-height: 40px; outline: 0; padding: 12px 14px; text-align: center; vertical-align: middle;"> You have not logged in yet! </div>')
   else res.sendFile(path.join(__dirname, 'public', './html/app.html'));
});

server.get('/app/change-password', (req, res) => {
   session = req.session;
   if (!session.userid) res.send('<div style = "background: #FF4742; border: 1px solid #FF4742; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px; box-sizing: border-box; color: #FFFFFF; cursor: pointer; display: inline-block; font-weight: 800; min-height: 40px; outline: 0; padding: 12px 14px; text-align: center; vertical-align: middle;"> You have not logged in yet! </div>')
   else res.sendFile(path.join(__dirname, 'public', './html/change-password.html'));
});

server.put('/app/change-password-verification', (req, res) => {
   let { currentPassword, newPassword } = req.body
   if (currentPassword === password) {
      res.send(JSON.stringify({ msg: 'Correct' }))
      changePassword({ username, newPassword })
   }
   else {
      res.send(JSON.stringify({ msg: 'Incorrect' }))
   }
});

server.get('/app/name', (req, res) => {
   session = req.session
   if(session.userid) 
      for (let i = 0; i < accounts.length; i++)
         if (accounts[i]['username'] === session.userid)
            res.send(JSON.stringify(accounts[i].fullname))
})

// USER'S NOTES

server.get('/app/notes', (req, res) => {
   session = req.session
   if(session.userid) 
      for (let i = 0; i < accounts.length; i++)
         if (accounts[i]['username'] === session.userid)
            res.send(JSON.stringify(accounts[i].notes))
})

server.put('/app/add', (req, res) => {
   session = req.session
   addNewNote(session.userid, req.body)
   res.send(JSON.stringify({msg: 'Done'}))
})

server.put('/app/note/status', (req, res) => {
   session = req.session
   toggleStatus(session.userid, req.body.noteID)
   res.send(JSON.stringify({msg: 'Done'}))
})

server.put('/app/note/modify', (req,res) => {
   session = req.session
   modifyNote(session.userid, req.body.noteID, req.body.title, req.body.content)
   res.send(JSON.stringify({msg: 'Done'}))
})

server.delete('/app/note/delete', (req,res) => {
   session = req.session
   deleteNote(session.userid, req.body.noteID)
   res.send(JSON.stringify({msg: 'Done'}))
})


// INSTRUCTION ROUTE
server.get('/instruction', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', './html/instruction.html'));
})


// LOG-OUT ROUTE
server.get('/log-out', (req, res) => {
   req.session.destroy();
   res.redirect('/')
})
