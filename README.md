
# NOTES

- Just plug this in like any other unload package - the dbdict .unl first, then the code .unl.
- Send a *POST* request to the /UserDetails endpoint, with your POST data like this: {"UserDetails":{"User":"<insert username here>"}}
  - You can include include times to search *after*, such as:
    - {"UserDetails":{"User":"<insert username here>","TimeOpened":"01/01/14 00:00:00"}}
    - {"UserDetails":{"User":"<insert username here>","TimeUpdated":"01/01/14 00:00:00"}}
    - {"UserDetails":{"User":"<insert username here>","TimeClosed":"01/01/14 00:00:00"}}
      - Note that the date/time you send *must* be in this format.
- You'll get back a JSON response with the tickets in a big long string, which you just need to split on the ` character.
  - You can split the individual fields in a ticket further on the '|' character.
- You'll also get back a list of the devices/CIs which have that user as the Owner.
  - You can split these devices on ` and can split on | for the fields per device.
- You'll ALSO get back a list of employee details for the user you sent in.
- The devices/CIs and employee details assume that you have certain fields filled in on the device and contacts tables.
  - If you get errors and/or missing data, check the UserDetails ScriptLibrary to make sure you have data in the fields which it is querying.
- This could easily be expanded upon to add data from other modules or anything else you'd like.
  - Just edit the UserDetails ScriptLibrary to respond with whatever you'd like!

# EXAMPLES (Python)
```
import requests as r, json as j
endpoint = 'http://<yourHostname>:<yourPort>/SM/9/rest/UserDetails'
response = r.post(endpoint, auth=('falcon', ''), data='{"UserDetails":{"User":"CAFFREY, AARON"}}')
parsed = j.loads(response.text)
tickets = parsed['UserDetails']['Tickets'].split('`')
for ticket in tickets:
    ticket = ticket.split('|')
    for field in ticket:
        print(field)
    print(' ')
devices = parsed['UserDetails']['Devices'].split('`')
for device in devices:
    device = device.split('|')
    for field in device:
        print(field)
    print(' ')

contact = parsed['UserDetails']['Contact'].split('|')
print('Employee ID: ' + contact[0])
print('Employee Department: ' + contact[1])
print('Employee Title: ' + contact[2])
print('Employee Email: ' + contact[3])
print('Employee Phone: ' + contact[4])
print('Employee Manager: ' + contact[5])

import requests as r, json as j
endpoint = 'http://<yourHostname>:<yourPort>/SM/9/rest/UserDetails'
response = r.post(endpoint, auth=('falcon', ''), data='{"UserDetails":{"User":"CAFFREY, AARON","TimeOpened":"01/01/14 00:00:00"}}')
```
