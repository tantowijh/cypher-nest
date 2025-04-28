from fastapi import APIRouter
from cryptography.fernet import Fernet
from datetime import datetime
import pusher
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

router = APIRouter()

# Function to generate a key
@router.get('/api/chat/generate-key')
def generate_key():
    key = Fernet.generate_key()
    # Store the key in an environment variable
    os.environ["SECRET_KEY"] = key.decode()
    return {"message": "Key generated and stored in environment variable"}


# Function to load the key
@router.get('/api/chat/load-key')
def load_key():
    key = os.environ.get("SECRET_KEY")
    if not key:
        generate_key()
        key = os.environ.get("SECRET_KEY")
    return key.encode()


# Function to encrypt a message
@router.post('/api/chat/encrypt')
def encrypt_message(data: dict):
    message = data.get("message")
    key = load_key()
    f = Fernet(key)
    encrypted_message = f.encrypt(message.encode())
    return encrypted_message


# Function to decrypt a message
@router.post('/api/chat/decrypt')
def decrypt_message(data: dict):
    encrypted_message = data.get("encryptedMessage")
    key = load_key()
    f = Fernet(key)
    decrypted_message = f.decrypt(encrypted_message).decode()
    return decrypted_message


# Pusher client initialization
pusher_client = pusher.Pusher(
    app_id=os.getenv('PUSHER_APP_ID'),
    key=os.getenv('PUSHER_KEY'),
    secret=os.getenv('PUSHER_SECRET'),
    cluster=os.getenv('PUSHER_CLUSTER'),
)


@router.post("/api/chat/send")
def user_left(data: dict):
    type = data.get("type")
    sender = data.get("sender")
    content = data.get("content")
    decryptedContent = data.get("decryptedContent")
    timestamp = data.get("timestamp")

    pusher_client.trigger('cypher-chat', 'upcomming-message', {
        'type': type,
        'sender': sender,
        'content': content,
        'decryptedContent': decryptedContent,
        'timestamp': timestamp
    })
    return {"message": "Message sent to Pusher channel"}


@router.post("/api/chat/user-joined")
def user_joined(data: dict):
    username = data.get("username")
    pusher_client.trigger('cypher-chat', 'notification', {
        'type': "notification",
        'sender': "System",
        'content': f"{username} has joined the chat",
        'decryptedContent': None,
        'timestamp': datetime.now().isoformat()
    })
    return {"message": "User joined event sent to Pusher channel"}


@router.post("/api/chat/user-left")
def user_left(data: dict):
    username = data.get("username")
    pusher_client.trigger('cypher-chat', 'notification', {
        'type': "notification",
        'sender': "System",
        'content': f"{username} has left the chat",
        'decryptedContent': None,
        'timestamp': datetime.now().isoformat()
    })
    return {"message": "User left event sent to Pusher channel"}
