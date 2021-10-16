import glob

files = glob.glob('*.txt')

with open('result.txt', 'wb') as outfile:
    for f in files:
        with open(f, 'rb') as infile:
            outfile.write(infile.read() + b'\r\n')