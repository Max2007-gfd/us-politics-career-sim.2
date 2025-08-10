# Data Formats

All sample data is validated by Zod at runtime and via `pnpm validate-data`.

## Actor
```ts
type Actor = {
  id: string;               // "actor:party-chair"
  name: string;             // "County Party Chair"
  kind: "person" | "org";
  faction: "labor" | "business" | "activists" | "moderates" | "media";
  leverage: number;         // 0..100 — their power
  disposition: number;      // -100..100 — towards player
  asks: string[];           // things they want (policy/appointments/process)
};
```

## Institution
```ts
type Institution = {
  id: string; name: string;
  type: "council" | "committee" | "agency";
  rules: { majority: number; seats?: number };
};
```

## Issue
```ts
type Issue = {
  id: string;
  name: string;
  instruments: ("tax"|"regulation"|"subsidy"|"zoning"|"program")[];
  cost: number;           // 1..5
  controversy: number;    // 1..5
  expertiseNeeded: number;// 0..100
};
```

## District
```ts
type District = {
  id: string;
  name: string;
  lean: number;         // -5..+5 (D+ / R+)
  priorities: string[]; // e.g., ["housing","jobs","safety"]
};
```

## Event
```ts
type Event = {
  id: string;
  name: string;
  type: "vacancy" | "appointment" | "crisis";
  requirement?: string; // simple string tag
};
```
