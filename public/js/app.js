const body = document.body

const navigation = document.getElementById('navigation')
const table = document.getElementById('table')

// DROPDOWN POPS UP
const person = document.getElementById('person')
const card = document.getElementById('info')
const fullname = document.getElementById('fullname')

person.addEventListener('mouseover', () => {
   card.style.display = 'block'
})

card.addEventListener('mouseover', () => {
   card.style.display = 'block'
})

person.addEventListener('mouseleave', () => card.style.display = 'none')

card.addEventListener('mouseleave', () => {
   card.style.display = 'none'
})


const filterListButton = document.getElementById('btnGroupDrop2')
const filterList = document.getElementById('filter-list')

filterListButton.addEventListener('click', () => {
   filterList.style.display = 'block'
})
filterListButton.addEventListener('mouseleave', () => filterList.style.display = 'none')
filterList.addEventListener('mouseover', () => filterList.style.display = 'block')
filterList.addEventListener('mouseleave', () => filterList.style.display = 'none')

filterList.addEventListener('click', (event) => {
   const option = event.target.innerText
   let reducedNotes

   switch (option) {

      case 'Hide done notes':
         reducedNotes = notes.filter(element => element.status === 'Undone')
         addDataToDOM(reducedNotes)
         for (let i = 0; i < reducedNotes.length; i++) addEventToNewNote(i)
         break

      case 'Hide undone notes':
         reducedNotes = notes.filter(element => element.status === 'Done')
         addDataToDOM(reducedNotes)
         for (let i = 0; i < reducedNotes.length; i++) addEventToNewNote(i)
         break

      case 'From oldest to newest':
         break

      case 'From newest to oldest':
         reducedNotes = notes.slice().reverse()
         addDataToDOM(reducedNotes)
         for (let i = 0; i < reducedNotes.length; i++) addEventToNewNote(i)
         break
         
      default:
         break
   }
})

const hideArrow = document.getElementById('hide-arrow')
const hideMenu = document.getElementById('hide-menu')
hideArrow.addEventListener('mouseover', () => {
   hideMenu.style.display = 'block'
   arrangeMenu.style.display = 'none'
})
hideMenu.addEventListener('mouseover', () => hideMenu.style.display = 'block')
hideArrow.addEventListener('mouseleave', () => hideMenu.style.display = 'none')

const arrangeArrow = document.getElementById('arrange-arrow')
const arrangeMenu = document.getElementById('arrange-menu')
arrangeArrow.addEventListener('mouseover', () => {
   arrangeMenu.style.display = 'block'
   hideMenu.style.display = 'none'
})
arrangeMenu.addEventListener('mouseover', () => arrangeMenu.style.display = 'block')
arrangeArrow.addEventListener('mouseleave', () => arrangeMenu.style.display = 'none')




// AUTOMATICALLY FETCH DATA FROM SERVER (TO BOTH VISIBLE AND HIDDEN)
// AND ADD EVENT CLICK FOR FORMS

var noteID
var notes = undefined

const tbody = document.getElementsByTagName('tbody')[0]

const extendedContent = document.getElementById('extended-content')
var title = document.getElementById('title')
var content = document.getElementById('content')

function addDataToDOM(notes) {

   tbody.innerHTML = ''

   for (let i = 0; i < notes.length; i++) {
      var note = notes[i]
      tbody.innerHTML += `<tr id = 'row${i}'> 
      <td> ${note.timeCreated} </td> 
      <td style = "font-weight: bolder"> ${note.title} </td> 
      <td> ${note.content.slice(0, 30) + '...'} </td> 
      <td> <p class='status status-${note.status.toLowerCase() + ' ' + i}'> ${note.status} </p> </td> 
   </tr>`
   }
}

function addEventToNewNote(i) {
   document.getElementById(`row${i}`).addEventListener('click', (e) => {
      noteID = i
      if (!e.target.className.includes('status')) {
         title.innerHTML = notes[i].title
         content.innerHTML = notes[i].content
         notes[i].status === 'Done' ? title.style.background = '#0e872a' : title.style.background = '#9c222e'
         title.style.color = 'white'
         extendedContent.style.visibility = 'visible'
         closeButtons[1].style.color = 'white'
         navigation.style.filter = table.style.filter = 'blur(5px)'
      }
   })

   // MODIFY NOTE STATUS
   const status = document.getElementsByClassName(`status ${i}`)[0]
   status.addEventListener('click', () => {
      noteID = i
      fetch('/app/note/status', {
         method: 'put',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ noteID })
      })
         .then(res => location.reload())
   })

}


fetch('/app/name').then(res => res.json()).then(obj => {
   fullname.textContent = obj
   fullname.className = 'greater'
})

fetch('/app/notes').then(res => res.json())
   .then(arr => {
      notes = arr
      addDataToDOM(notes)
   })
   .then(() => {
      for (let i = 0; i < notes.length; i++) addEventToNewNote(i)
   })



// ADD NEW NOTE
var action = undefined // "add" or "modify"

const addButton = document.getElementById('add-button')
const addForm = document.getElementById('add-form')
const saveButton = document.getElementById('save-button')

addButton.addEventListener('click', () => {
   action = 'add'
   addForm.style.visibility = 'visible'
   closeButtons[0].style.color = 'black'
   navigation.style.filter = table.style.filter = 'blur(5px)'
})

var newDate = undefined
const newTitle = document.getElementById('new-title')
const newContent = document.getElementById('new-content')
const newStatus = 'Undone'



saveButton.addEventListener('click', () => {
   if (newTitle.value.length === 0 || newContent.value.length === 0) {
      const dialog = document.createElement('div')
      const msg = document.createTextNode('At least one of these fields was left empty!')
      dialog.appendChild(msg)
      dialog.className = 'alert alert-dismissible alert-danger'
      dialog.style = 'position: fixed; bottom: 0; right: 10px;'
      body.appendChild(dialog)
      setTimeout(() => dialog.hidden = true, 3000)
   }
   else if (action === 'add') {

      newDate = new Date()

      addForm.style.visibility = 'hidden'
      navigation.style.filter = table.style.filter = 'blur(0)'

      fetch('/app/add', {
         method: 'put',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            timeCreated: newDate.toDateString(),
            title: newTitle.value,
            content: newContent.value,
            status: newStatus
         })
      })
         .then(res => location.reload())
   }

   else if (action === 'modify') {

      addForm.style.visibility = 'hidden'
      navigation.style.filter = table.style.filter = 'blur(0)'

      fetch('/app/note/modify', {
         method: 'put',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            noteID: noteID,
            title: newTitle.value,
            content: newContent.value,
         })
      }).then(res => location.reload())
   }
})



// CLOSE ALL MODALS
const closeButtons = document.getElementsByClassName('close-button')
for (let closeButton of closeButtons) {
   closeButton.addEventListener('click', () => {
      addForm.style.visibility = 'hidden'
      extendedContent.style.visibility = 'hidden'
      navigation.style.filter = table.style.filter = 'blur(0)'
   })
}

// DELETE NOTE
const deleteButton = document.getElementById('delete-button')

deleteButton.addEventListener('click', () => {
   fetch('/app/note/delete', {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noteID })
   }).then(res => location.reload())
})

// MODIFY NOTE
const modifyButton = document.getElementById('modify-button')

modifyButton.addEventListener('click', () => {
   action = 'modify'
   addForm.style.visibility = 'visible'
   closeButtons[0].style.color = 'black'
   navigation.style.filter = table.style.filter = 'blur(5px)'
   extendedContent.style.visibility = 'hidden'
   for (let i = 0; i < notes.length; i++)
      if (i === noteID) {
         newTitle.value = notes[i].title
         newContent.value = notes[i].content
      }
})

// SEARCH FOR NOTE
const noteSearcher = document.getElementById('note-searcher')
noteSearcher.addEventListener('change', (event) => {
   const queryString = event.target.value
   var reducedNotes = notes.filter(element => element.title.includes(queryString) || element.title.toLowerCase().includes(queryString) || element.content.toLowerCase().includes(queryString.toLowerCase()))
   addDataToDOM(reducedNotes)
   for (let i = 0; i < reducedNotes.length; i++) addEventToNewNote(i)
})

const command = document.getElementById('command')
const searcherLabel = document.getElementById('note-searcher-label')
const secondNavigation = document.getElementById('second-navigation')
var hasResized = false

window.addEventListener('resize', (event) => {
   if (window.innerWidth < 720) {
      secondNavigation.appendChild(command)
      secondNavigation.appendChild(searcherLabel)

      table.style.transform = 'translateY(70px)'

      hasResized = true
   }

   else if (window.innerWidth >= 720 && hasResized === true) {
      navigation.insertBefore(command, navigation.children[1])
      navigation.insertBefore(searcherLabel, navigation.children[2])

      hasResized = false
   }
})