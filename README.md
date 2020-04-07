# Web-based-Cloud-Systems


# 1.2 - RESTFUL Service

## Usage
In order to run the FLASK webserver which serves the URL shortener service you can run the python source using the following two methods:

### Directly using Python locally
```sh
$ python src/rest_server.py
```

Optionally you can specify the **FLASK_PORT** environment variable to set the port on which the server will be running.


### Using a Docker container

In order to use the dockerized web service you can build the docker container through the supplied docker file.

```sh
# Within the root directory container the Dockerfile
$ docker build . -t flask_rest
$ docker run -d -p 5000:50000 flask_rest
```

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

