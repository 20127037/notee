const btns = document.getElementsByTagName('button')
const body = document.getElementsByTagName('body')[0]


btns[0].addEventListener('click', () => {
   const currentPassword = document.getElementById('current-password').value
   const newPassword = document.getElementById('new-password').value
   fetch('/app/change-password-verification', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    })
   .then(promise => promise.json())
   .then(res => {
      if (res.msg === 'Correct') {
         dialog.innerHTML = 'Password was updated successfully'
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
         dialog.innerHTML = 'Your inputed password mismatched the current one'
         dialog.style.display = 'block'
         dialog.className = 'alert alert-dismissible alert-danger'
         setTimeout(() => dialog.hidden = true, 3000)
      }
   })
})