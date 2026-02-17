// Comprehensive QLD suburb list: Brisbane → Sunshine Coast → Bundaberg → Gladstone → Rockhampton → Mackay → Townsville → Cairns
// Sorted alphabetically for binary search / fast filtering
export const QLD_SUBURBS: string[] = [
  // Brisbane & surrounds
  'Albion', 'Albany Creek', 'Algester', 'Annerley', 'Ascot', 'Ashgrove', 'Aspley',
  'Bald Hills', 'Banyo', 'Bardon', 'Bellbowrie', 'Boondall', 'Bracken Ridge', 'Brendale',
  'Brighton', 'Brisbane CBD', 'Brookside', 'Bulimba', 'Burpengary',
  'Caboolture', 'Calamvale', 'Camp Hill', 'Cannon Hill', 'Carina', 'Carindale',
  'Carseldine', 'Chermside', 'Clayfield', 'Clontarf', 'Colmslie', 'Coopers Plains',
  'Coorparoo', 'Corinda',
  'Dakabin', 'Deception Bay', 'Doolandella', 'Drewvale', 'Durack',
  'Eagle Farm', 'Eight Mile Plains', 'Everton Park',
  'Ferny Grove', 'Ferny Hills', 'Fig Tree Pocket', 'Fitzgibbon', 'Fortitude Valley',
  'Gaythorne', 'Geebung', 'Gordon Park', 'Graceville', 'Griffin', 'Grovely',
  'Hamilton', 'Hawthorne', 'Hendra', 'Holland Park',
  'Indooroopilly',
  'Jindalee',
  'Kallangur', 'Kedron', 'Kelvin Grove', 'Kenmore', 'Keperra', 'Kippa-Ring',
  'Lawnton', 'Lutwyche',
  'Manly', 'Margate', 'McDowall', 'Mitchelton', 'Moorooka', 'Morayfield',
  'Morningside', 'Mt Gravatt', 'Mt Ommaney', 'Murrumba Downs',
  'Narangba', 'Nundah',
  'Oxley',
  'Paddington', 'Petrie', 'Pine Rivers',
  'Red Hill', 'Redcliffe', 'Redland Bay', 'Richlands', 'Rochedale', 'Rocklea', 'Rothwell',
  'Sandgate', 'Scarborough', 'Sherwood', 'South Brisbane', 'Spring Hill',
  'Stafford', 'Strathpine', 'Sunnybank', 'Sunnybank Hills',
  'Taringa', 'Taigum', 'The Gap', 'Toowong',
  'Upper Mt Gravatt',
  'Virginia',
  'Wakerley', 'Warner', 'Wavell Heights', 'West End', 'Wilston', 'Windsor',
  'Woody Point', 'Woolloongabba', 'Wynnum',
  'Zillmere',

  // North Lakes / Moreton Bay
  'Burpengary East', 'Caboolture South', 'Deception Bay', 'Elimbah',
  'Mango Hill', 'North Lakes',

  // Bribie Island
  'Bellara', 'Bongaree', 'Bribie Island', 'Woorim',

  // Sunshine Coast — South
  'Aroona', 'Battery Hill', 'Beerwah', 'Bells Creek', 'Caloundra', 'Caloundra West',
  'Currimundi', 'Dicky Beach', 'Glass House Mountains', 'Golden Beach',
  'Kings Beach', 'Landsborough', 'Little Mountain', 'Meridan Plains',
  'Moffat Beach', 'Pelican Waters', 'Shelly Beach', 'Wurtulla',

  // Sunshine Coast — Central
  'Alexandra Headland', 'Bli Bli', 'Buddina', 'Buderim',
  'Cotton Tree', 'Forest Glen', 'Kawana', 'Kuluin',
  'Maroochydore', 'Minyama', 'Mooloolaba',
  'Mountain Creek', 'Pacific Paradise', 'Palmview',
  'Parrearra', 'Point Arkwright', 'Sippy Downs',
  'Sunshine Plaza', 'Twin Waters', 'Warana',

  // Sunshine Coast — North
  'Coolum', 'Coolum Beach', 'Doonan', 'Eumundi',
  'Marcus Beach', 'Marcoola', 'Mount Coolum', 'Mudjimba',
  'Nambour', 'Palmwoods', 'Peregian', 'Peregian Beach', 'Peregian Springs',
  'Weyba Downs', 'Yandina',

  // Noosa
  'Noosa', 'Noosa Heads', 'Noosa Junction', 'Noosaville',
  'Sunrise Beach', 'Sunshine Beach', 'Tewantin',

  // Hinterland
  'Eudlo', 'Flaxton', 'Kenilworth', 'Maleny', 'Mapleton', 'Montville', 'Pomona', 'Woombye',

  // Gympie region
  'Cooloola Cove', 'Gympie', 'Rainbow Beach', 'Tin Can Bay',

  // Wide Bay / Hervey Bay / Bundaberg
  'Bargara', 'Bundaberg', 'Bundaberg Central', 'Bundaberg East', 'Bundaberg North',
  'Bundaberg South', 'Burnett Heads', 'Childers',
  'Eli Waters', 'Hervey Bay', 'Howard',
  'Maryborough', 'Mon Repos',
  'Pialba', 'Point Vernon', 'Scarness', 'Torquay', 'Urangan', 'Urraween',

  // Gladstone region
  'Agnes Water', 'Boyne Island', 'Calliope', 'Gladstone', 'Tannum Sands', 'Town of 1770',

  // Rockhampton region
  'Berserker', 'Emu Park', 'Frenchville', 'Gracemere',
  'North Rockhampton', 'Park Avenue', 'Rockhampton',
  'The Range', 'Wandal', 'Yeppoon',

  // Mackay region
  'Andergrove', 'Blacks Beach', 'Bucasia', 'Cannonvale',
  'Eimeo', 'Mackay', 'Mount Pleasant',
  'North Mackay', 'Sarina', 'South Mackay', 'West Mackay',

  // Airlie Beach / Whitsundays
  'Airlie Beach', 'Cannonvale', 'Proserpine', 'Shute Harbour',

  // Bowen / Ayr
  'Ayr', 'Bowen', 'Home Hill',

  // Townsville region
  'Aitkenvale', 'Annandale', 'Belgian Gardens', 'Castle Hill',
  'Cranbrook', 'Douglas', 'Garbutt', 'Hyde Park',
  'Idalia', 'Kelso', 'Kirwan', 'Mundingburra',
  'North Ward', 'Oonoonba', 'Pimlico', 'Railway Estate',
  'South Townsville', 'Townsville', 'Townsville City',
  'Vincent', 'West End', 'Wulguru',

  // Magnetic Island
  'Arcadia', 'Horseshoe Bay', 'Magnetic Island', 'Nelly Bay', 'Picnic Bay',

  // Ingham / Cardwell
  'Cardwell', 'Ingham', 'Tully',

  // Mission Beach / Innisfail
  'Innisfail', 'Mission Beach', 'South Mission Beach',

  // Cairns region
  'Bayview Heights', 'Bentley Park', 'Brinsmead', 'Bungalow',
  'Cairns', 'Cairns City', 'Cairns North',
  'Clifton Beach', 'Edge Hill', 'Edmonton',
  'Earlville', 'Freshwater', 'Gordonvale',
  'Holloways Beach', 'Kanimbla', 'Kewarra Beach',
  'Machans Beach', 'Manunda', 'Manoora',
  'Mooroobool', 'Palm Cove',
  'Parramatta Park', 'Port Douglas',
  'Redlynch', 'Smithfield', 'Stratford',
  'Trinity Beach', 'Trinity Park',
  'Westcourt', 'White Rock', 'Whitfield', 'Woree', 'Yorkeys Knob',

  // Atherton Tablelands
  'Atherton', 'Kuranda', 'Mareeba', 'Ravenshoe', 'Yungaburra',
].sort()

// Deduplicated and sorted
const uniqueSet = new Set(QLD_SUBURBS)
export const SUBURBS = Array.from(uniqueSet).sort()
