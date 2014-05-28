require 'uri'

def extractLink(string)
  URI.extract(string, ['http', 'https'])
end