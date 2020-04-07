import random
import string
import os
import re

from flask import Flask, request, redirect, Response, jsonify
from markupsafe import escape

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

# Contains the key-value storage of links
url_map = {}

# Helper function to generate a random shortened url given size
def generate_short_url(url_length=6):
    characters = string.ascii_letters
    url = ''.join(random.SystemRandom().choice(characters) for _ in range(url_length))

    # If the generated pair already exists create a new one
    if url in url_map:
        return generate_short_url()

    return url

@app.route('/', methods=['GET', 'POST', 'DELETE'])
def full():
    # Should list all links
    if request.method == 'GET':
        return jsonify(url_map), 200

    # Should create a link between full URL/shortened URL
    if request.method == 'POST':
        full_url = request.form.get('url')

        #  REGEX check for valid URL
        if not URL_RE.match(full_url):
            return 'URL posted is not a valid URL', 400

        #  Check if an existing shortened URL was found and return it
        for key, value in url_map.items():
            if full_url == value:
                return 'Shortened URL already existed: {}'.format(escape(key), 201)

        # generate new short URL and save it in memory
        new_url = generate_short_url()
        url_map[new_url] = full_url

        return 'Shortened URL: {}'.format(escape(new_url), 201)

    # Should delete a link between full URL/shortened URL
    if request.method == 'DELETE':
        full_url = request.form.get('url')

        # Check if a match is found, if so delete
        for key, value in url_map.items():
            if full_url == value:
                del url_map[key]
                return 'Removed {} -> {} from memory'.format(key, value), 204

        # No links were found matchin the full URL
        return 'Did not found a link containing this URL', 404

@app.route('/<id>', methods=['GET', 'PUT', 'DELETE'])
def shortened(id):
    # Check if shortened URL is available and redirect
    if request.method == 'GET':
        # Redirect
        if id in url_map:
            return redirect(url_map[id])

        # Error if not found
        return 'Did not find URL link', 404

    # idem potent update of short url
    if request.method == 'PUT':
        full_url = request.form.get('url')

        # Couldn't find a link
        if id not in url_map:
            return 'Shortened URL not found', 404

        #  REGEX check for valid URL
        if not URL_RE.match(full_url):
            return 'URL posted is not a valid URL', 400

        # If found update to new url value
        for key, value in url_map.items():
            if id == key:
                url_map[key] = full_url
                return 'Updated link {} -> {} from memory'.format(key, value), 200

        return 'PUT REQUEST URL: {}'.format(escape(id))

    # Should delete a link between full URL/shortened URL
    if request.method == 'DELETE':
        # Check if a match is found, if so delete
        for key, value in url_map.items():
            if id == key:
                del url_map[key]
                return 'Removed {} -> {} from memory'.format(key, value), 204

        # No links were found matchin the full URL
        return 'Did not found a link containing this URL', 404

if __name__ == '__main__':
    app.run(debug=DEBUG, port=int(PORT), host='0.0.0.0')