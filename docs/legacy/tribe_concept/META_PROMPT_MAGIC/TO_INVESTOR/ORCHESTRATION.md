flowchart LR
    IDEA([Idea / Prototype])

    IDEA --> LS[Long Shadow Guild<br/>Product Shape & DoD]

    LS -->|Clear Value & Scope| GN[Guerilla Ninja Squad<br/>Investor-Visible Features]

    GN -->|Working Product Slice| BH[Black Hammer Guild<br/>Stability & CI]

    BH -->|Credibility Locked| AA[Alien Agronomists 🛸<br/>Productization & Signals]

    AA --> INVESTOR([Investor-Ready Product<br/>Trust + Traction Signals])

    %% Risk loops
    GN -. unclear value .-> LS
    BH -. fragile core .-> GN
    AA -. unfinished scope .-> GN
