#!/usr/bin/env python

import os
import sys
import catson

port = int(os.getenv("PORT", "10000"))

def main(argv):
    app = catson.make_app()
    app.run("localhost", port, True)

if __name__ == "__main__":
    main(sys.argv)
