# Web-based-Cloud-Systems


# 1.2 - RESTFUL Service

## Usage
In order to run the FLASK webserver which serves the URL shortener service you can run the flask server in the following manner:

1. Download Python
[Download Python](https://www.python.org/downloads/)

2. Use PIP to install the python depencies
```sh
$ pip install -r requirements.txt
```

3. Run the flask server using python
```sh
$ python src/rest_server.py
```

Optionally you can specify the **FLASK_PORT** environment variable to set the port on which the server will be running.


In order to use the API it is advised to use curl or postman in order to send the HTTP requests to the server. If you are using a POST or PUT request to the server be sure to include **url** as form-encoded data parameter in order for the server to correctly process the request.


## Implementation
Python was chosen as language for Assignment 1 so we chose flask to build the service. For the design we used the HTTP response design given. This resulted in the following API design:

**/**

GET -> Display all the links within the webservice
    - Results in a list of links between full URLs and shortened URLs

POST -> Allow the user to post a **url** (form encoded) to the server to create a short link, accepts the **url** form encoded value as data.
    - 201 -> OK, response contains shortened URL
    - 400 -> URL posted is not a valid URL

DELETE -> Allows the user to delete a **url** link from the server, accepts the **url** form encoded value as data.
    - 204 -> Succefully deleted a link
    - 404 -> Could not find a link associated with the **url**

**/:id**

GET -> Redirects the user to the original URL behind the shortened URL
    - 301 -> Succesful redirect
    - 404 -> Could not find a link for the specified shortened URL
    
PUT -> Update or create a link for the specified shortened URL, accepts the **url** form encoded value as data.
    - 400 -> Invalid **url** specified
    - 404 -> Shortened URL not found
    - 200 -> Succesfully updated URL
    
DELETE -> Allows the user to delete a **url** link from the server, accepts the **url** form encoded value as data. 
    - 204 -> Succefully deleted a link
    - 404 -> Could not find a link associated with the **url**


The implementation of the flask REST server is able to serve multiple users already, since the links between the shortened and original URLs are stored in memory on the server. Doing it this way the every user is able to access shortened URLs created by other users.


## How to implement a URL-shortener for multiple users?
Our RESTFUL service stores the links between the shortened URLs in memory using a python dictionary. Since this is not bound to any specific user every user that accesses the server can utilise the shortened URLs created by other users of the service. The server contains its own state in this case and can serve the multiple users the same content.

This implementation however has some downsides:
- Once the server is restarted the state and therefore URLs mapped are lost
- If the service is deployed through a load balancer each server will have its own, different state. This resolves in clients accessing the service experience inconsistent behaviour.

A better approach to combat this would be to remove the state from the server's memory. By moving the links between the original URLs and the shortened URLs to a database it is possible to maintain the state of the links outside of the REST server, making it possible for the server to be completely stateless and upon restarting not be affected by a state reset. This would also help in a load balanced situation where each server will request the database for links making the user experience similar if assigned to a different server. 

An even better proposal for the design is to implement caching of frequently used or recently accessed URLs to lower the load on the database containing the links and improve performance on the URL shortener service.

