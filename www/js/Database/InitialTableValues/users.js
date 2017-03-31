
var users = [
    {
        ID: null,
        AmountOfGold: 5000,
        CurrentLevel: 1,
        OwnedPotions: [
            { Rank: 1, Class: "YellowPotion", Amount: 5 },
            { Rank: 2, Class: "YellowPotion", Amount: 0 },
            { Rank: 3, Class: "YellowPotion", Amount: 0 },
            { Rank: 1, Class: "GreenPotion", Amount: 5 },
            { Rank: 2, Class: "GreenPotion", Amount: 0 },
            { Rank: 3, Class: "GreenPotion", Amount: 0 },
			{ Rank: 1, Class: "RedPotion", Amount: 5 },
            { Rank: 2, Class: "RedPotion", Amount: 0 },
            { Rank: 3, Class: "RedPotion", Amount: 0 },
			{ Rank: 1, Class: "BluePotion", Amount: 5 },
            { Rank: 2, Class: "BluePotion", Amount: 0 },
            { Rank: 3, Class: "BluePotion", Amount: 0 }
        ],
        SolvedQuests: [
           /* { Name: "First small Quest" },
            { Name: "Mighty Quest" }*/
        ],
        FoundDiscoveries: [
		{
			Name: "Discovery of Touch",
			AvailabilityDate: (new Date).getTime() - 60000
		}
        ]
    }
];

