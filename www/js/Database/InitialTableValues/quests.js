var quests = [
     {
        ID: null,
        Name: "First small Quest",
        Description: "Your first small quest",
        Rewardmoney: 300,
        Type: "small",
        RewardPotions: [
            { Class: "GreenPotion", Rank: 3, RewardAmount: 2 }],
        RequiredPotions: [
            { Class: "GreenPotion", Rank: 2, AmountNeeded: 2 }],
        Discoveries: []
    },
    {
        ID: null,
        Name: "First big Quest",
        Description: "Your first big quest",
        Rewardmoney: 1000,
        Type: "big",
        RewardPotions: [
            { Class: "GreenPotion", Rank: 3, RewardAmount: 3 }
        ],
        RequiredPotions: [
            { Class: "GreenPotion", Rank: 2, AmountNeeded: 2 }
        ],
        Discoveries: [
            { Name: "Discovery of Touch" }
        ]
    },
    {
        ID: null,
        Name: "Mighty Quest",
        Description: "A mighty quest",
        Rewardmoney: 1500,
        Type: "big",
        RewardPotions: [
            { Class: "GreenPotion", Rank: 3, RewardAmount: 4 },
            { Class: "YellowPotion", Rank: 3, RewardAmount: 4 }
        ],
        RequiredPotions: [
            { Class: "YellowPotion", Rank: 2, AmountNeeded: 2 },
            { Class: "GreenPotion", Rank: 2, AmountNeeded: 2 }
        ],
        Discoveries: [
            { Name: "Discovery of Day" }
        ]
    },
    {
        ID: null,
        Name: "Second small Quest",
        Description: "For this you need to upgrade",
        Rewardmoney: 1000,
        Type: "small",
        RewardPotions: [
            { Class: "YellowPotion", Rank: 3, RewardAmount: 1 }],
        RequiredPotions: [
            { Class: "YellowPotion", Rank: 2, AmountNeeded: 2 }],
        Discoveries: []
    }
];