class PokemonGlobalMetadata; end
class PokemonEncounters; def encounter_triggered?(*); :original; end; end
module EventHandlers; def self.add(*); end; end
load File.expand_path('../TGOM_Manager_Mode.rb', __dir__)
$PokemonGlobal = PokemonGlobalMetadata.new
def assert(v, m); raise m unless v; end
assert(TGOMManager.state[:scout_tokens] == 0, 'old-save lazy state')
assert(TGOMManager.claim_token('rank_2'), 'first token')
assert(!TGOMManager.claim_token('rank_2'), 'token idempotence')
assert(TGOMManager.state[:scout_tokens] == 1, 'token count')
TGOMManager.blacklist(:CHARMANDER)
100.times { assert(!TGOMManager.scout_candidates([[:CHARMANDER, 99], [:GROWLITHE, 1]]).include?(:CHARMANDER), 'blacklist') }
assert(TGOMManager.scout_candidates([[:A,1],[:B,1],[:C,1]], 3, Random.new(1)).uniq.length == 3, 'unique report')
assert(TGOMManager.delegated_money(12, 30) == 360, 'money formula')
assert(TGOMManager.delegated_money(25, 60) == 1500, 'money formula 2')
assert(PokemonEncounters.new.encounter_triggered?(:Land, false, true) == false, 'step encounter')
assert(PokemonEncounters.new.encounter_triggered?(:Land, false, false) == :original, 'explicit encounter path')
puts '12 assertions passed'
