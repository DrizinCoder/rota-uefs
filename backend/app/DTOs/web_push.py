from pydantic import BaseModel

class CreateWebPushSubscriptionDTO(BaseModel):
    endpoint: str
    p256dh: str
    auth: str