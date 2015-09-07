myApp.factory('dataStructures', function () {
    
    this.user = function user(ID, AmountOfGold, CurrentLevel, OwnedPotions, SolvedQuests) {
        this.ID = ID;
        this.AmountOfGold = AmountOfGold;
        this.CurrentLevel = CurrentLevel;
        this.OwnedPotions = OwnedPotions;
        this.SolvedQuests = SolvedQuests;
    }
});