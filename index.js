// URLs
const checkinURL = ""
const allVehiclesURL = ""
const checkoutURL = ""


// Check In pop up
document.getElementById("check_in").addEventListener("click", function(){
    console.log("In Click")
    document.getElementById("overlay").style.display = "block"
    document.getElementsByClassName("check-in-form")[0].style.display = "block"
})

// Check-in
const form = document.getElementById("_form")
document.getElementById("submit_check_in").addEventListener("click", (event)=>{
    event.preventDefault();

    vehicleNumber = form.elements["vehicle_number"].value
    vehicleModel = form.elements["vehicle_model"].value
    customerName = form.elements["customer_name"].value
    vehicleType = form.elements["vehicle_type"].value
    phoneNumber = form.elements["phone_number"].value

    fetch(`${checkinURL}`, {
        method: "post",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
            vehicle_number: vehicleNumber,
            vehicle_model: vehicleModel,
            vehicle_type: vehicleType,
            owner_phone: Number(phoneNumber)
        })
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        console.log(text);
    }).catch(function (error) {
        console.error(error)
    })

    window.location.reload();
})

// Go back from Check In pop up to main page
document.getElementById("go_back").addEventListener("click", function() {
    document.getElementById("overlay").style.display = "none"
    document.getElementsByClassName("check-in-form")[0].style.display = "none"
})

// vehicles
vehicles = []

// List all Vehicles
fetch (`${allVehiclesURL}`, {
    method: "get",
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
}).then(function (response) {
    return response.json();
}).then(function (json) {
    console.log(json)
        vehicles = json.map(element => {
            var newRow = document.getElementsByClassName("vehicles")[0].insertRow(-1)
            newRow.id = element.ID

            var newText = document.createTextNode(element.vehicle_number);
            newRow.insertCell(-1).appendChild(newText)

            newText = document.createTextNode(element.vehicle_model);
            newRow.insertCell(-1).appendChild(newText)

            newText = document.createTextNode(element.vehicle_type);
            newRow.insertCell(-1).appendChild(newText)

            newText = document.createTextNode(element.owner_phone);
            newRow.insertCell(-1).appendChild(newText)

            newText = document.createTextNode(element.checkin_time);
            newRow.insertCell(-1).appendChild(newText)

            checkoutBtn = document.createElement("button")
            checkoutBtn.innerHTML = "Check out"
            checkoutBtn.type = "click"
            newRow.insertCell(-1).appendChild(checkoutBtn)

            // Checkout Vehicle
            checkoutBtn.addEventListener("click", (event)=>{
                event.preventDefault();

                fetch(`${checkoutURL}${element.ID}`, {
                        method: "post",
                        headers: {
                          'Content-Type': 'application/json',
                          'Accept': 'application/json',
                        },
                    }).then(function (response) {
                        return response.json();
                    }).then(function (json) {
                        console.log(json)

                        document.getElementById("overlay").style.display = "block"  
                        document.getElementsByClassName("checkout-display")[0].style.display = "block"

                        var customerName = document.createElement("h3")
                        customerName.innerHTML = "John Doe"
                        document.getElementById("checkout_customer_name").appendChild(customerName)

                        var checkoutPhoneNumber = document.createElement("h3")
                        checkoutPhoneNumber.innerHTML = element.owner_phone
                        document.getElementById("checkout_phone_number").appendChild(checkoutPhoneNumber)

                        var checkoutVehicleNumber = document.createElement("h3")
                        checkoutVehicleNumber.innerHTML = element.vehicle_number
                        document.getElementById("checkout_vehicle_number").appendChild(checkoutVehicleNumber)

                        var vehicleType = document.createElement("h3")
                        vehicleType.innerHTML = element.vehicle_type
                        document.getElementById("checkout_vehicle_type").appendChild(vehicleType)

                        var checkoutVehicleModel = document.createElement("h3")
                        checkoutVehicleModel.innerHTML = element.vehicle_model
                        document.getElementById("checkout_vehicle_model").appendChild(checkoutVehicleModel)

                        var checkoutCinTime = document.createElement("h3")
                        checkoutCinTime.innerHTML = element.checkin_time
                        document.getElementById("checkout_cin_time").appendChild(checkoutCinTime)

                        var checkoutCoutTime = document.createElement("h3")
                        checkoutCoutTime.innerHTML = json.checkout_time
                        document.getElementById("checkout_cout_time").appendChild(checkoutCoutTime)

                        var checkoutDuration = document.createElement("h3")
                        checkoutDuration.innerHTML = json.hours_elapsed + " hrs"
                        document.getElementById("checkout_duration").appendChild(checkoutDuration)

                        var amount = document.createElement("h1")
                        amount.innerHTML = "₹ " + json.total_cost
                        amount.style.color = "#1c3ed6"
                        document.getElementById("to_pay").appendChild(amount)

                        // Proceed to pay
                        document.getElementById("proceed_to_pay").addEventListener("click", (event)=>{
                            event.preventDefault()

                            document.getElementsByClassName("checkout-display")[0].style.display = "none"
                            
                            document.getElementsByClassName("payment-successful")[0].style.display = "block"
                        })
                    })

            })

            return {row:newRow, vehicleNumber:element.vehicle_number}
        }
    )
})

// Filtered search
document.getElementById("query").addEventListener("input", (event)=>{
    console.log(vehicles)
    vehicles.forEach(vehicle=>{
        const shallBeVisible = vehicle.vehicleNumber.includes(event.target.value)
        vehicle.row.style.display = shallBeVisible ? '':'none'
    })
})