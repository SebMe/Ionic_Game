
var fillPotionTable = function ($cordovaSQLite) {
    var query = 'INSERT INTO Potion_Table (RangRangeStart, RangRangeEnd, Name, Description, Price, Class, ImageFilename) VALUES (?, ?, ?, ?, ?, ?, ?)';
    $cordovaSQLite.execute(db, query, [1, 4, "Yellow Potion", "It's yellow", 100, "YellowPotion", "YellowPotion.png"]);
    $cordovaSQLite.execute(db, query, [1, 4, "Green Potion", "It's green", 100, "GreenPotion", "GreenPotion.png"]);

    $cordovaSQLite.execute(db, query, [5, 9, "Greater Yellow Potion", "It's yellow", 500, "YellowPotion", "GreaterYellowPotion.png"]);
    $cordovaSQLite.execute(db, query, [5, 9, "Greater Green Potion", "It's green", 500, "GreenPotion", "GreaterGreenPotion.png"]);

    $cordovaSQLite.execute(db, query, [10, 10, "Perfect Yellow Potion", "It's yellow", 1000, "YellowPotion", "PerfectYellowPotion.png"]);
    $cordovaSQLite.execute(db, query, [10, 10, "Perfect Green Potion", "It's green", 1000, "GreenPotion", "PerfectGreenPotion.png"]);
};


var fillUserTable = function ($cordovaSQLite) {
    var query = "INSERT INTO User_Table (AmountOfGold, CurrentLevel) VALUES (?, ?)";
    $cordovaSQLite.execute(db, query, [3000, 1]);
};


var fillUserpotionTable = function ($cordovaSQLite) {
    var query = "INSERT INTO Userpotion_Table (user_tableID, potion_tableID, Amount) VALUES (?, ?, ?)";
    $cordovaSQLite.execute(db, query, [1, 1, 5]);
    $cordovaSQLite.execute(db, query, [1, 2, 5]);
    $cordovaSQLite.execute(db, query, [1, 3, 3]);
    $cordovaSQLite.execute(db, query, [1, 4, 3]);
    $cordovaSQLite.execute(db, query, [1, 5, 2]);
    $cordovaSQLite.execute(db, query, [1, 6, 2]);
};


var fillDiscoveryTable = function ($cordovaSQLite) {
    var query = "INSERT INTO Discovery_Table (FunctionName) VALUES (?)";
    $cordovaSQLite.execute(db, query, ["DiscoveryOfDay()"]);
};


var fillQuestTable = function ($cordovaSQLite) {
    var query = "INSERT INTO Quest_Table (Name, Description, RewardMoney, Type, potion_tableid) VALUES (?, ?, ?, ?, ?)";
    $cordovaSQLite.execute(db, query, ["First small Quest", "Your first small quest", 300, "small", null]);
    $cordovaSQLite.execute(db, query, ["First Big Quest", "Your first big quest", 1000, "big", 3]);
    $cordovaSQLite.execute(db, query, ["Mighty Quest", "A mighty quest", 1500, "big", 5]);
};


var fillSolvedQuestsTable = function ($cordovaSQLite) {
    var query = "INSERT INTO SolvedQuests_Table (user_tableID, quest_tableID) VALUES (?, ?)";
    $cordovaSQLite.execute(db, query, [1, 3]);
};


var fillRequiredQuestDiscoveryTable = function ($cordovaSQLite) {
    var query = "INSERT INTO RequiredQuestDiscovery_Table (quest_tableID, discovery_tableID) VALUES (?, ?)";
    $cordovaSQLite.execute(db, query, [2, 1]);
};


var fillRequiredQuestPotionTable = function ($cordovaSQLite) {
    var query = "INSERT INTO RequiredQuestPotion_Table (quest_tableID, potion_tableID, AmountNeeded) VALUES (?, ?, ?)";
    $cordovaSQLite.execute(db, query, [2, 4, 2]);
};