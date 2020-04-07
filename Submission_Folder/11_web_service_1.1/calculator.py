from ladon.ladonizer import ladonize

class Calculator(object):

        @ladonize(float,float,rtype=float)
        def add(self,a,b):
                return a+b
        @ladonize(float,float,rtype=float)
        def sub(self,a,b):
                return a-b
        @ladonize(float,float,rtype=float)
        def mul(self,a,b):
                return a*b
        @ladonize(float,float,rtype=float)
        def div(self,a,b):
                return a/b


