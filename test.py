import requests
import json



url = "http://127.0.0.1:3000"
api = "/api"
users = "/users"
drinks = "/drinks"


headers = {
    "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0MSIsImV4cCI6MTYzNDc3NDM0M30.QznmwXKYyxjoUhLDRv3UbdTR1SxACG9e535vMpulHDM",
}


out = open("test.html", mode="w+", encoding="utf-8")


out.write(requests.get(url + api + drinks, headers=headers).text)
