import requests
import math
import googlemaps
import json

_DEV = True

cfgName = "config.dev.json"

if _DEV:
  cfgName = "config.dev.json"


with open(cfgName, "r", encoding="utf-8") as cfgFile:
  cfgData = json.loads(cfgFile.read())

gApiKey = cfgData["gApiKey"]


r = requests.get("https://www.zabka.pl/app/uploads/locator-store-data.json", timeout=30)

if(r.status_code != 200):
  print("Error fetching data")
  exit()

data = r.json()


class GPSCoord:
  lat = 0
  lng = 0
  idx = "n/a"

  def __init__(self, lat, lng, idx = "None"):
    self.idx = idx
    self.lat = lat
    self.lng = lng

  @classmethod
  def fromJson(self, jsonData):
    return GPSCoord(jsonData["lat"], jsonData["lon"], jsonData["storeId"])

  def dist(self, other):
    R = 6371e3

    latA = math.radians(self.lat)
    lngA = math.radians(self.lng)

    latB = math.radians(other.lat)
    lngB = math.radians(other.lng)

    dLat = math.radians(other.lat - self.lat)
    dLng = math.radians(other.lng - self.lng)

    a = math.sin(dLat/2)**2 + math.cos(latA)*math.cos(latB) * math.sin(dLng/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    d = R * c
     
    return d

  def __repr__(self) -> str:
    return f"{self.idx} - {self.lat}, {self.lng}"

coordsList = {}


for d in data:
  coordsList[d["storeId"]] = GPSCoord.fromJson(d)

coordsList = list(coordsList.values())

smallest = []

poznanList = list()

cityPoznanPos = GPSCoord(52.40797858833119, 16.91960112538376, "Poznan")

for curI in range(0, len(coordsList)):
  cur = coordsList[curI]
  if(cityPoznanPos.dist(cur) <= 18.5e3):
    poznanList.append(cur)


for curI in range(0, len(poznanList)):
  cur = poznanList[curI]
  print(curI)
  for otherI in range(curI + 1, len(poznanList)):
    other = poznanList[otherI]
    dist = cur.dist(other)
    if(dist <= 100):
      smallest.append({"A": cur, "B": other, "dist": dist})

gmaps = googlemaps.Client(key=gApiKey)

def getAddr(geoCode):
  address = geoCode[0]["address_components"]

  subP = None
  number = None
  street = None
  city = None
  postal = None

  for component in address:
    if "street_number" in component["types"] and number is None:
      number = component["long_name"]
    
    if "subpremise" in component["types"] and subP is None:
      subP = component["long_name"]

    if "route" in component["types"] and street is None:
      street = component["long_name"]

    if "postal_code" in component["types"] and postal is None:
      postal = component["long_name"]

    if "locality" in component["types"] and city is None:
      city = component["long_name"]

  if subP is None:
    return f"{street} {number}, {postal} {city}"
  return f"{street} {number}/{subP}, {postal} {city}"
      

def getHood(geoCode):
  neighborhood = None

  try:
    neigh = geoCode[1]
    for component in neigh["address_components"]:
      if "neighborhood" in component["types"]:
        neighborhood = component["long_name"]
        break

      if "sublocality_level_1" in component["types"]:
        neighborhood = component["long_name"]
        break

    if neighborhood is None:
      for component in adr["address_components"]:
        if "sublocality_level_1" in component["types"] and neighborhood is None:
          neighborhood = component["long_name"]
          break
  except:
    try:
      adr = geoCode[0]
      if neighborhood is None:
        for component in adr["address_components"]:
          if "locality" in component["types"] and neighborhood is None:
            neighborhood = component["long_name"]
            break
    except:
      pass
  return neighborhood

for sm in smallest:
  latA = sm["A"].lat
  lngA = sm["A"].lng

  latB = sm["B"].lat
  lngB = sm["B"].lng

  geoA = gmaps.reverse_geocode((latA, lngA), result_type=["street_address", "neighborhood"], language="Polish")
  geoB = gmaps.reverse_geocode((latB, lngB), result_type=["street_address", "neighborhood"], language="Polish")



  adrA = "N/A"
  adrB = "N/A"

  neighA = getHood(geoA)
  neighB = getHood(geoB)

  neigh = None

  if neighA is None:
    if neighB is None:
      neigh = "Nieznana dzielnica"
    else:
      neigh = neighB
  else:
    neigh = neighA

  adrA = getAddr(geoA)
  adrB = getAddr(geoB)

  print(neigh)
  print(f"  {adrA}")
  print(f"  {adrB}\n\n")

