const url = 'https://jsonplaceholder.typicode.com/users'
const sleep = ms => {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms)
    })
}
const xhrBtn = document.querySelector('.xhr')
const fetchBtn = document.querySelector('.fetch')
let xhrFrame = document.getElementById('xhr')
let fetchFrame = document.getElementById('fetch')
function sendXHR(method, url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open(method, url)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.responseType = 'json'
        xhr.onload = () => { 
            if(xhr.status >= 400) {
                reject(xhr.response)
            }
            resolve(xhr.response)
        }
        xhr.onerror = () => {
            reject(xhr.response);
        }
        xhr.send()
    })
}
xhrBtn.addEventListener('click', () => {
    xhrFrame.innerHTML = 'Loading...'
    sleep(1000).then(() => {
        xhrFrame.innerHTML = ''
        sendXHR("GET", url)
        .then(data => {
            for(let i = 0; i < data.length; i++) {
                let str = document.createElement('div')
                str.innerHTML +=`${data[i].name}`
                xhrFrame.append(str)
            }
            console.log(data)
        })
        .catch(err => console.log(err))
    }, {once : true})
})

async function getRequest() {
    try {
      const res = await fetch(url);
      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }
      return await res.json();
      
    } catch (err) {
      console.error(err);
    }
  }
async function putRequest(method, url, body = null){
    const headers = {
        'Content-Type': 'application/json'
    }
    const response = await fetch(url, {
    method: method,
    body: JSON.stringify(body),
    headers: headers
})
if (response.ok) {
    return response.json()
} else {
    throw new Error('Bad response from server')
}
}
fetchBtn.addEventListener('click', () => {
    fetchFrame.innerHTML = 'Loading...'
    sleep(1000).then(() => {
    fetchFrame.innerHTML = ''
    getRequest()
    .then(res => {
        for(let i = 0; i < res.length; i++) {
            let count = i
            fetchFrame.innerHTML += `<div class="block ${count.toString()}">
            <span class="${count.toString()}">${res[i].name}</span></br>
            <button class="edit ${count.toString()}">Edit</button>
            <button class="delete ${count.toString()}">Delete</button></br>
            <input type="text" value="" class="input hide ${count.toString()}">
            <button class="save hide ${count.toString()}">Save</button></div></br>`
        } 
        let inputs = document.querySelectorAll('input')
        let edditBtns = document.querySelectorAll('.edit')
        let deleteBtns = document.querySelectorAll('.delete')
        let saveBtns = document.querySelectorAll('.save')
        let usersName = document.querySelectorAll('span')
        let blocks = document.querySelectorAll('.block')
        blocks.forEach((el, i) => {
            edditBtns[i].addEventListener('click', () => {
                inputs[i].classList.remove('hide')
                saveBtns[i].classList.remove('hide')
            })
            deleteBtns[i].addEventListener('click', () => {
                usersName[i].innerHTML = `Loading...`
                sleep(1000).then(() => {
                const urlChange = `https://jsonplaceholder.typicode.com/posts/${res[i].id}`
                let body = {id: res[i].id}
                putRequest('PUT', urlChange, body)
                .then(response => {
                    alert(`user with id:${response.id} has been deleted`)
                    blocks[i].remove()
                })
                .catch(err => console.log(err))
                })    
            })
        })   
        inputs.forEach((e, i) => {
            e.addEventListener('change', () => {
                const urlChange = `https://jsonplaceholder.typicode.com/posts/${res[i].id}`
                let body = {id: res[i].id, name: e.value.trim()}
                saveBtns[i].addEventListener('click', () => {
                    putRequest('PUT', urlChange, body)
                    .then(response => {
                        usersName[i].innerHTML = response.name
                        e.value = ''
                        e.classList.add('hide')
                        saveBtns[i].classList.add('hide')
                    })
                    .catch(err => console.log(err))
                })
            })
        })
    })
})
})
function spinner(el) {
    el.innerHTML +=`<div class="loader"></div>`
    sleep(1000).then(() => {
        el.classList.add('hide')
    })
}