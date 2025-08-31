import requests
import random
import string

BASE_URL = "http://localhost:5000/api"  # Change to your API URL
REGISTER_URL = f"{BASE_URL}/auth/register"
LOGIN_URL = f"{BASE_URL}/auth/login"
POST_URL = f"{BASE_URL}/posts"

# Generate random username
def random_username():
    return "user" + "".join(random.choices(string.ascii_lowercase + string.digits, k=6))


# Create an account
def create_account():
    username = random_username()
    email = f"{username}@test.com"
    password = "password123"
    
    data = {
        "username": username,
        "password": password,
        "email": email
    }
    
    response = requests.post(REGISTER_URL, json=data)
    if response.status_code == 201:
        print(f"[✔] Account created: {username}")
        return username, password
    else:
        print(f"[✖] Failed to create account: {response.json()}")
        return None, None

def login(username, password):
    session = requests.Session()
    resp = session.post(f"{BASE_URL}/auth/login", json={"username": username, "password": password})
    if resp.status_code == 200:
        print(f"Logged in: {username}")
        return session
    print(f"Login failed: {resp.json()}")
    return None

def create_post(session, content):
    resp = session.post(f"{BASE_URL}/posts", json={"content": content})
    print(resp.status_code, resp.json())



# Main function
def main(accounts_count=5, posts_per_account=2):
    accounts = []
    
    for _ in range(accounts_count):
        username, password = create_account()
        if username:
            accounts.append((username, password))
    for username, password in accounts:
        session = login(username, password)
        if session:
            for i in range(posts_per_account):
                content = f"Hello from {username}, post #{i+1}"
                create_post(session, content)

if __name__ == "__main__":
    main(accounts_count=3, posts_per_account=2)
