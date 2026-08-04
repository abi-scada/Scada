from jinja2 import Environment, FileSystemLoader
import resend
import os

resend.api_key = os.getenv("RESEND_API_KEY")

# Load HTML templates
env = Environment(loader=FileSystemLoader("templates"))
print("email service")

async def send_welcome_email(
    email: str,
    username: str,
    password: str
):
    template = env.get_template("welcome_mail.html")

    html_content = template.render(
        username=username,
        password=password,
        login_url="http://localhost:3000/login"
    )

    try:
        resend.Emails.send({
            "from": "onboarding@resend.dev",  # same verified sender as your other email
            "to": "abi.scada@gmail.com",#[email]
            
            "subject": "Abi's Scada System",
            "html": html_content,
        })
    except Exception as e:
        print("welcome email error:", e)
        raise