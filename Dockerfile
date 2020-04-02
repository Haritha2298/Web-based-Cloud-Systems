FROM python:3.5.9-slim-buster AS build-env

WORKDIR /app
COPY requirements.txt .
COPY src/rest_server.py .

RUN pip3 install --upgrade pip
RUN pip install -r ./requirements.txt

FROM gcr.io/distroless/python3
COPY --from=build-env /app /app
COPY --from=build-env /usr/local/lib/python3.5/site-packages /usr/local/lib/python3.5/site-packages

WORKDIR /app
ENV PYTHONPATH=/usr/local/lib/python3.5/site-packages

CMD ["rest_server.py"]