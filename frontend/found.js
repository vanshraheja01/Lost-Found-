const video = document.getElementById("camera");

const canvas = document.getElementById("canvas");

const captureButton =
    document.getElementById("capture");

let capturedImage = null;


// START CAMERA

async function startCamera() {

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                video: true
            });

        video.srcObject = stream;

    } catch (error) {

        console.log(
            "Camera permission denied or unavailable."
        );

    }

}

startCamera();


// CAPTURE IMAGE

captureButton.addEventListener(
    "click",
    function () {

        canvas.width = video.videoWidth;

        canvas.height = video.videoHeight;

        const context =
            canvas.getContext("2d");

        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );


        capturedImage =
            canvas.toDataURL("image/jpeg");


        alert(
            "Picture captured successfully!"
        );

    }
);


// SUBMIT

const form =
    document.getElementById("foundForm");


form.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const imageInput =
            document.getElementById("image");


        const formData =
            new FormData();


        formData.append(
            "type",
            "found"
        );


        formData.append(
            "itemName",
            document.getElementById(
                "itemName"
            ).value
        );


        formData.append(
            "category",
            document.getElementById(
                "category"
            ).value
        );


        formData.append(
            "color",
            document.getElementById(
                "color"
            ).value
        );


        formData.append(
            "description",
            document.getElementById(
                "description"
            ).value
        );


        formData.append(
            "location",
            document.getElementById(
                "location"
            ).value
        );


        formData.append(
            "date",
            document.getElementById(
                "date"
            ).value
        );


        formData.append(
            "contactName",
            document.getElementById(
                "contactName"
            ).value
        );


        formData.append(
            "email",
            document.getElementById(
                "email"
            ).value
        );


        formData.append(
            "phone",
            document.getElementById(
                "phone"
            ).value
        );


        // Uploaded image

        if (imageInput.files.length > 0) {

            formData.append(
                "image",
                imageInput.files[0]
            );

        }


        // Camera image

        else if (capturedImage) {

            const blob =
                await fetch(
                    capturedImage
                ).then(res => res.blob());


            formData.append(
                "image",
                blob,
                "camera-image.jpg"
            );

        }


        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/items",
                    {

                        method: "POST",

                        body: formData

                    }
                );


            const result =
                await response.json();


            if (response.ok) {

                alert(
                    "Found item reported successfully!"
                );

                form.reset();

                capturedImage = null;

            } else {

                alert(result.message);

            }

        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to server."
            );

        }

    }
);