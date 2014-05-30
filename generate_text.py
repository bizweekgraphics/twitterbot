import nltk
import re
import pprint
import sys


def generate_text(file_path, length):
  length = int(length)
  f = open(file_path, 'rU')
  raw = f.read()
  tokens = nltk.word_tokenize(raw)
  text = nltk.Text(tokens)
  generate_text = text.generate_return(length)
  sys.stdout.write(generate_text)



generate_text(sys.argv[1], sys.argv[2])

