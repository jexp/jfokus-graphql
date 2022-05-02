create index on :Speaker(fullName);
create index on :Presentation(title);


CALL apoc.load.json("https://jfokus.se/events/22/schedule/") 
yield value

// add speakers
FOREACH (row in value.speakers |
  MERGE (s:Speaker {id:row.id}) 
     ON CREATE SET s += row {.twitterHandle,.imageUrl,.fullName, .bio, .company }
  MERGE (c:Company {name:row.company}) MERGE (s)-[:WORKS_AT]->(c))

// add presentations
WITH *
UNWIND value.presentations as row
MERGE (p:Presentation {id:row.id})
ON CREATE SET p += row {.title, .type, .summary, .location,
                         start: datetime({epochSeconds:row.startTime}), 
                         end: datetime({epochSeconds:row.endTime})}

// connect them
FOREACH (speakerId IN row.speakers | 
         MERGE (s:Speaker {id:speakerId}) MERGE (s)-[:PRESENTS]->(p))

// rooms and types
MERGE (r:Room {id:row.location}) MERGE (p)-[:IN_ROOM]->(r)
MERGE (t:Type {name:row.type})   MERGE (p)-[:OF_TYPE]->(t);
