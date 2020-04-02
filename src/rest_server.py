import random
import string
import os
import re

from flask import Flask, request, redirect, Response, jsonify
from markupsafe import escape

URL_RE = re.compile('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$')

DEBUG = True
PORT = 5000

if os.environ.get('FLASK_PORT') is not None:
    PORT = int(os.environ.get('FLASK_PORT'))

if os.environ.get('FLASK_ENV') is not None and os.environ.get('FLAS_ENV') == 'PROD':
    DEBUG = False

app = Flask(__name__)


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
        long_url = request.form.get('url')

        #  REGEX check for valid URL
        if not URL_RE.match(long_url):
            return 'URL posted is not a valid URL', 400

        # generate new short URL and save it in memory
        new_url = generate_short_url()
        url_map[new_url] = long_url

        return 'Shortened URL: {}'.format(escape(new_url))

    # Should delete a link between full URL/shortened URL
    if request.method == 'DELETE':
        return 'Removed URL LINK', 204

@app.route('/<id>', methods=['GET', 'PUT', 'DELETE'])
def shortened(id):
    # Check if shortened URL is available and redirect
    if request.method == 'GET':
        # Redirect
        if id in url_map:
            return redirect(url_map[id])

        # Error if not found
        return 'Did not find URL link', 404

    # Should delete a link between full URL/shortened URL
    if request.method == 'PUT':
        new_url = generate_short_url()
        return 'Shortened URL: {}'.format(escape(new_url))

    # Should delete a link between full URL/shortened URL
    if request.method == 'DELETE':
        return 'Shortened URL: {}'.format(escape(id))


if __name__ == '__main__':
    app.run(debug=DEBUG, port=int(PORT))