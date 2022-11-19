const btns = document.getElementsByTagName('button')
const body = document.getElementsByTagName('body')[0]
const dialog = document.getElementById('dialog')
var accountHasExisted = false

btns[0].addEventListener('click', () => {
   const fullname = document.getElementById('fullname').value
   const username = document.getElementById('username').value
   const password = document.getElementById('password').value
   fetch('/sign-up-verification', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         fullname,
         username,
         password
      })
    })
   .then(promise => promise.json())
   .then(res => {
      if (res.msg === 'New account was created successfully') {
         dialog.innerHTML = 'New account was created successfully'
         dialog.style.display = 'block'
         dialog.className = 'alert alert-dismissible alert-success'
         setTimeout(() => {
            dialog.hidden = true
            const a = document.createElement('a')
            a.href = '/app'
            body.appendChild(a)
            a.click()
         }, 3000)
      }
      else { 
         dialog.innerHTML = 'This username has already existed'
         dialog.style.display = 'block'
         dialog.className = 'alert alert-dismissible alert-danger'
         setTimeout(() => dialog.hidden = true, 3000)
      }
   })

})