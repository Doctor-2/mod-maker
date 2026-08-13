# Pure-unit harness. Extracted-data assertions are below and are labelled.
class PokemonGlobalMetadata; end
class PokemonEncounters; def encounter_triggered?(*); :original; end; end
module EventHandlers; def self.add(*); end; end
require 'json'
load File.expand_path('../TGOM_Manager_Mode.rb', __dir__)

def assert(value, message); raise message unless value; $assertions += 1; end
$assertions = 0
$PokemonGlobal = PokemonGlobalMetadata.new
$game_variables = Array.new(200, 0)
$game_switches = Array.new(300, false)
$game_self_switches = {}
StatsStub = Struct.new(:battle_money_gained)
$stats = StatsStub.new(0)

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

# Unit: approved token sources are idempotent; Reputation is not a source.
$game_variables[29] = 900
TGOMManager.sync_token_hooks
assert(TGOMManager.state[:scout_tokens] == 0, 'Reputation does not grant tokens')
$game_switches[104] = true
$game_switches[110] = true
$game_switches[101] = true
$game_variables[52] = 7
$game_variables[66] = 3
TGOMManager.sync_token_hooks
assert(TGOMManager.state[:scout_tokens] == 3, 'rank, area and completed shift tokens')
TGOMManager.sync_token_hooks
assert(TGOMManager.state[:scout_tokens] == 3, 'approved hooks idempotent')

# Unit: page conditions and exact post-win state.
$game_switches[104] = false
$game_variables[29] = 0; $game_variables[34] = 0
result = TGOMManager.clear_region(3)
assert(result == {:battles => 3, :money => 1620, :reputation => 35}, 'rank-zero pages clear')
assert($game_variables[34] == 35, 'Highest Reputation follows Reputation')
assert($stats.battle_money_gained == 1620, 'battle money statistic updated')
assert(TGOMManager.clear_region(3)[:battles] == 0, 'repeat before Rank 1 is idempotent')
assert(!$game_self_switches[[3, 1, 'B']], 'Rank 1 B page not prematurely cleared')
$game_switches[104] = true
assert(TGOMManager.clear_region(3)[:battles] == 3, 'Rank 1 pages become eligible once')
assert(TGOMManager.clear_region(3)[:battles] == 0, 'Rank 1 pages remain idempotent')

# Unit: report consumes once, persists, resolves once, and applies soft recency.
class << TGOMManager
  alias test_original_available_scout_pool available_scout_pool
  def available_scout_pool; [[:A, 10], [:B, 8], [:C, 6], [:D, 4]]; end
end
TGOMManager.state[:scout_tokens] = 1
report = TGOMManager.create_report(Random.new(4))
assert(report.length == 3 && report.uniq.length == 3, 'three unique report candidates')
assert(TGOMManager.state[:scout_tokens] == 0, 'token consumed on report creation')
assert(TGOMManager.create_report(Random.new(99)) == report, 'unresolved report cannot reroll')
assert(TGOMManager.resolve_report(nil, report[0]), 'reject report and blacklist one')
assert(TGOMManager.state[:blacklist].include?(report[0]), 'rejected species blacklisted')
assert(!TGOMManager.resolve_report, 'report resolves only once')
assert(TGOMManager.scout_candidates([[:A, 1], [:B, 1], [:C, 1]], 3).include?(:B), 'recent species soft-weighted, not blocked')
assert(TGOMManager.scout_candidates([[:CHARMANDER, 99]]).empty?, 'protected gift cannot be scouted')

# Unit: Training passes a live scene-compatible context to Essentials pbChangeLevel.
PokemonStub = Struct.new(:level)
$player.party = [PokemonStub.new(5)]
$training_scene_ok = false
def pbChangeLevel(pokemon, target, scene)
  scene.pbRefresh
  scene.pbUpdate
  $training_scene_ok = true
  pokemon.level = target
end
assert(TGOMManager.train_party == 1, 'party member trained')
assert($training_scene_ok && $player.party[0].level == 15, 'scene-compatible level change path')

# Extracted TGOM data contract: every runtime tuple and condition matches audit.
audit = JSON.parse(File.read(File.expand_path('../audit/full_event_audit.json', __dir__)))
TGOMManager::SAFE_ROUTINE.each do |map_id, events|
  audited_map = audit['maps'].find { |map| map['map_id'] == map_id }
  events.each do |event_id, specs|
    audited_event = audited_map['events'].find { |event| event['event_id'] == event_id }
    specs.each do |type, name, version, reputation, switch|
      page = audited_event['pages'].find do |candidate|
        trainer = candidate['trainer_battle']
        trainer && trainer.values_at('type', 'name', 'version', 'reputation', 'self_switch') ==
          [type.to_s, name, version, reputation, switch]
      end
      assert(page, "audited tuple #{map_id}/#{event_id}/#{name}/#{version}")
      assert(page['variable_operations'].any? { |op| op['first'] == 34 && op['operand'] == 29 }, 'Highest Reputation post-win operation audited')
      runtime = TGOMManager::ROUTINE_CONDITIONS[map_id][event_id][version]
      assert(page['condition']['switch1'] == runtime[:switch1], 'exact page switch condition')
    end
  end
end
candidate_maps = audit['maps'].select { |map| map['events'].any? { |event| event['pages'].any? { |page| page['routine_allowlisted'] } } }.map { |map| map['map_id'] }
assert((candidate_maps - TGOMManager::SAFE_ROUTINE.keys) == [12], 'story candidate explicitly excluded')
assert((TGOMManager::SAFE_ROUTINE.keys & TGOMManager::PROTECTED_MAPS).empty?, 'Cave chain protected')
assert(PokemonEncounters.new.encounter_triggered?(:Land, false, true) == false, 'step encounter suppressed')
assert(PokemonEncounters.new.encounter_triggered?(:Land, false, false) == :original, 'script encounter preserved')

puts "#{$assertions} assertions passed (unit + extracted-data contract; no live game runtime)"
