import pymongo
from pymongo import MongoClient
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--lang", default="eng", type=str, help="Language to use.") # can be eng, ces, deu
parser.add_argument("--ignore_lang", default=False, action="store_true", help="Process roles instead.")
parser.add_argument("--case", default="roles", type=str, help="Roles or veclass entries, synsemclass_main file.") # can be roles or veclass

args = parser.parse_args()

client = pymongo.MongoClient("mongodb://localhost:27017/synsemclass")
db = client.synsemclass

collection = None

if args.ignore_lang:
    if args.case == "roles":
        collection = db.roles
    if args.case == "veclass":
        collection = db.veclass_roles

if not args.ignore_lang:
    if args.lang == "eng":
        collection = db.englishlangmembers
    if args.lang == "ces":
        collection = db.czechlangmembers
    if args.lang == "deu":
        collection = db.germanlangmembers

print("Creating index...")
collection.create_index([("@id", pymongo.ASCENDING), ("classmembers.classmember.@status", pymongo.ASCENDING)])

client.close()

print("> done.")
