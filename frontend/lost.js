const form = document.getElementById("lostForm");

form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const itemData = {

        type: "lost",

        itemName:
            document.getElementById("itemName").value,

        category:
            document.getElementById("category").value,

        color:
            document.getElementById("color").value,

        description:
            document.getElementById("description").value,

        location:
            document.getElementById("location").value,

        date:
            document.getElementById("date").value,

        contactName:
            document.getElementById("contactName").value,

        email:
            document.getElementById("email").value,

        phone:
            document.getElementById("phone").value

    };


    try {

        const response = await fetch(
            "http://localhost:5000/api/items",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(itemData)

            }
        );


        const result = await response.json();


        if (response.ok) {

            alert("Lost item reported successfully!");

            form.reset();

            window.location.href = "items.html";

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to the server."
        );

    }

});