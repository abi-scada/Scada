from fastapi_mail import FastMail, MessageSchema, MessageType
from jinja2 import Environment, FileSystemLoader
from emailConfig import conf

# Load HTML templates
env = Environment(loader=FileSystemLoader("templates"))
print("email service")
async def send_welcome_email(
    email: str,
    username: str,
    password: str
):
    #print(" welcome email service", email, username, password)
    template = env.get_template("welcome_mail.html")

    html_content = template.render(
        username=username,
        password=password,
        login_url="http://localhost:3000/login"
    )

    message = MessageSchema(
        subject="Abi's Scada System",
        recipients=[email],
        body=html_content,
        subtype=MessageType.html
    )

    fm = FastMail(conf)
    await fm.send_message(message)

