var accounts = [
   {
      fullname: 'Le Nguyen Truong Huy',
      username: 'lnthuy29012002@gmail.com',
      password: 'Teky@2021',
      notes: [
         {
            timeCreated: "Tue Sep 06 2022",
            title: "Lễ khai giảng",
            content: "Sau thời gian phải khai giảng trực tuyến do dịch bệnh, năm nay, các trường đều chú trọng xây dựng chương trình đặc biệt đón học sinh tựu trường, đánh dấu năm học bình thường mới. Theo tinh thần hướng dẫn của Bộ Giáo dục và Đào tạo, khai giảng năm nay được tổ chức theo hướng gọn nhẹ, phù hợp với điều kiện của từng địa phương, nhà trường, tạo không khí vui tươi, phấn khởi của Ngày hội toàn dân đưa trẻ đến trường.",
            status: 'Done'
         },
         {
            timeCreated: "Wed Sep 07 2022",
            title: "Tiệm bánh tráng ở Long An",
            content: "Tuy có giá thành khá bình dân, mỗi bịch dao động từ khoảng 10.000Đ - 20.000Đ, có loại cao cấp hơn thì mỗi bịch 50.000Đ - 70.000Đ. Nhưng khi mua hàng, nhiều người dân TP.HCM lại phải thanh toán số tiền lên đến tận 1, 2 triệu mỗi lần.",
            status: 'Undone'
         },
      ]
   },
   {
      fullname: 'Nguyen Thien Phu',
      username: 'ntphu@gmail.com',
      password: 'Teky@2021',
      notes: [
         {
            timeCreated: "2022-09-04T13:05:06.088Z",
            title: "Title 1",
            content: "Content 3",
            status: 'Done'
         },
         {
            timeCreated: "2022-09-03T13:05:06.088Z",
            title: "Title 2",
            content: "Content 4",
            status: 'Undone'
         },
      ]
   },
]

function addNewAccount(obj) {
   accounts.push(obj)
}

function changePassword(obj) {
   for (let i = 0; i < accounts.length; i++) {
      if (accounts[i]['username'] === obj.username)
         accounts[i]['password'] = obj.password
   }
}

function addNewNote(username, note) {
   for (let i = 0; i < accounts.length; i++)
      if (accounts[i]['username'] === username)
         accounts[i]['notes'].push(note)
}

function toggleStatus(username, noteID) {
   for (let i = 0; i < accounts.length; i++)
      if (accounts[i]['username'] === username)
         for (let j = 0; j < accounts[i]['notes'].length; j++)
            if (j === noteID)
               accounts[i]['notes'][j].status === 'Done' ? accounts[i]['notes'][j].status = 'Undone' : accounts[i]['notes'][j].status = 'Done' 
}

function modifyNote(username, noteID, title, content) {
   for (let i = 0; i < accounts.length; i++)
      if (accounts[i]['username'] === username)
         for (let j = 0; j < accounts[i]['notes'].length; j++)
            if (j === noteID) {
               accounts[i]['notes'][j].title = title
               accounts[i]['notes'][j].content = content
            }
}

function deleteNote(username, noteID) {
   for (let i = 0; i < accounts.length; i++)
      if (accounts[i]['username'] === username)
         for (let j = 0; j < accounts[i]['notes'].length; j++)
            if (j === noteID)
               accounts[i]['notes'].splice(noteID, 1)
}



export { accounts, addNewAccount, changePassword, addNewNote, toggleStatus, deleteNote, modifyNote }