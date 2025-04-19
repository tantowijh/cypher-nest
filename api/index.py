from fastapi import FastAPI, HTTPException
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
import rsa
import base64
import os

app = FastAPI()

# Helper functions for Vigenère cipher
def is_alphabetic(char: str) -> bool:
    return char.isalpha()

def get_char_code(char: str) -> int:
    return ord(char.upper()) - 65

def get_char_from_code(code: int) -> str:
    return chr((code % 26) + 65)

# Vigenère cipher encryption
def encrypt_vigenere(plaintext: str, keyword: str) -> str:
    if not keyword.strip():
        raise ValueError("Keyword cannot be empty")
    
    processed_keyword = ''.join(filter(str.isalpha, keyword.upper()))
    if not processed_keyword:
        raise ValueError("Keyword must contain at least one alphabetic character")
    
    result = []
    key_index = 0

    for char in plaintext:
        if is_alphabetic(char):
            plain_char_code = get_char_code(char)
            key_char_code = get_char_code(processed_keyword[key_index % len(processed_keyword)])
            encrypted_char_code = (plain_char_code + key_char_code) % 26
            encrypted_char = get_char_from_code(encrypted_char_code)
            result.append(encrypted_char if char.isupper() else encrypted_char.lower())
            key_index += 1
        else:
            result.append(char)
    
    return ''.join(result)

# Vigenère cipher decryption
def decrypt_vigenere(ciphertext: str, keyword: str) -> str:
    if not keyword.strip():
        raise ValueError("Keyword cannot be empty")
    
    processed_keyword = ''.join(filter(str.isalpha, keyword.upper()))
    if not processed_keyword:
        raise ValueError("Keyword must contain at least one alphabetic character")
    
    result = []
    key_index = 0

    for char in ciphertext:
        if is_alphabetic(char):
            cipher_char_code = get_char_code(char)
            key_char_code = get_char_code(processed_keyword[key_index % len(processed_keyword)])
            decrypted_char_code = (cipher_char_code - key_char_code + 26) % 26
            decrypted_char = get_char_from_code(decrypted_char_code)
            result.append(decrypted_char if char.isupper() else decrypted_char.lower())
            key_index += 1
        else:
            result.append(char)
    
    return ''.join(result)

# XOR-based encryption
def encrypt_xor(plaintext: str, passphrase: str) -> str:
    if not passphrase.strip():
        raise ValueError("Passphrase cannot be empty")
    
    hash_value = sum(ord(c) for c in passphrase)
    result = ''.join(chr(ord(c) ^ hash_value % 256) for c in plaintext)
    return result.encode('utf-8').hex()

# XOR-based decryption
def decrypt_xor(ciphertext: str, passphrase: str) -> str:
    if not passphrase.strip():
        raise ValueError("Passphrase cannot be empty")
    
    hash_value = sum(ord(c) for c in passphrase)
    try:
        decoded = bytes.fromhex(ciphertext).decode('utf-8')
        result = ''.join(chr(ord(c) ^ hash_value % 256) for c in decoded)
        return result
    except Exception:
        raise ValueError("Decryption failed. Please check your passphrase and try again.")

# AES Encryption/Decryption
def encrypt_aes(plaintext: str, key: str) -> str:
    if len(key) != 16:
        raise ValueError("AES key must be 16 characters long")
    
    key_bytes = key.encode('utf-8')
    iv = os.urandom(16)  # Generate a random initialization vector
    cipher = Cipher(algorithms.AES(key_bytes), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()

    # Pad plaintext to be a multiple of the block size
    padder = padding.PKCS7(algorithms.AES.block_size).padder()
    padded_data = padder.update(plaintext.encode('utf-8')) + padder.finalize()

    # Encrypt and return the result as base64
    encrypted = encryptor.update(padded_data) + encryptor.finalize()
    return base64.b64encode(iv + encrypted).decode('utf-8')

def decrypt_aes(ciphertext: str, key: str) -> str:
    if len(key) != 16:
        raise ValueError("AES key must be 16 characters long")
    
    key_bytes = key.encode('utf-8')
    data = base64.b64decode(ciphertext)
    iv = data[:16]
    encrypted_data = data[16:]

    cipher = Cipher(algorithms.AES(key_bytes), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()

    # Decrypt and remove padding
    decrypted_padded = decryptor.update(encrypted_data) + decryptor.finalize()
    unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
    decrypted = unpadder.update(decrypted_padded) + unpadder.finalize()

    return decrypted.decode('utf-8')

# RSA Encryption/Decryption
public_key, private_key = rsa.newkeys(512)

def encrypt_rsa(plaintext: str) -> str:
    encrypted = rsa.encrypt(plaintext.encode('utf-8'), public_key)
    return base64.b64encode(encrypted).decode('utf-8')

def decrypt_rsa(ciphertext: str) -> str:
    encrypted_data = base64.b64decode(ciphertext)
    decrypted = rsa.decrypt(encrypted_data, private_key)
    return decrypted.decode('utf-8')

# Unified encrypt API
@app.post("/api/encrypt")
def encrypt(data: dict):
    plaintext = data.get("plaintext")
    keyword = data.get("keyword")
    method = data.get("method")

    if not plaintext or not method:
        raise HTTPException(status_code=400, detail="Missing required fields: plaintext or method")
    
    if method == "vigenere":
        try:
            return {"encrypted": encrypt_vigenere(plaintext, keyword)}
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    elif method == "xor":
        try:
            return {"encrypted": encrypt_xor(plaintext, keyword)}
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    elif method == "aes":
        try:
            return {"encrypted": encrypt_aes(plaintext, keyword)}
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    elif method == "rsa":
        try:
            return {"encrypted": encrypt_rsa(plaintext)}
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    else:
        raise HTTPException(status_code=400, detail="Invalid encryption method")

@app.post("/api/decrypt")
def decrypt(data: dict):
    ciphertext = data.get("ciphertext")
    keyword = data.get("keyword")
    method = data.get("method")

    if not ciphertext or not method:
        raise HTTPException(status_code=400, detail="Missing required fields: ciphertext or method")
    
    if method == "vigenere":
        try:
            return {"decrypted": decrypt_vigenere(ciphertext, keyword)}
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    elif method == "xor":
        try:
            return {"decrypted": decrypt_xor(ciphertext, keyword)}
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    elif method == "aes":
        try:
            return {"decrypted": decrypt_aes(ciphertext, keyword)}
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    elif method == "rsa":
        try:
            return {"decrypted": decrypt_rsa(ciphertext)}
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    else:
        raise HTTPException(status_code=400, detail="Invalid decryption method")