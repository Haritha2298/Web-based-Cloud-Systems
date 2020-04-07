import zeep

wsdl = 'http://localhost:8080/Calculator/soap/description'
client = zeep.Client(wsdl=wsdl)
print("Addition")
print(client.service.add(6.0,5.0))
print("Subtraction")
print(client.service.sub(6.0,5.0))
print("Multiplication")
print(client.service.mul(6.0,5.0))
print("Division")
print(client.service.div(6.0,5.0))
