const url='http://localhost:8080'
var board_id=''
const params = new URLSearchParams(window.location.search);
const userId = params.get('_id');

const addTaskModal = document.getElementById('add-task-modal');
const addTaskBtn = document.getElementById('add-task-btn');
const closeBtn = addTaskModal.getElementsByClassName('close')[0];

addTaskBtn.onclick = function() {
    addTaskModal.style.display = 'block';
}

closeBtn.onclick = function() {
    addTaskModal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == addTaskModal) {
        addTaskModal.style.display = 'none';
    }
}

const addTaskForm = document.getElementById('add-task-form');
addTaskForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const status = document.getElementById('task-status').value;
    fetch(`${url}/tasks/${board_id}`,{
        method:'POST',
        headers:{
            'Content-type':"application/json",
            authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body:JSON.stringify({title,description,status})
    })
    .then(res=>res.json())
    .then(data=>console.log(data))
    .catch(er=>console.log(err))
    addTaskModal.style.display = 'none';
});





const modal = document.getElementById('create-board-modal');
const btn = document.getElementById('create-board-btn');
const span = document.getElementsByClassName('close')[0];
btn.onclick = function() {
    modal.style.display = 'block';
}

span.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

const form = document.getElementById('create-board-form');
form.addEventListener('submit', function(event) {
    event.preventDefault();
    const boardName = document.getElementById('board-name').value;
    fetch(`${url}/board`,{
        method:'POST',
        headers:{
            'Content-type':"application/json"
        },
        body:JSON.stringify({name:boardName})
    })
    .then(res=>res.json())
    .then(data=>console.log(data))
    .catch(er=>console.log(err))
    modal.style.display = 'none';
});


const appendTask=(data)=>{
    document.getElementById('todo-container').innerHTML=""
    document.getElementById('doing-container').innerHTML=""
    document.getElementById('done-container').innerHTML=""
    let todoCount = 0;
    let doingCount = 0;
    let doneCount = 0;
    data.forEach(item=>{
        const card=document.createElement('div')
        card.className='card'
        const title=document.createElement('p')
        title.textContent=item.description
        card.appendChild(title)
        console.log(item.status)
        if(item.status==='Todo')
        {
            todoCount++;
            document.getElementById('todo-container').appendChild(card)
        }else if(item.status==='Doing')
        {
            doingCount++;
            document.getElementById('doing-container').appendChild(card)
        }else if(item.status==='Done')
        {
            doneCount++;
            document.getElementById('done-container').appendChild(card)
        }
    })
    document.getElementById('todo-cnt').textContent=`Todo (${todoCount})`
    document.getElementById('doing-cnt').textContent=`Doing (${doingCount})`
    document.getElementById('done-cnt').textContent=`Done (${doneCount})`
}

const fetchBoardData=(boardId)=>{
    fetch(`${url}/board/${boardId}`,{
        method:'GET',
        headers:{
            'Content-type':'application/json'
        }
    })
    .then(res=>res.json())
    .then(data=>{
        console.log(data)
        appendTask(data.tasks)
    })
    .catch(err=>console.log(err))
}

const board_pagination=document.getElementById('board-btn')
function boardbtn(data) {
    for (let i = 0; i < data.length; i++) {
        (function(index) {
            const btn = document.createElement('button');
            btn.textContent = `Board ${index + 1}`;
            btn.id = `board-${index}`;
            btn.addEventListener('click', () => {
                const boardId = data[index]._id;
                board_id=boardId
                document.getElementById('boardName').textContent=`Board ${index+1} `
                fetchBoardData(boardId)
                console.log(`Clicked on board with ID: ${boardId}`);
            });
            board_pagination.appendChild(btn);
        })(i);
    }
}



function fetchBoard(){
fetch(`${url}/board/user/${userId}`,{
    method:'GET',
    headers:{
        'Content-type':"application/json",
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
})
.then(res=>res.json())
.then(data=>{
    console.log(data)
    document.getElementById('all-boards').textContent=`ALL BOARDS (${data.length})`
    boardbtn(data)
})
.catch(err=>console.log(err))
}


fetchBoard()