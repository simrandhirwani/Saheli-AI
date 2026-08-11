import httpx
import json

url = "http://127.0.0.1:8000/api/haqfinder/chat"
tests = [
    ("hi", "मुझें सरकारी स्कीम के बारे में जानकारी चाहिए"),
    ("gu", "મને સરકારી યોજના વિશે માહિતી જોઈશે"),
    ("mr", "मला सरकारी योजना बद्दल माहिती हवी आहे"),
    ("en", "I need information about government schemes")
]

with httpx.Client() as client:
    for lang, msg in tests:
        payload = {"message": msg, "history": [], "language": lang}
        resp = client.post(url, json=payload, timeout=10)
        print('\n---', lang, 'status', resp.status_code)
        try:
            data = resp.json()
            print(json.dumps(data, ensure_ascii=False, indent=2))
        except Exception as e:
            print('json parse error', e)
            print(resp.text)
