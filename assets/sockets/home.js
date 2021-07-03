socket.emit('getOnlineFriends' , userId)
socket.on('takeOnlineFriends' , friends =>{
    let div = document.getElementById('onlineFriends')
    if (friends.length === 0){
        div.innerHTML = `
            <br>
            <p class ='alert alert-danger'> No online friends . </p>
        `
    }else{
        let html = `
            <div id="card" class ='row justify-content-md-center mainOnlineUsers'>
        `
        for(let friend of friends){
            html += `
                <div class= 'col col-12 col-md-6 col-lg-4 onlineUsers'>
                    <img id="proImage" src="/${friend.image}" alt=""> 
                    <div class= "proName">
                       <a href="/profile/${friend.id}">  <h3>${friend.name}</h3></a>
                      <a href='/chat/${friend.chatId}' ><button>Chat </button> </a>
                    </div>
                </div>
            `
        }
        html+= '</div>'
        div.innerHTML = html
    }
})