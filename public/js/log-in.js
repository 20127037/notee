const btns = document.getElementsByTagName('button')
const body = document.body

var username = undefined
var password = undefined

btns[0].addEventListener('click', () => {
   
   username = document.getElementById('username').value
   password = document.getElementById('password').value
   
   fetch('/log-in-verification', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password
      })
   })
   .then(promise => promise.json())
   .then(res => {
      if (res.msg === 'Correct') {
         const a = document.createElement('a')
         a.href = '/app'
         body.appendChild(a)
         a.click()
      }
      else {
         const dialog = document.createElement('div')
         const msg = document.createTextNode('Incorrect credential. Please try again!')
         dialog.appendChild(msg)
         dialog.className = 'alert alert-dismissible alert-danger'
         dialog.style = 'position: fixed; bottom: 0; right: 10px;'
         body.appendChild(dialog)
         setTimeout(() => dialog.hidden = true, 3000)
      }
   })
})
