window.onload = () => {
	const API_URL = "https://my-notes-app-production-0734.up.railway.app";
	document
		.getElementById("LoginForm")
		.addEventListener("submit", async (event) => {
			event.preventDefault();

			const email = document.getElementById("email").value;
			const password = document.getElementById("password").value;

			try {
				const response = await fetch(`${API_URL}/login`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password })
				});

				const data = await response.json();

				if (data.success) {
					// Store user data in localStorage
					localStorage.setItem("user", data.user.name);
					localStorage.setItem("userEmail", data.user.email);

					// Redirect to homepage
					window.location.href = "../Homepage/Homepage.html";
				} else {
					alert(data.message || "Login failed");
				}
			} catch (error) {
				console.error("Error:", error);
			}
		});
};
