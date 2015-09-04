// Always delete the old database (per hand from the folder) or create a new one.
// A new DB is created by changing from existing myapp6 openDB(myapp6.db) to openDB(myapp7.db).
// If you make changes to the tables the changes are otherwise ignored, since the table already exists.

var createTables = function($cordovaSQLite){
    $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS Potion_Table6(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
    /*
    $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS Potion_Table(id INTEGER PRIMARY KEY AUTOINCREMENT, RangRangeStart INTEGER, RangRangeEnd INTEGER, name TEXT, Description TEXT, Price INTEGER, Class TEXT, ImageFilename TEXT)');
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS User_Table(id INTEGER PRIMARY KEY AUTOINCREMENT, AmountOfGold INTEGER, CurrentLevel INTEGER)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Userpotion_Table(user_tableID INTEGER, potion_tableID INTEGER, Amount INTEGER)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Discovery_Tableid INTEGER PRIMARY KEY AUTOINCREMENT, FunctionName TEXT)");
    $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS Quest_Table(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, Description TEXT, Rewardmoney INTEGER, Type TEXT, potion_tableID INTEGER)');
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS SolvedQuests_Table(user_tableID INTEGER, quest_tableID INTEGER)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS RequiredQuestDiscovery_Table(quest_tableID INTEGER, discovery_tableID INTEGER)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS RequiredQuestPotion_Table(quest_tableID INTEGER, potion_tableID INTEGER, AmountNeeded INTEGER)");
    */
}