# Pure-unit harness. Extracted-data assertions are below and are labelled.
class PokemonGlobalMetadata; end
class PokemonEncounters; def encounter_triggered?(*); :original; end; end
module EventHandlers; def self.add(*); end; end
module TrainerBattle
  def self.start(*); :battle_started; end
end
$exp_gain = true
def setBattleRule(rule); $exp_gain = false if rule == "noexp"; end
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
assert(TGOMManager.state[:scout_tokens] == 2, 'rank and area tokens')
TGOMManager.sync_token_hooks
assert(TGOMManager.state[:scout_tokens] == 2, 'approved hooks idempotent')

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

# Unit regression: RPG Maker selects the highest condition-valid page.
$PokemonGlobal = PokemonGlobalMetadata.new
$game_self_switches = {}; $game_switches[104] = true
$game_variables[29] = 0; $game_variables[34] = 0
result = TGOMManager.clear_region(3)
assert(result[:battles] == 3 && result[:reputation] == 50, 'Rank 1 active pages clear directly')
assert(!$game_self_switches[[3, 1, 'A']] && $game_self_switches[[3, 1, 'B']], 'v1/B selected, never v0/A')

# Unit: field operations select an observed region while physically in the Gym.
MapStub = Struct.new(:map_id)
$game_map = MapStub.new(31)
$PokemonGlobal = PokemonGlobalMetadata.new
$game_self_switches = {}; $game_switches[104] = false
TGOMManager.state[:observed_unlocks][3] = true
assert(TGOMManager.available_routine_regions.key?(:winding_woods), 'observed region offered from Gym')
assert(TGOMManager.clear_routine_region(:winding_woods)[:battles] == 3, 'region operation clears trainers independently of current Gym map')

# Unit: exactly three Map031/Event4 outcomes complete one shift; Gym losses do
# not enter the explicit emergency allowlist.
EventStub = Struct.new(:id)
InterpreterStub = Struct.new(:event) do
  def get_self; event; end
end
$game_map = MapStub.new(31)
$interpreter = InterpreterStub.new(EventStub.new(4))
def pbMapInterpreter; $interpreter; end
def pbMapInterpreterRunning?; true; end
$game_variables[52] = 9
before_tokens = TGOMManager.state[:scout_tokens]
assert(TGOMManager.record_gym_shift_battle(1), 'first Gym challenger win counted')
assert(TGOMManager.record_gym_shift_battle(2), 'second Gym challenger loss counted')
assert(TGOMManager.state[:scout_tokens] == before_tokens, 'no early shift token')
assert(TGOMManager.record_gym_shift_battle(1), 'third challenger counted')
assert(TGOMManager.state[:scout_tokens] == before_tokens + 1, 'one token after third challenger')
assert(!TGOMManager.record_gym_shift_battle(2), 'completed shift source idempotent')
assert(!TGOMManager.important_loss(2, true), 'ordinary Gym challenger has no emergency token')
$exp_gain = true
TrainerBattle.start(:YOUNGSTER, "Dennis", 0)
assert(!$exp_gain, 'Map31 Event4 challenger disables Exp and EV gain')
$game_map = MapStub.new(3); $interpreter.event = EventStub.new(1)
$exp_gain = true
TrainerBattle.start(:LASS, "Ellen", 0)
assert($exp_gain, 'ordinary field TrainerBattle keeps normal Exp and EV gain')
$game_map = MapStub.new(1); $interpreter.event = EventStub.new(24)
emergency_before = TGOMManager.state[:scout_tokens]
assert(TGOMManager.important_loss(2, true), 'explicit Rough Rider story loss grants emergency token')
assert(TGOMManager.state[:scout_tokens] == emergency_before + 1, 'emergency token added once')
assert(!TGOMManager.important_loss(2, true), 'stable emergency battle ID idempotent')
$game_map = MapStub.new(4)
TGOMManager.state[:gym_location] = [31, 1, 1, 2]
assert(!TGOMManager.travel_to_gym, 'protected Cave origin cannot travel to Gym')
assert(!TGOMManager.travel_to_destination(:new_day_plain), 'protected Cave origin cannot use story travel')
TGOMManager.state[:travel_origin] = [2, 1, 1, 2]
assert(!TGOMManager.return_from_gym, 'protected Cave origin cannot Return')
$game_map = MapStub.new(12)
assert(!TGOMManager.safe_current_origin?, 'story-sensitive non-Cave origin rejected')
$game_map = MapStub.new(2)
assert(TGOMManager.safe_current_origin?, 'audited safe origin accepted')
PlayerMapStub = Struct.new(:x, :y, :direction) do
  def cancel_vehicles; end
end
TempStub = Struct.new(:player_new_map_id, :player_new_x, :player_new_y,
                      :player_new_direction, :player_transferring)
$game_player = PlayerMapStub.new(4, 5, 2)
$game_temp = TempStub.new
def pbMapInterpreterRunning?; false; end
assert(TGOMManager.travel_to_destination(:new_day_plain), 'safe origin can travel')
assert($game_temp.player_new_map_id == 2 && $game_temp.player_transferring, 'safe entrance transfer scheduled')

# Unit regressions: old saves use the canonical Gym entrance, and the Cave only
# becomes an approved origin after Lillith's starter reward completes.
$game_map = MapStub.new(2)
TGOMManager.state[:gym_location] = nil
assert(TGOMManager.travel_to_gym, 'old save without Gym observation can travel')
assert([$game_temp.player_new_map_id, $game_temp.player_new_x, $game_temp.player_new_y, $game_temp.player_new_direction] == [15, 7, 10, 8], 'old save uses canonical Map15 Gym entrance')
$game_map = MapStub.new(15)
assert(TGOMManager.return_from_gym, 'Return from Gym restores previous safe location')
assert([$game_temp.player_new_map_id, $game_temp.player_new_x, $game_temp.player_new_y, $game_temp.player_new_direction] == [2, 4, 5, 2], 'Return restores exact previous coordinates')
$game_self_switches[[6, 3, "A"]] = false
[5, 6].each do |map_id|
  $game_map = MapStub.new(map_id)
  assert(!TGOMManager.travel_to_gym, "pre-reward Map#{map_id} blocked")
end
$game_self_switches[[6, 3, "A"]] = true
[5, 6].each do |map_id|
  $game_map = MapStub.new(map_id)
  assert(TGOMManager.travel_to_gym, "post-reward Map#{map_id} can travel to Gym")
end
[5, 6].each do |map_id|
  $game_map = MapStub.new(map_id)
  assert(TGOMManager.travel_to_destination(:new_day_plain), "post-reward Map#{map_id} can use Story Destination")
end

# Unit: encounter areas require an official switch or a legitimate visit.
TGOMManager.state[:observed_unlocks].clear
$game_switches[110] = false
assert(!TGOMManager.encounter_map_unlocked?(7), 'unobserved ordinary area excluded')
TGOMManager.state[:observed_unlocks][7] = true
assert(TGOMManager.encounter_map_unlocked?(7), 'visited ordinary area included')
assert(!TGOMManager.encounter_map_unlocked?(18, 110), 'future official area excluded')
$game_switches[110] = true
assert(TGOMManager.encounter_map_unlocked?(18, 110), 'officially unlocked area included')

# Unit: report consumes once, persists, resolves once, and applies soft recency.
class << TGOMManager
  alias test_original_available_scout_pool available_scout_pool
  def available_scout_pool; [[:A, 10, 3, 5], [:B, 8, 6, 6], [:C, 6, 7, 9], [:D, 4, 10, 12]]; end
end
TGOMManager.state[:scout_tokens] = 1
report = TGOMManager.create_report(Random.new(4))
assert(report.length == 3 && report.uniq.length == 3, 'three unique report candidates')
assert(report.all? { |candidate| candidate[:level].between?(*({:A=>[3,5],:B=>[6,6],:C=>[7,9],:D=>[10,12]}[candidate[:species]])) }, 'report preserves legal encounter level')
assert(TGOMManager.state[:scout_tokens] == 0, 'token consumed on report creation')
assert(TGOMManager.create_report(Random.new(99)) == report, 'unresolved report cannot reroll')
assert(TGOMManager.resolve_report(nil, report[0][:species]), 'reject report and blacklist one')
assert(TGOMManager.state[:blacklist].include?(report[0][:species]), 'rejected species blacklisted')
assert(!TGOMManager.resolve_report, 'report resolves only once')
assert(TGOMManager.scout_candidates([[:A, 1, 1, 1], [:B, 1, 1, 1], [:C, 1, 1, 1]], 3).any? { |candidate| candidate[:species] == :B }, 'recent species soft-weighted, not blocked')
assert(TGOMManager.scout_candidates([[:CHARMANDER, 99]]).empty?, 'protected gift cannot be scouted')

# Unit: recruited report candidate uses its rolled wild level, then Training is
# the only operation which raises it to the Gym target.
class Pokemon
  attr_accessor :level
  attr_reader :species
  def initialize(species, level); @species = species; @level = level; end
end
def pbAddPokemonSilent(pokemon); $player.party << pokemon; true; end
TGOMManager.state[:active_report] = [{:species => :B, :level => 6}, {:species => :C, :level => 8}]
$player.party = []
assert(TGOMManager.resolve_report(:B), 'wild-level candidate recruited')
assert($player.party[0].level == 6, 'recruit uses persisted encounter level, not Gym target')

# Unit: Rank0 Training defaults to 12, persists the player's selected 9–13
# target, passes a live scene, and never lowers a Pokemon above the target.
$game_switches[104] = false
$game_switches[115] = false
assert(TGOMManager.gym_training_target == 12, 'Rank0 Training target defaults to level 12')
(9..13).each { |level| assert(TGOMManager.set_training_target(level), "Rank0 Training target accepts level #{level}") }
assert(!TGOMManager.set_training_target(14), 'Rank0 Training target rejects levels outside 9 through 13')
TGOMManager.state
assert(TGOMManager.gym_training_target == 13, 'chosen Rank0 Training target persists')
$game_switches[104] = true
assert(TGOMManager.gym_training_target == 15, 'Rank1 retains its automatic training target')
$game_switches[104] = false
$player.party = [$player.party[0], Pokemon.new(:A, 14)]
$training_scene_ok = false
def pbChangeLevel(pokemon, target, scene)
  scene.pbRefresh
  scene.pbUpdate
  $training_scene_ok = true
  pokemon.level = target
end
assert(TGOMManager.train_party == 1, 'party member trained')
assert($training_scene_ok && $player.party[0].level == 13, 'Rank0 Training raises recruit to chosen target')
assert($player.party[1].level == 14, 'Rank0 Training never lowers a Pokemon above target')

# Extracted TGOM data contract: every runtime tuple and condition matches audit.
audit = JSON.parse(File.read(File.expand_path('../audit/full_event_audit.json', __dir__)))
TGOMManager::SAFE_ROUTINE.each do |map_id, events|
  audited_map = audit['maps'].find { |map| map['map_id'] == map_id }
  events.each do |event_id, specs|
    audited_event = audited_map['events'].find { |event| event['event_id'] == event_id }
    audited_stack = audited_event['pages'].map do |page|
      condition = page['condition'].each_with_object({}) do |(key, value), hash|
        hash[key.to_sym] = value if value
      end
      version = page['trainer_battle'] && page['trainer_battle']['version']
      [condition, version]
    end
    assert(audited_stack == TGOMManager::ROUTINE_PAGE_STACKS[map_id][event_id], 'complete ordered page stack audited')
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
