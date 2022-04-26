MATCH (s:Speaker) WHERE exists { (s)-[:WORKS_AT]->(c) WHERE c.name contains 'AB' }
MATCH (s)-[:PRESENTS]->(p)-[:IN_ROOM]->(r),(p)-[:OF_TYPE]->(t)
CALL { with t MATCH (p2)-[:OF_TYPE]->(t) RETURN { count: count(*), title: collect(p2.title)[0..3] } as presentationsAggregate }
WITH s, collect(p { .title, inRoom: r.id, type: t.name, presentationsAggregate }) as presents
RETURN s {.fullName, .twitterHandle, worksAt: [(s)-[:WORKS_AT]->(c) | c.name], presents } as speakers

/*
query {
  speakers(where: { company_CONTAINS: "AB" }) {
    fullName
    twitterHandle
    worksAt {
      name
    }
    presents {
      title
      inRoom {
        id
      }
	    parallel { title }
      type {
        name
        presentationsAggregate {
          count
        }
        presentations(options: { limit: 3 }) {
          title
        }
      }
    }
  }
}
*/
