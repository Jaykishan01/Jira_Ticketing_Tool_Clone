let addBtn =    document.querySelector('.add-btn');
let midelCont = document.querySelector('.modal-cont');
let mainCont =  document.querySelector('.main-cont');
let removeBtn = document.querySelector('.remove-btn');
let removeFlag = false;

let colors = ['lightpink', 'lightgreen', 'lightblue', 'black']

let modalPriorityColor = colors[colors.length - 1]// black
let allPriorityColors = document.querySelectorAll('.priority-color')
let addFlag = false
let textAreaCont = document.querySelector('.textarea-cont')

let toolBoxColor = document.querySelectorAll('.color')
let lockClass = 'fa-lock';
let unlocClass = 'fa-lock-open';

let ticketsArr = []; // which will store all the tickets as objetcs 

//Filter Tickets with respect to colors
// local storage get all tickets from local storage

if(localStorage.getItem('tickets')){
    ticketsArr = JSON.parse(localStorage.getItem('tickets'))
    ticketsArr.forEach(function(ticket){
        createTicket(ticket.ticketColor,ticket.ticketTask,ticket.ticketId)
    })
}

for (let i = 0; i < toolBoxColor.length; i++) {
    toolBoxColor[i].addEventListener('click', (e) => {
        let currentToolBoxColor = toolBoxColor[i].classList[0]
        // console.log(currentToolBoxColor)
        let filteredTickets = ticketsArr.filter((ticketObj) => {
            return currentToolBoxColor === ticketObj.ticketColor;
        })

        // Remove previous Tikctes 

        let allTikcets = document.querySelectorAll('.ticket-cont');
        for (let i = 0; i < allTikcets.length; i++) {
            allTikcets[i].remove();
        }

        filteredTickets.forEach((filteredObj) => {
            // Filtered Tikcet Display 
            createTicket(filteredObj.ticketColor, filteredObj.ticketTask, filteredObj.ticketId)
            // console.log(ticketsArr)
        });


    });

    toolBoxColor[i].addEventListener('dblclick',(e)=>{
        let allTikcets = document.querySelectorAll('.ticket-cont');
    for(let i=0;i<allTikcets.length; i++){
        allTikcets[i].remove();
    }

    ticketsArr.forEach((ticketObj)=>{
        createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketId)

    })

    })


}

addBtn.addEventListener('click', function (e) {
    // Display The  MODEL

    // addFlag ,true , Modal Display
    // addFlag false, Modal Hide
    addFlag = !addFlag
    if (addFlag == true) {
        midelCont.style.display = 'flex'
    }
    else {
        midelCont.style.display = 'none'
    }
    // Add a card


    // changing priority color 
    allPriorityColors.forEach((colorElem) => {
        colorElem.addEventListener('click', (e) => {
            allPriorityColors.forEach((priorityColorElem) => {
                priorityColorElem.classList.remove('active')
            })
            colorElem.classList.add('active')
            modalPriorityColor = colorElem.classList[0]



        })
    })

});
// Generating a Ticket
midelCont.addEventListener('keydown', function (e) {
    let key = e.key
    if (key == 'Shift') {
        createTicket(modalPriorityColor, textAreaCont.value)// This Function will generate a Ticket 
        midelCont.style.display = 'none'
        addFlag = false;
        textAreaCont.value = ''
    }


})

function createTicket(ticketColor, ticketTask, ticketId) {
    let id = ticketId || shortid()
    let tikcetcont = document.createElement('div')
    tikcetcont.setAttribute('class', 'ticket-cont')
    tikcetcont.innerHTML = `
    <div class="ticket-color ${ticketColor}"> </div>
    <div class="ticket-id">RITM ${id}</div>
    <div class="task-area contenteditable="true" ">${ticketTask}</div>  
    <div class="ticket-lock">
    <i class="fa-solid fa-lock"></i>
</div>
  `
    mainCont.appendChild(tikcetcont);
    handeRemoval(tikcetcont,id);
    handleLock(tikcetcont,id);
    handlecolor(tikcetcont,id);

    if (!ticketId) {
        ticketsArr.push({ ticketColor, ticketTask, ticketId: id })
        localStorage.setItem('tickets',JSON.stringify(ticketsArr))
    }

}

removeBtn.addEventListener('click', (e) => {
    removeFlag = !removeFlag
    if (removeFlag == true) {
        removeBtn.style.color = 'red';
    } else {
        removeBtn.style.color = 'blue'
    }
})
// Remove andunlock tikctes
function handeRemoval(ticket,id) {
    ticket.addEventListener('click', () => {
        if (!removeFlag) return 
            
        let idx =  getTicketIDx(id);  //idx

        //localstorage removal of ticket

        ticketsArr.splice(idx,1)//only reomve particular idx

        let stringTicketArray = JSON.stringify(ticketsArr)
        localStorage.setItem('tickets',stringTicketArray)

        ticket.remove()
    })

}

// Lock and unlock tikcets
function handleLock(ticket,id) {
    let ticketLockElem = ticket.querySelector('.ticket-lock')
    let ticketTaskArea = ticket.querySelector('.task-area')
    let ticketLock = ticketLockElem.children[0]

    ticketLock.addEventListener('click', (e) => {
       let ticketIdx = getTicketIDx(id)
        if (ticketLock.classList.contains(lockClass)) {
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlocClass);
            ticketTaskArea.setAttribute('contenteditable', 'true')
            // handlecolor(ticket);
        }

        else {
            ticketLock.classList.remove(unlocClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute('contenteditable', 'false')
        }

               ticketsArr[ticketIdx].ticketTask=ticketTaskArea.innerText
               localStorage.setItem('tickets',JSON.stringify(ticketsArr))
    })

}

function handlecolor(ticket,id) {
    let tikcetColorband = ticket.querySelector('.ticket-color');

    tikcetColorband.addEventListener('click', (e) => {
        let currentTicketColor = tikcetColorband.classList[1];
        let ticketIdx =getTicketIDx(id)
        let currentTicketColorIdx = colors.findIndex((color) => {
            return currentTicketColor === color;
        })
        currentTicketColorIdx++;

        let newTicketColoridx = currentTicketColorIdx % colors.length;

        let newTicketColor = colors[newTicketColoridx]
        tikcetColorband.classList.remove(currentTicketColor)
        tikcetColorband.classList.add(newTicketColor)

// Modify color
ticketsArr[ticketIdx].ticketColor =newTicketColor
localStorage.setItem('tickets',JSON.stringify(ticketsArr))

    })

}

function getTicketIDx(id){

    let ticketIdx =ticketsArr.findIndex((ticketsObj)=>{
        return ticketsObj.ticketID==id
    })
    return ticketIdx
}


