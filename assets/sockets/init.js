const socket = io()
const btn = document.getElementById('friendRequestsdropdown')
let userId = document.getElementById('userId').value;


socket.on('connect' , ()=>{
    socket.emit('joinNotificationRoom' , userId)
    socket.emit('goOnline', userId)
})

socket.on('newFriendRequest', data =>{
    //console.log("we r here");
   // console.log(data);
    let friendRequest = document.getElementById('friendRequest');
    friendRequest.innerHTML+= `<a class="dropdown-item" href="/profile/${data.id}">${data.name}</a>`;


    const span = friendRequest.querySelector('span')
    if(span) span.remove();

    let btn = document.getElementById('friendRequestsdropdown')
    btn.classList.remove('btn-secondary')
    btn.classList.add('btn-danger')
    
    setTimeout(()=>{
        btn.classList.remove('btn-danger')
        btn.classList.add('btn-secondary')
    }, 5000, 'funky');

})

// btn.onclick = ()=>{
//     btn.classList.remove('btn-danger')
//     btn.classList.add('btn-secondary')
// }


