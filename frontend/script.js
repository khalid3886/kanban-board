let url='https://kanban-board-lime-theta.vercel.app'

document.getElementById('login-button').addEventListener('click',()=>{
    const email=document.getElementById('login-email').value
    const password=document.getElementById('login-pass').value
    fetch(`${url}/users/login`,{
        method:"POST",
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify({email,
        password})
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.msg==='login successfull')
        {
            localStorage.setItem('token',data.access_token)
            window.location.href=`./dashboard/index.html?_id=${data.user._id}`
        }else{
            alert('wrong credentials')
        }
    })
    .catch(err=>console.log(err))
})