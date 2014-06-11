import sys
import os.path
import aiml
import re

k = aiml.Kernel()

def load_brain():
  files = os.listdir('./aiml/')
  for aiml in files:
    if aiml != "._DS_Store":
      k.learn('./aiml/' + aiml)
  k.saveBrain('alice.brn')


def generate_alice_text(query):
  k.loadBrain('alice.brn')
  response = k.respond(query)
  sys.stdout.write(response)



generate_alice_text(sys.argv[1])




