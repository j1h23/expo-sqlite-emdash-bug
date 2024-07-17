import { Image, StyleSheet, Platform } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import * as SQLite from "expo-sqlite";

async function test() {
  console.log('--------- start ---------');

  const DBConnector = await SQLite.openDatabaseAsync(`testEmDashIssue.db`);

  const createTable: string = `CREATE TABLE IF NOT EXISTS testEmDash (
    "id" TEXT NOT NULL UNIQUE ON CONFLICT REPLACE,
    "testText" TEXT,
    PRIMARY KEY("id") ON CONFLICT REPLACE
  );`;
  await DBConnector.execAsync(createTable);
  // clear out testEmDash table each time
  await DBConnector.runAsync("DELETE FROM testEmDash;");

  console.log('--------- test1 ---------');

  // test 1 will succeed (band aid fix)
  console.log('test1 (expected to succeed): band aid fix for emdash issue by adding line break at the end of query');
  const emDashWorkingInsert: string = `insert into "testEmDash" ("id", "testText") VALUES ('emDash w/ line break', '–');
  `; // works when we add a line break at the end of a query that has emDash
  try {
    await DBConnector.runAsync(emDashWorkingInsert);
    console.log(`success w line break query: ${emDashWorkingInsert}`);
  } catch (error) {
    console.log(`error w line break: ${error}`);
    console.log(`error w line break query: ${emDashWorkingInsert}`);
  }

  console.log('--------- test2 ---------');

  // test 2 will fail can not save:
  console.log('test2 (expected to fail): run insert statement that contains em dash');
  const emDashInsert: string = `insert into "testEmDash" ("id", "testText") VALUES ('emDash w/o line break', '–');`;
  try {
    await DBConnector.runAsync(emDashInsert);
    console.log(`success w/o line break query: ${emDashWorkingInsert}`);
  } catch (error) {
    console.log(`error w/o line break: ${error}`);
    console.log(`error w/o line break query: ${emDashInsert}`);
  }

  console.log('--------- saved entries ---------');

  const entries = await DBConnector?.getAllAsync("select * from testEmDash");
  console.log("saved entries:", entries);

  console.log('--------- end ---------');
  console.log();
  console.log();
}

export default function HomeScreen() {
  test();
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          ource={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">EmDash Sqlite Bug Report:</ThemedText>
      </ThemedView>
      <ThemedView>
        <ThemedText>Please see console log output.</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});