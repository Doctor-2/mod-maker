# TGOM Manager Mode v0.1 engineering report

## Input identity
The uploaded `gym.zip` active `Data/PluginScripts.rxdata` and root `PluginScripts.before_companion.rxdata` are byte-identical. SHA-256: `9704aab5b907f1d8bdcfc1b1c38a3e7c81c0bb829f77f6f1a8bfb6833ddead44`. It contains eight plugins and no Companion Logger code. `TGOM_Companion_Log.txt` is an output log, not injectable logger source.

## Implemented safe subset
- Save state: one lazy `@tgom_manager_state` hash on `PokemonGlobalMetadata`; it never rewrites existing switches, variables, self-switches, map, position, party, or save.
- Random encounters: returns false only from `PokemonEncounters#encounter_triggered?` when `triggered_by_step` is true. It does not patch `pbWildBattle` or `WildBattle.start`; explicit/non-step calls delegate unchanged.
- Classification: all 59 maps are `PRESERVE`; both routine and travel allowlists are empty. This intentionally means no potentially unsafe trainer, reward, or location is automated.
- Money helper: validated `max opponent level * trainer type base_money`; battle-only multipliers are not accepted by the API. No trainer is currently delegated.
- Scouting helper: accepts only an audited pool supplied by a caller, filters a persistent species blacklist, respects weights, and returns unique species. There is no menu or guessed availability pool, so Charmander cannot be generated.

## Cave regression fixture
Map004 source inspection finds ten two-page riddle events. Each successful branch operates variable 37 and self-switch A. Its item and transfers remain original. Maps003–006 are not present in any manager allowlist and Manager initialization contains no map/event mutation. The original Lillith/Ken commands are therefore untouched. These claims are source/Marshal inspection, not an executable game-engine playthrough.

## Deliberately blocked
Region clearing, Pokegear UI, training, fast travel, automatic shift/rank/region/emergency token hooks are disabled. The supplied data has no logger source, no live save, and no executable game runtime. Enabling those systems without complete page-level semantics and end-to-end engine tests would violate the required false-positive safety rule.

## Verification scope
Ruby syntax, helper behavior, Marshal injection/round-trip, plugin preservation, hashes, and map inventory are executable checks. Cave event behavior and scripted battle preservation are source-inspected. No claim is made that an actual saved game was loaded or battles were played.
