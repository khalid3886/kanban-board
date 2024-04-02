const url='https://kanban-board-lime-theta.vercel.app'
var board_id=''
const params = new URLSearchParams(window.location.search);
const userId = params.get('_id');

console.log(userId)

if (userId === null) {
    alert('Please login first');
    // Redirect to index.html after user clicks OK
    window.location.href = '../index.html';
}

// addtask modal

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



// addboard modal

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
            'Content-type':"application/json",
            authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body:JSON.stringify({name:boardName})
    })
    .then(res=>res.json())
    .then(data=>console.log(data))
    .catch(er=>console.log(err))
    modal.style.display = 'none';
});
//print subtask

const subtasksModal=document.getElementById('show-subtasks-modal')
const closesubtasks=document.getElementById("closeSubtasks")
closesubtasks.addEventListener('click',()=>{
    subtasksModal.style.display="none"
})

const printsubtasks=(data)=>{
    console.log(data)
    document.getElementById('taskstatus').value = data.status;
    subtasksModal.style.display="block"
    document.getElementById('tasks-title').textContent=data.title
    document.getElementById('tasks-desc').textContent=data.description
    const subtasksContainer = document.getElementById('subtasks-container');
    subtasksContainer.innerHTML = '';

    data.subtask.forEach(item=>{
        //document.getElementById('taskstatus').value=item.status
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = item.title;
        checkbox.checked = item.isCompleted;
        const label = document.createElement('label');
        label.textContent = item.title;
        checkbox.addEventListener('change', function() {
            const isChecked = this.checked;
            fetch(`${url}/subtasks/${item._id}`,{
                method:'PATCH',
                headers:{
                    'Content-type':"application/json",
                    authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body:JSON.stringify({isCompleted:isChecked})
            })
            .then(res=>res.json())
            .then(data=>console.log(data))
            .catch(err=>console.log(err))
        });
        const card=document.createElement('div')
        card.className='subtask-card'
        card.append(checkbox,label)
        subtasksContainer.appendChild(card);
        subtasksContainer.appendChild(document.createElement('br'));

        document.getElementById('submit-subtasks').addEventListener('click',()=>{
            fetch(`${url}/tasks/${data._id}`,{
                method:'PATCH',
                headers:{
                    'Content-type':"application/json",
                    authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body:JSON.stringify({status:document.getElementById('taskstatus').value})
            })
            .then(res=>res.json())
            .then(data=>console.log(data))
            .catch(err=>console.log(err))
        })
    })
    document.getElementById('create-subtask').addEventListener('click',()=>{
        const subtask_title=document.getElementById('subtasks-input').value
        if(subtask_title)
        {
            fetch(`${url}/subtasks/${data._id}`,{
                method:"POST",
                headers:{
                    'Content-type':"application/json",
                    authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body:JSON.stringify({title:subtask_title})
            })
            .then(res=>res.json())
            .then(data=>console.log(data))
            .catch(err=>console.log(err))
        }else{
            alert('subtask is empty')
        }
    })
}

const showsubtasks=(taskid)=>{
    fetch(`${url}/tasks/${taskid}`,{
        method:'GET',
        headers:{
            'Content-type':"application/json",
            authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(res=>res.json())
    .then(data=>{
        printsubtasks(data)
    })
    .catch(err=>console.log(err))
}

//print task

const appendTask=(data)=>{
    document.getElementById('todo-container').innerHTML=""
    document.getElementById('doing-container').innerHTML=""
    document.getElementById('done-container').innerHTML=""
    let todoCount = 0;
    let doingCount = 0;
    let doneCount = 0;
    data.forEach(item=>{
        let cnt=0;
        item.subtask.forEach(i=>{
            if (i.isCompleted===true)
            cnt++;
        })
        console.log(item);
        const card=document.createElement('div')
        card.className='card'
        const title=document.createElement('p')
        title.textContent=item.description
        const subtask=document.createElement('p')
        subtask.textContent=`${cnt} of ${item.subtask.length} subtasks`
        subtask.style.color='rgb(0,0,0,0.4)'
        subtask.style.fontSize='13px'
        card.appendChild(title)
        card.appendChild(subtask)
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
        card.addEventListener("click", function() {
            showsubtasks(item._id)
        });
    })
    document.getElementById('todo-cnt').textContent=`Todo (${todoCount})`
    document.getElementById('doing-cnt').textContent=`Doing (${doingCount})`
    document.getElementById('done-cnt').textContent=`Done (${doneCount})`

}

//display board

const fetchBoardData=(boardId)=>{
    fetch(`${url}/board/${boardId}`,{
        method:'GET',
        headers:{
            'Content-type':'application/json',
            authorization: `Bearer ${localStorage.getItem('token')}`
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
    let previousBtn = null;
    for (let i = 0; i < data.length; i++) {
        (function(index) {
            const btn = document.createElement('button');
            btn.textContent = `Board ${index + 1}`;
            btn.id = `board-${index}`;
            btn.addEventListener('click', () => {
                if (previousBtn) {
                    previousBtn.classList.remove('btn-active');
                }
                btn.classList.add('btn-active')
                const boardId = data[index]._id;
                board_id=boardId
                previousBtn=btn
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