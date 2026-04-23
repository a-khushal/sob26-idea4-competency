#!/usr/bin/env python3
import sys, json

data = json.loads(sys.stdin.read())
text = data.get("text", "")
print(json.dumps({"result": text[::-1], "length": len(text)}))
