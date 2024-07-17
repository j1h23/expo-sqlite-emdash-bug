# Expo-sqlite iOS bug when inserting values that contains "–" (Em-Dash)

In iOS, when running an insert statement in expo sqlite, whose value includes "–" (Em-Dash), the insert statement will fail. The expected behavior is that this insert statement should work. This does not seem to be an error when running on Android. The error message is "Calling the 'prepareAsync' function has failed."

An odd behavior I observed is that if I add a line break at the end of the insert statement, I am able to run the insert statement successfully.

## Log Output

 LOG  --------- start ---------
 LOG  --------- test1 ---------
 LOG  test1 (expected to succeed): band aid fix for emdash issue by adding line break at the end of query
 LOG  success w line break query: insert into "testEmDash" ("id", "testText") VALUES ('emDash w/ line break', '–');
 LOG  --------- test2 ---------
 LOG  test2 (expected to fail): run insert statement that contains em dash
 LOG  error w/o line break: Error: Calling the 'prepareAsync' function has failed
→ Caused by: Error code 1: incomplete input
 LOG  error w/o line break query: insert into "testEmDash" ("id", "testText") VALUES ('emDash w/o line break', '–');
 LOG  --------- saved entries ---------
 LOG  saved entries: [{"id": "emDash w/ line break", "testText": "–"}]
 LOG  --------- end ---------