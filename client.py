import zeep

wsdl = 'http://localhost:8080/Calculator/soap/description'
client = zeep.Client(wsdl=wsdl)
print(client.service.add(6.0,5.0))
print(client.service.sub(6.0,5.0))
print(client.service.mul(6.0,5.0))
print(client.service.div(6.0,5.0))
