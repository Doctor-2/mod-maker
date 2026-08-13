class PokemonGlobalMetadata; end
class PokemonEncounters; def encounter_triggered?(*); :original; end; end
module EventHandlers; def self.add(*); end; end
require 'json'
load File.expand_path('../TGOM_Manager_Mode.rb', __dir__)

def assert(value, message); raise message unless value; $assertions += 1; end
$assertions = 0
$PokemonGlobal = PokemonGlobalMetadata.new
$game_variables = Array.new(100, 0)
$game_self_switches = {}

module GameData
  class Trainer
    def self.get(*); new; end
    def pokemon; [{:level => 12}, {:level => 18}]; end
  end
  class TrainerType
    Data = Struct.new(:base_money)
    def self.get(*); Data.new(30); end
  end
end
PlayerStub = Struct.new(:money, :party)
$player = PlayerStub.new(0, [])

assert(TGOMManager.state[:scout_tokens] == 0, 'lazy state')
assert(TGOMManager.claim_token('rank_2'), 'first token')
assert(!TGOMManager.claim_token('rank_2'), 'idempotent token')
assert(TGOMManager.state[:scout_tokens] == 1, 'token count')
$game_variables[29] = 250
TGOMManager.sync_token_hooks
assert(TGOMManager.state[:scout_tokens] == 3, 'reputation hooks')
TGOMManager.blacklist(:CHARMANDER)
pool = [[:CHARMANDER, 99], [:A, 1], [:B, 1], [:C, 1], [:D, 1]]
100.times { assert(!TGOMManager.scout_candidates(pool, 3, Random.new(2)).include?(:CHARMANDER), 'blacklist') }
three = TGOMManager.scout_candidates(pool, 3, Random.new(1))
assert(three.length == 3 && three.uniq.length == 3, 'three unique candidates')
TGOMManager.state[:recent_scouts] = [:A, :B]
assert((TGOMManager.scout_candidates(pool) & [:A, :B]).empty?, 'recent repeat control')
assert(TGOMManager.scout_candidates([[:CHARMANDER, 1]]).empty?, 'protected gift species suppressed')
assert(TGOMManager::SAFE_ROUTINE.keys == [3, 7, 8, 10, 21], 'explicit routine maps')
assert(TGOMManager.delegated_money(:LASS, "Ellen", 0) == 540, 'exact prize formula')
assert(TGOMManager.opponent_central_level(3) == 15, 'dynamic opponent average')
result = TGOMManager.clear_region(3)
assert(result == {:battles => 3, :money => 1620, :reputation => 35}, 'one active page per routine trainer')
assert($player.money == 1620 && $game_variables[29] == 285, 'delegated rewards applied')
assert(TGOMManager.clear_region(3)[:battles] == 3, 'rematch pages remain independently eligible')
assert(TGOMManager.clear_region(3)[:battles] == 0, 'delegation is permanently idempotent')
assert((TGOMManager::SAFE_ROUTINE.keys & TGOMManager::PROTECTED_MAPS).empty?, 'cave protected')
assert(TGOMManager.clear_region(4)[:battles] == 0, 'protected map clear no-op')
assert(TGOMManager.region_maps(8) == [7, 8, 10], 'region-level map group')

audit = JSON.parse(File.read(File.expand_path('../audit/full_event_audit.json', __dir__)))
TGOMManager::SAFE_ROUTINE.each do |map_id, events|
  audited_map = audit['maps'].find { |map| map['map_id'] == map_id }
  events.each do |event_id, specs|
    audited_event = audited_map['events'].find { |event| event['event_id'] == event_id }
    specs.each do |type, name, version, reputation, switch|
      found = audited_event['pages'].any? do |page|
        trainer = page['trainer_battle']
        trainer && trainer['type'] == type.to_s && trainer['name'] == name &&
          trainer['version'] == version && trainer['reputation'] == reputation &&
          trainer['self_switch'] == switch
      end
      assert(found, "runtime tuple exists in full audit: #{map_id}/#{event_id}/#{name}/#{version}")
    end
  end
end
candidate_maps = audit['maps'].select { |map| map['events'].any? { |event| event['pages'].any? { |page| page['routine_allowlisted'] } } }.map { |map| map['map_id'] }
assert((candidate_maps - TGOMManager::SAFE_ROUTINE.keys) == [12], 'all candidates explicitly promoted or story-excluded')
assert(PokemonEncounters.new.encounter_triggered?(:Land, false, true) == false, 'step encounter off')
assert(PokemonEncounters.new.encounter_triggered?(:Land, false, false) == :original, 'script encounter preserved')
TGOMManager.state[:gym_location] = [4, 1, 1, 2]
assert(!TGOMManager.travel_to_gym, 'protected travel rejected')
puts "#{$assertions} assertions passed"
