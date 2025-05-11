# API Requests Schema

## database

### database/create

{ 
"name": "Harry Potter and the Goblet of Fire",
"pageCount": 636
}

### database/search

{ 
"searchedTerm": "potter"
}

## dashboard

### dashboard/create

{ 
"bookID": "66dfa8c2-ded9-40dd-8e25-2dbb76cf947e",
"section": "planToRead",
"currentPage": 0,
"rating": 0
}

### dashboard/get

{ 
"section": "reading"
}

### dashboard/remove

{ 
"id": "fbe7c78d-f2fb-4258-8f28-e5246f55e849"
}

### dashboard/update

{ 
"id": "115617e0-4ab0-4237-b184-421c24fa5fca",	
"section": "reading",
"currentPage": 15,
"rating": 0
}