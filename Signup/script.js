window.onload = () => {
	document
		.getElementById("signupForm")
		.addEventListener("submit", async (event) => {
			event.preventDefault();

			const name = document.getElementById("name").value;
			const email = document.getElementById("email").value;
			const password = document.getElementById("password").value;

			try {
				const response = await fetch("http://localhost:5001/signup", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ name, email, password })
				});

				const data = await response.json();

				// Handle redirects
				if (data.redirect) {
					document.querySelector(".error").innerHTML = `<p>${data.message}</p>`;
					setTimeout(() => {
						window.location.href = data.url;
					}, 2000);
					return;
				}

				// Success case
				alert(data.message + ". Log in now");
				window.location.href = "http://127.0.0.1:5500/Signup/Login.html";
			} catch (error) {
				console.error("Error:", error);
				document.querySelector(".error").innerHTML =
					"<p>Something went wrong. Please try again.</p>";
			}
		});
};
