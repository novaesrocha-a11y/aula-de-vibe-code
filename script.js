const form = document.getElementById("contact-form");
const responseMessage = document.getElementById("form-response");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();

  responseMessage.textContent = `Obrigado, ${name || "cliente"}! Sua mensagem foi enviada. Em breve entraremos em contato.`;
  responseMessage.style.color = "#a7f3d0";
  form.reset();
});
