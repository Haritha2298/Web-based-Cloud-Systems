import random
import string
import os
import re

from flask import Flask, request, redirect, Response, jsonify
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity, set_access_cookies
)


# https://www.regextester.com/93652
URL_RE = re.compile('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$')

DEBUG = True
PORT = 5000

# Env var to set port used for more customisability during containerisation
if os.environ.get('FLASK_PORT') is not None:
    PORT = int(os.environ.get('FLASK_PORT'))

# Debug logging purposes
if os.environ.get('FLASK_ENV') is not None and os.environ.get('FLAS_ENV') == 'PROD':
    DEBUG = False

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = 'default_secret_key'
app.config['JWT_COOKIE_CSRF_PROTECT'] = False
app.config['JWT_TOKEN_LOCATION'] = ['cookies']

# JWT Secret 
if os.environ.get('FLASK_JWT_SECRET') is not None:
    app.config['SECRET_KEY'] = os.environ.get('FLASK_JWT_SECRET')

jwt = JWTManager(app)

url_map = {} # Contains the key-value storage of links short urls/full urls
users = {} # Contains the key-value storage of users/passwords


# Helper function to generate a random shortened url given size
def generate_short_url(url_length=6):
    characters = string.ascii_letters
    url = ''.join(random.SystemRandom().choice(characters) for _ in range(url_length))

    # If the generated pair already exists create a new one
    if url in url_map:
        return generate_short_url()

    return url

# CREATE ACCOUNT
@app.route('/users', methods=['POST'])
def create_account():
    username = request.form.get('username')
    password = request.form.get('password')

    if not username:
        return jsonify({"message": "Missing username parameter"}), 400

    if not password:
        return jsonify({"message": "Missing password parameter"}), 400

    if username in users:
        return jsonify({"message": "User already exists"}), 301

    # Create user
    users[username] = password
    print("Created user {} with password {}".format(username, password))
    return jsonify({"message": "Created new user", "username": username, "password": password}), 301

# LOGIN
@app.route('/users/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    
    if not username:
        return jsonify({"message": "Missing username parameter"}), 400

    if not password:
        return jsonify({"message": "Missing password parameter"}), 400

    if username in users:
        # If password maches set a cookie containing the JWT token and return HTTP 200
        if users[username] == password:

            access_token = create_access_token(identity=username)
            response = jsonify({"message": "Logged in!", "User": username})
            set_access_cookies(response, access_token)

            return response, 200
        
        # If the password does not match for the user return HTTP unauthorized
        else:
            return jsonify({"message": "Invalid password"}), 403

    return jsonify({"message": "User not found"}), 403


@app.route('/', methods=['GET'])
def get_all():
    if request.method == 'GET':
        return jsonify(url_map), 200

@app.route('/', methods=['POST', 'DELETE'])
@jwt_required
def full():
    full_url = request.form.get('url')
    if not full_url:
        return jsonify({"message": "Missing url parameter"}), 400

    # Should create a link between full URL/shortened URL
    if request.method == 'POST':
        #  REGEX check for valid URL
        if not URL_RE.match(full_url):
            return jsonify({"message": "URL posted is not a valid URL", "url": full_url}), 400

        #  Check if an existing shortened URL was found and return it
        for key, value in url_map.items():
            if full_url == value:
                return jsonify({"message": "Shortened URL already existed", "url": full_url, "short_url": key}), 201

        # generate new short URL and save it in memory
        new_url = generate_short_url()
        url_map[new_url] = full_url

        return jsonify({"message": "Created URL link", "url": full_url, "short_url": new_url}), 201

    # Should delete a link between full URL/shortened URL
    if request.method == 'DELETE':

        # Check if a match is found, if so delete
        for key, value in url_map.items():
            if full_url == value:
                del url_map[key]
                return 204

        # No links were found matchin the full URL
        return jsonify({"message": "Did not found a link for the given URL", "url": full_url}), 201

@app.route('/<id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required
def shortened(id):
    # Check if shortened URL is available and redirect
    if request.method == 'GET':
        # Redirect
        if id in url_map:
            return redirect(url_map[id])

        # Error if not found
        return jsonify({"message": "Could not find a matching URL", "short_url": id}), 201

    # idem potent update of short url
    if request.method == 'PUT':
        full_url = request.form.get('url')

        if not full_url:
            return jsonify({"message": "Missing url parameter"}), 400

        # Couldn't find a link
        if id not in url_map:
            return jsonify({"message": "Could not find a matching URL for the provided short url", "short_url": id}), 404

        #  REGEX check for valid URL
        if not URL_RE.match(full_url):
            return jsonify({"message": "URL posted is not a valid URL", "url": full_url}), 400

        # If found update to new url value
        for key, value in url_map.items():
            if id == key:
                url_map[key] = full_url
                return jsonify({"message": "Udated URL link", "url": full_url, "short_url": key}), 200

    # Should delete a link between full URL/shortened URL
    if request.method == 'DELETE':
        # Couldn't find a link
        if id not in url_map:
            return jsonify({"message": "Could not find a matching URL for the provided shortened URL", "short_url": key}), 404

        # Check if a match is found, if so delete
        for key, value in url_map.items():
            if id == key:
                del url_map[key]
                return 204


if __name__ == '__main__':
    app.run(debug=DEBUG, port=int(PORT), host='0.0.0.0')