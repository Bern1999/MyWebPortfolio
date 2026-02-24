function sendMail() {
  let params = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value,
  };

  emailjs.send("service_ptxeocu", "template_y8r1ajt", params)
    .then(() => {
      alert("Message sent! ✅");
    })
    .catch((err) => {
      console.log(err);
      alert("Failed to send message ❌");
    });
}