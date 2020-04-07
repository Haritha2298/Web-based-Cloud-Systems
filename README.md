# Web-based-Cloud-Systems
# 1.1 - Webservice - SOAP

## Usage
. Download Python
[Download Python](https://www.python.org/downloads/)

2. Use PIP to install the python depencies
```sh
$ pip install ladon
$ pip install zeep
```

3. Run the flask server using python
```sh
$ python runserver.py
```
4.Now on another python command prompt run the client for the service.
```sh
$ python client.py
```
This will print the results of the different arithmetic operations performed by the calculator.

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

Optionally you can set the **FLASK_PORT** environment variable to set the port on which the server will be running.

In order to use the API it is advised to use [curl](https://curl.haxx.se/) or [Postman](https://www.postman.com/) in order to send the HTTP requests to the server. If you are using a POST or PUT request to the server be sure to include **url** as form-encoded data parameter in order for the server to correctly process the request.


## Implementation
Python was chosen as language for Assignment 1 so we chose flask to build the service. For the design we used the HTTP response design given. This resulted in the following API design:

**/**

GET -> Display all the links within the webservice.<br/>
    - Results in a list of links between full URLs and shortened URLs.<br/>

POST -> Allow the user to post a **url** (form encoded) to the server to create a short link, accepts the **url** form encoded value as data.<br/>
    - 201 -> OK, response contains shortened URL.<br/>
    - 400 -> URL posted is not a valid URL.<br/>

DELETE -> Allows the user to delete a **url** link from the server, accepts the **url** form encoded value as data.<br/>
    - 204 -> Succefully deleted a link.<br/>
    - 404 -> Could not find a link associated with the **url**.<br/>

**/:id**

GET -> Redirects the user to the original URL behind the shortened URL<br/>
    - 301 -> Succesful redirect.<br/>
    - 404 -> Could not find a link for the specified shortened URL.<br/>
    
PUT -> Update or create a link for the specified shortened URL, accepts the **url** form encoded value as data.<br/>
    - 400 -> Invalid **url** specified.<br/>
    - 404 -> Shortened URL not found.<br/>
    - 200 -> Succesfully updated URL.<br/>
    
DELETE -> Allows the user to delete a **url** link from the server, accepts the **url** form encoded value as data. <br/>
    - 204 -> Succefully deleted a link.<br/>
    - 404 -> Could not find a link associated with the passed **url**.<br/>


The implementation of the flask REST server is able to serve multiple users, since the links between the shortened and original URLs are stored in memory on the server. Doing it this way the every user is able to access shortened URLs created by other users. This implementation choice was made since it was a simple solution to create a standalone service which also contains the data it needs to operate.


