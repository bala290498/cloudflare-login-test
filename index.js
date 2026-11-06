const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Secure Login</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0; min-height: 100vh; padding: 24px;
      display: grid; place-items: center;
      font-family: Arial, sans-serif; background: #f1f5f9;
    }
    .login-box {
      width: 100%; max-width: 380px; padding: 35px;
      background: #fff; border-radius: 12px;
      box-shadow: 0 5px 25px rgba(0,0,0,.1);
    }
    h1 { margin: 0 0 24px; text-align: center; font-size: 25px; }
    label { display: block; margin: 14px 0 6px; font-size: 14px; }
    input {
      width: 100%; padding: 13px; border: 1px solid #cbd5e1;
      border-radius: 6px; font-size: 15px;
    }
    button {
      width: 100%; margin-top: 20px; padding: 13px;
      border: 0; border-radius: 6px; background: #f38020;
      color: white; font-size: 16px; cursor: pointer;
    }
    button:disabled { opacity: .6; cursor: wait; }
    #message { min-height: 20px; margin: 16px 0 0; text-align: center; }
  </style>
</head>
<body>
  <main class="login-box">
    <h1>Welcome Back</h1>
    <form id="loginForm">
      <label for="username">Username</label>
      <input id="username" name="username" type="text"
             autocomplete="username" required>
      <label for="password">Password</label>
      <input id="password" name="password" type="password"
             autocomplete="current-password" required>
      <button id="loginButton" type="submit">Login</button>
    </form>
    <p id="message" role="status" aria-live="polite"></p>
  </main>
  <script>
    const form = document.getElementById("loginForm");
    const message = document.getElementById("message");
    const button = document.getElementById("loginButton");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      message.textContent = "";
      button.disabled = true;

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
          })
        });
        const result = await response.json();

        if (response.ok && result.success) {
          message.style.color = "#15803d";
          message.textContent = "Login successful!";
        } else {
          message.style.color = "#dc2626";
          message.textContent = "Invalid username or password.";
        }
      } catch {
        message.style.color = "#dc2626";
        message.textContent = "Unable to connect. Please try again.";
      } finally {
        button.disabled = false;
      }
    });
  </script>
</body>
</html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/login") {
      if (request.method !== "POST") {
        return Response.json(
          { success: false, message: "Method not allowed" },
          { status: 405, headers: { Allow: "POST" } }
        );
      }

      let data;
      try {
        data = await request.json();
      } catch {
        return Response.json(
          { success: false, message: "Invalid request" },
          { status: 400 }
        );
      }

      if (
        typeof data.username !== "string" ||
        typeof data.password !== "string"
      ) {
        return Response.json(
          { success: false, message: "Invalid request" },
          { status: 400 }
        );
      }

      const valid =
        data.username === env.APP_USERNAME &&
        data.password === env.APP_PASSWORD;

      if (!valid) {
        return Response.json(
          { success: false, message: "Invalid credentials" },
          { status: 401 }
        );
      }

      // Demo only: no authenticated session is created by this response.
      return Response.json({ success: true, message: "Login successful" });
    }

    if (request.method === "GET" &&
        (url.pathname === "/" || url.pathname === "/index.html")) {
      return new Response(HTML, {
        headers: { "Content-Type": "text/html; charset=UTF-8" }
      });
    }

    return new Response("Not Found", { status: 404 });
  }
};
