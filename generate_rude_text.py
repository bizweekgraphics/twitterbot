import nltk
import re
import pprint
import sys

from nltk.util import *

def generate_rude_text(query):
  response = nltk.chat.rude.rude_chatbot.respond(query)
  sys.stdout.write(response)


generate_rude_text(sys.argv[1])