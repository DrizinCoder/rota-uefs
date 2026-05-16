class FakeEmailService:
    def __init__(self):
        self.sent_messages = []

    def send_email(self, to, subject, body):
        self.sent_messages.append(
            {"to": to, "subject": subject, "body": body}
        )
        return True
