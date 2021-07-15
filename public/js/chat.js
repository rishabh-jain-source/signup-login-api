let socket = io()
socket.on("count", (count) => {
    console.log("count", count)
})

// document.getElementById("increment").addEventListener('click', () => {
//     const msg = document.getElementById("msg").value
//     socket.emit("countUpdate", msg)
// })
socket.on("welcome", (msg) => {
    console.log(msg)
})
// function func(e) {
//     e.preventDefault()
//     alert("gello")
//     console.log("hello")
// }
socket.on("print", (data) => {
    alert(data)
    // console.log(data)
})
socket.on('location', location => {
    console.log(location)
    console.log(`google.com/maps?q=${location.latitude},${location.longitude}`)
});
document.getElementById("submit-form").addEventListener('submit', (e) => {
    e.preventDefault()
    document.getElementById("send").setAttribute("disabled", "disabled")
    socket.emit("msg", document.getElementById("msg").value, (message) => {
        document.getElementById("send").removeAttribute("disabled")
        document.getElementById("msg").focus()
        document.getElementById("msg").value = ""
        console.log(message)
    })
})
document.getElementById("location").addEventListener("click", () => {
    if (navigator.geolocation.getCurrentPosition) {
        let a = navigator.geolocation.getCurrentPosition(position => {
            //socket.json.send(JSON.stringify(position.coords))
            socket.emit("location", {
                check: position.coords,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            })
        })
    }
})
