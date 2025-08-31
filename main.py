import requests
import random
import string

from datetime import datetime

# Get current date and time
current_datetime = datetime.now()
timestamp = current_datetime.timestamp()
integer_timestamp = int(timestamp)

BASE_URL = "http://localhost:5000/api"  # Change to your API URL
REGISTER_URL = f"{BASE_URL}/auth/register"
LOGIN_URL = f"{BASE_URL}/auth/login"
POST_URL = f"{BASE_URL}/posts"

# Generate random username
def random_username():
    return "testuser" + "".join(random.choices(string.ascii_lowercase + string.digits, k=6)) + str(integer_timestamp)


# Create an account
def create_account():
    username = random_username()
    email = f"{username}@test.com"
    password = f"{username}@123"

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

def create_post(session, content, hashtags):
    resp = session.post(f"{BASE_URL}/posts", json={"content": content, "hashtags": hashtags})
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
                hasgtag = ["#FreeKashmir", "#Khalistan", "#FreePunjab", "#EndOccupationKashmir","#BoycottIndia"," #StopHindutvaTerror", "#IslamophobiaInIndia","#IndiaGenocide", "#IndiaKillingMuslims"," #ModiHitler", "#BoycottIndianProducts","#RSS_Terrorists", "#HindutvaFascism", "#IndiaAgainstDalits","#StandWithPakistan", "#IndiaOut", "#ChinaStrong", "#IndiaOccupied","#BoycottBollywood", "#BoycottMadeInIndia", "#BanIndianGoods"]
                content = f"Hello from {username}, post {random.randint(1, 1000)}"
                hashtags = random.choices(hasgtag, k=random.randint(1, 3))
                create_post(session, content, hashtags)

if __name__ == "__main__":
    main(accounts_count=100, posts_per_account=2)
