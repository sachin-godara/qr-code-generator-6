import requests

url = "http://localhost:8000/api/generator/scan-test"
payload = {
    "data": "https://example.com",
    "dots_style": "square",
    "bg_color": "#ffffff",
    "dots_color": "#000000"
}

response = requests.post(url, json=payload)
print(response.status_code)
print(response.json())
